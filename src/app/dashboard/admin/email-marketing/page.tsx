'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, ArrowLeft, Mail, Image as ImageIcon, Text, Send, Eye, Code, Users, Briefcase, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import type { EmailCampaignContent, Vacancy, Course, UserProfile } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getVacancies } from '@/lib/vacancy-service';
import { getCourses } from '@/lib/course-service';
import { users as allUsers } from '@/lib/users';
import { applications as allApplications } from '@/lib/applications'; // Import applications
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


const formSchema = z.object({
  topic: z.string().min(1, "O tópico é obrigatório."),
  tone: z.enum(['Profissional', 'Amigável', 'Urgente']),
  language: z.enum(['Português', 'Inglês']),
  template: z.enum(['simple', 'withImage']),
  buttonText: z.string().min(1, "O texto do botão é obrigatório."),
  buttonLink: z.string().url("Por favor, insira um URL válido."),
  audienceType: z.enum(['all', 'course_students', 'vacancy_candidates', 'candidates_by_area']),
  targetCourseId: z.string().optional(),
  targetVacancyId: z.string().optional(),
  targetFunctionalAreas: z.array(z.string()).optional(),
}).refine(data => {
    if (data.audienceType === 'course_students') return !!data.targetCourseId;
    if (data.audienceType === 'vacancy_candidates') return !!data.targetVacancyId;
    if (data.audienceType === 'candidates_by_area') return !!data.targetFunctionalAreas && data.targetFunctionalAreas.length > 0;
    return true;
}, {
    message: "Por favor, selecione uma opção específica para este público.",
    path: ['targetCourseId'], // Applies to the first conditional field, but signals the group issue
});


type FormValues = z.infer<typeof formSchema>;

export default function EmailMarketingPage() {
  const [generatedContent, setGeneratedContent] = useState<EmailCampaignContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [functionalAreas, setFunctionalAreas] = useState<string[]>([]);
  const [audienceCount, setAudienceCount] = useState<number>(0);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setVacancies(getVacancies(true)); // Get all vacancies, including expired
    setCourses(getCourses());

    const areas = [...new Set(
        allUsers
            .filter(user => user.userType === 'student' && user.functionalArea)
            .map(user => user.functionalArea!)
    )].sort();
    setFunctionalAreas(areas);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Lançamento de um novo curso de Liderança",
      tone: 'Profissional',
      language: 'Português',
      template: 'withImage',
      buttonText: "Saber Mais",
      buttonLink: "https://nexustalent.com/courses/new-leadership-course",
      audienceType: 'all',
      targetFunctionalAreas: [],
    },
  });

  const watchedValues = form.watch(['audienceType', 'targetCourseId', 'targetVacancyId', 'targetFunctionalAreas']);
  
  useEffect(() => {
    const [type, courseId, vacancyId, areas] = watchedValues;
    let count = 0;
    switch (type) {
      case 'all':
        count = allUsers.length;
        break;
      case 'course_students':
        // Mock: Assume between 15 and 50 students for any course
        if (courseId) count = Math.floor(Math.random() * (50 - 15 + 1)) + 15;
        break;
      case 'vacancy_candidates':
        if (vacancyId) {
          count = new Set(allApplications.filter(app => app.jobPostingId === vacancyId).map(app => app.userId)).size;
        }
        break;
      case 'candidates_by_area':
        if (areas && areas.length > 0) {
            count = allUsers.filter(user => user.functionalArea && areas.includes(user.functionalArea)).length;
        }
        break;
    }
    setAudienceCount(count);
  }, [watchedValues]);


  const audienceType = form.watch('audienceType');

  const handleGenerateContent: SubmitHandler<FormValues> = async (data) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateEmailCampaignAction(data);
      if (!result) throw new Error("A IA não retornou conteúdo.");
      
      form.setValue('buttonText', result.buttonText);
      form.setValue('buttonLink', result.buttonLink);
      setGeneratedContent(result);

      toast({
        title: "Conteúdo Gerado com Sucesso!",
        description: "O rascunho do seu e-mail foi criado. Edite-o e envie.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao Gerar Conteúdo',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendCampaign = () => {
    if (!generatedContent) return;
    setIsSending(true);
    // Simulação de envio
    setTimeout(() => {
      toast({
        title: "Campanha Enviada! (Simulação)",
        description: `O e-mail "${generatedContent.subject}" foi enviado para ${audienceCount} destinatário(s).`,
      });
      setIsSending(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2"><Mail /> Criador de Campanhas de E-mail</CardTitle>
          <CardDescription>Gere e envie campanhas de e-mail profissionais com o poder da IA, com controlo total sobre o HTML.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateContent)} className="space-y-6">
              <h3 className="text-lg font-semibold pt-4">1. Defina o Conteúdo do E-mail</h3>
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>Tópico ou Objetivo do E-mail</FormLabel>
                  <FormControl><Textarea placeholder="Ex: Promover o novo curso de Power BI" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
              <div className="grid md:grid-cols-3 gap-4">
                <FormField control={form.control} name="tone" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tom</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Profissional">Profissional</SelectItem><SelectItem value="Amigável">Amigável</SelectItem><SelectItem value="Urgente">Urgente</SelectItem></SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                  <FormField control={form.control} name="language" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent><SelectItem value="Português">Português</SelectItem><SelectItem value="Inglês">Inglês</SelectItem></SelectContent>
                    </Select>
                  </FormItem>
                )}/>
                  <FormField control={form.control} name="template" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="withImage"><div className='flex items-center gap-2'><ImageIcon size={16}/> Com Imagem</div></SelectItem>
                        <SelectItem value="simple"><div className='flex items-center gap-2'><Text size={16}/> Simples</div></SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}/>
              </div>

               <h3 className="text-lg font-semibold border-t pt-6">2. Segmente o Público-Alvo</h3>
                <div className="flex items-center gap-4">
                    <FormField control={form.control} name="audienceType" render={({ field }) => (
                        <FormItem className="flex-grow">
                            <FormLabel>Enviar para:</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue/></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="all"><div className="flex items-center gap-2"><Users size={16}/> Todos os Usuários</div></SelectItem>
                                    <SelectItem value="course_students"><div className="flex items-center gap-2"><GraduationCap size={16}/> Formandos de um Curso</div></SelectItem>
                                    <SelectItem value="vacancy_candidates"><div className="flex items-center gap-2"><Briefcase size={16}/> Candidatos a uma Vaga</div></SelectItem>
                                    <SelectItem value="candidates_by_area"><div className="flex items-center gap-2"><Briefcase size={16}/> Candidatos por Área Funcional</div></SelectItem>
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}/>
                     <div className="pt-6">
                        <Badge variant="secondary" className="text-lg px-4 py-2">
                           <Users className="mr-2 h-5 w-5" /> {audienceCount}
                        </Badge>
                    </div>
                </div>

                {audienceType === 'course_students' && (
                    <FormField control={form.control} name="targetCourseId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Selecione o Curso</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione o curso..."/></SelectTrigger></FormControl>
                                <SelectContent>
                                    {courses.map(course => (
                                        <SelectItem key={course.id} value={course.id}>{course.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                )}
                 {audienceType === 'vacancy_candidates' && (
                    <FormField control={form.control} name="targetVacancyId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Selecione a Vaga</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Selecione a vaga..."/></SelectTrigger></FormControl>
                                <SelectContent>
                                    {vacancies.map(vacancy => (
                                        <SelectItem key={vacancy.id} value={vacancy.id}>{vacancy.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}/>
                )}
                {audienceType === 'candidates_by_area' && (
                    <FormField
                        control={form.control}
                        name="targetFunctionalAreas"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Selecione a(s) Área(s) Funcional(is)</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value?.length && "text-muted-foreground"
                                                )}
                                            >
                                                <span className='truncate'>
                                                {field.value && field.value.length > 0 ? field.value.join(', ') : "Selecione as áreas..."}
                                                </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            <CommandInput placeholder="Pesquisar área..." />
                                            <CommandEmpty>Nenhuma área encontrada.</CommandEmpty>
                                            <CommandGroup>
                                                {functionalAreas.map((area) => (
                                                    <CommandItem
                                                        value={area}
                                                        key={area}
                                                        onSelect={() => {
                                                            const currentValue = field.value || [];
                                                            const newValue = currentValue.includes(area)
                                                                ? currentValue.filter((a) => a !== area)
                                                                : [...currentValue, area];
                                                            field.onChange(newValue);
                                                        }}
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                field.value?.includes(area) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        {area}
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

              <h3 className="text-lg font-semibold border-t pt-6">3. Detalhes do Call-to-Action</h3>
                <FormField control={form.control} name="buttonText" render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do Botão</FormLabel>
                  <FormControl><Input placeholder="Ex: Inscreva-se Agora" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>
                <FormField control={form.control} name="buttonLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Botão</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}/>


              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Gerar Conteúdo do E-mail
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Separator className="my-8" />

      {isGenerating ? (
         <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">A IA está a criar o seu e-mail profissional...</p>
        </div>
      ) : generatedContent && (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className='font-headline text-2xl'>Resultado</h2>
                 <Button onClick={handleSendCampaign} disabled={!generatedContent || isSending || audienceCount === 0}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Enviar Campanha
                </Button>
            </div>
            <div>
                 <Label htmlFor="edit-subject">Assunto do E-mail</Label>
                 <Input id="edit-subject" value={generatedContent.subject} onChange={(e) => setGeneratedContent({...generatedContent, subject: e.target.value})} className="max-w-lg"/>
            </div>
            <div className="grid lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                    <Label htmlFor="html-editor" className='flex items-center gap-2'><Code size={16}/> Editor HTML</Label>
                    <Textarea 
                        id="html-editor"
                        value={generatedContent.bodyHtml}
                        onChange={(e) => setGeneratedContent(prev => prev ? {...prev, bodyHtml: e.target.value} : null)}
                        className="h-[60vh] font-mono text-xs"
                        placeholder="O código HTML do seu e-mail aparecerá aqui."
                    />
                </div>
                 <div className="space-y-2">
                    <Label className='flex items-center gap-2'><Eye size={16}/> Pré-visualização</Label>
                    <div className="border rounded-lg h-[60vh] overflow-y-auto">
                        <iframe 
                            srcDoc={generatedContent.bodyHtml}
                            title="Pré-visualização do E-mail"
                            className="w-full h-full border-0"
                            sandbox="allow-same-origin" // For security
                        />
                    </div>
                </div>
            </div>
        </div>
      )}
      
    </div>
  );
}