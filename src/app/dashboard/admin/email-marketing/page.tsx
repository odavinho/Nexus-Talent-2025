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
import { Loader2, Wand2, ArrowLeft, Mail, Image as ImageIcon, Text, Send, Eye, Code, Link as LinkIcon, LayoutTemplate, Users, BookOpen, Briefcase, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import type { EmailCampaignContent, Course, Vacancy } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getTemplates, type EmailTemplate } from '@/lib/email-templates';
import { users as allUsers } from '@/lib/users';
import { getCourses } from '@/lib/course-service';
import { getVacancies } from '@/lib/vacancy-service';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const formSchema = z.object({
  topic: z.string().min(1, "O tópico é obrigatório."),
  tone: z.enum(['Profissional', 'Amigável', 'Urgente']),
  language: z.enum(['Português', 'Inglês']),
  template: z.string().min(1, "É obrigatório selecionar um template."),
  // Audience
  segments: z.array(z.string()).optional(),
  targetCourses: z.array(z.string()).optional(),
  targetVacancies: z.array(z.string()).optional(),
  // Editable fields
  subject: z.string().optional(),
  imageUrl: z.string().url("Insira um URL válido ou deixe em branco.").optional().or(z.literal('')),
  imageUrl2: z.string().url("Insira um URL válido ou deixe em branco.").optional().or(z.literal('')),
  buttonText: z.string().optional(),
  buttonLink: z.string().url("Por favor, insira um URL válido.").optional().or(z.literal('')),
});


type FormValues = z.infer<typeof formSchema>;
type GeneratedContent = EmailCampaignContent;

export default function EmailMarketingPage() {
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const templates = getTemplates();
  const [audienceCount, setAudienceCount] = useState(0);
  const [courses, setCourses] = useState<Course[]>([]);
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Lançamento de um novo curso de Liderança",
      tone: 'Profissional',
      language: 'Português',
      template: 'newsletter',
      segments: [],
      targetCourses: [],
      targetVacancies: [],
      subject: '',
      imageUrl: '',
      imageUrl2: '',
      buttonText: "",
      buttonLink: "",
    },
  });
  
  const selectedTemplateId = form.watch('template');
  const imageUrl1 = form.watch('imageUrl');
  const imageUrl2 = form.watch('imageUrl2');
  const [currentBodyHtml, setCurrentBodyHtml] = useState<string | null>(null);

  const watchSegments = form.watch('segments');
  const watchCourses = form.watch('targetCourses');
  const watchVacancies = form.watch('targetVacancies');

  useEffect(() => {
    setCourses(getCourses());
    setVacancies(getVacancies(true));
  }, []);

  useEffect(() => {
    const selectedSegments = watchSegments || [];
    // This is a placeholder for a more complex logic
    const addedUsers = new Set<string>();

    if(selectedSegments.includes('all')) {
        allUsers.forEach(u => addedUsers.add(u.id));
    } else {
        if (selectedSegments.includes('students')) {
            allUsers.filter(u => u.userType === 'student').forEach(u => addedUsers.add(u.id));
        }
        if (selectedSegments.includes('recruiters')) {
            allUsers.filter(u => u.userType === 'recruiter').forEach(u => addedUsers.add(u.id));
        }
    }
    setAudienceCount(addedUsers.size);
  }, [watchSegments, watchCourses, watchVacancies]);


  // Effect to update the preview when image URLs change or generated content is set
  useEffect(() => {
    if (generatedContent) {
      let updatedHtml = generatedContent.bodyHtml;
      
      updatedHtml = updatedHtml.replace(/\[IMAGE_URL_1\]/g, imageUrl1 || 'https://placehold.co/600x300?text=Imagem+Principal');
      updatedHtml = updatedHtml.replace(/\[IMAGE_URL_2\]/g, imageUrl2 || 'https://placehold.co/600x300?text=Imagem+Secundária');
      
      setCurrentBodyHtml(updatedHtml);
    }
  }, [generatedContent, imageUrl1, imageUrl2]);


  const handleGenerateContent: SubmitHandler<Pick<FormValues, 'topic' | 'tone' | 'language' | 'template'>> = async (data) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    setCurrentBodyHtml(null);

    try {
      const result = await generateEmailCampaignAction({
        topic: data.topic,
        tone: data.tone,
        language: data.language,
        template: data.template
      });
      
      if (!result) throw new Error("A IA não retornou conteúdo.");
      
      setGeneratedContent(result);
      // This is the fix: immediately update the preview HTML state after generation
      let updatedHtml = result.bodyHtml
        .replace(/\[IMAGE_URL_1\]/g, form.getValues('imageUrl') || 'https://placehold.co/600x300?text=Imagem+Principal')
        .replace(/\[IMAGE_URL_2\]/g, form.getValues('imageUrl2') || 'https://placehold.co/600x300?text=Imagem+Secundária');
      setCurrentBodyHtml(updatedHtml);


      form.setValue('subject', result.subject);
      form.setValue('buttonText', result.buttonText);
      form.setValue('buttonLink', result.buttonLink);

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
    setTimeout(() => {
      toast({
        title: "Campanha Enviada! (Simulação)",
        description: `O e-mail "${form.getValues('subject')}" foi enviado para ${audienceCount} destinatários.`,
      });
      setIsSending(false);
      router.push('/dashboard/admin/campaigns');
    }, 1500);
  };
  
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <Form {...form}>
        <form className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl flex items-center gap-2"><Mail /> Criador de Campanhas de E-mail</CardTitle>
              <CardDescription>Gere e envie campanhas de e-mail profissionais com o poder da IA, escolhendo o seu template visual preferido.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">1. Selecione um Template</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={cn(
                          "border-2 rounded-lg cursor-pointer hover:border-primary transition-all p-2 bg-muted/50 overflow-hidden",
                          selectedTemplateId === template.id ? 'border-primary' : 'border-transparent'
                        )}
                        onClick={() => form.setValue('template', template.id)}
                      >
                         <div className='bg-white rounded-md overflow-hidden shadow-inner aspect-video'>
                           <div className="w-full h-full scale-[0.25] origin-top-left -m-[1px] transform">
                              <iframe 
                                  srcDoc={template.html}
                                  title={template.name}
                                  className="w-[1200px] h-[900px] border-0"
                                  sandbox=""
                                  scrolling="no"
                              />
                          </div>
                        </div>
                        <p className="text-center font-medium p-2 text-sm text-foreground">{template.name}</p>
                      </Card>
                    ))}
                  </div>
                  <FormField control={form.control} name="template" render={({ field }) => ( <FormItem><FormMessage className="mt-2" /></FormItem> )} />
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">2. Defina o Conteúdo</h3>
                  <div className='space-y-6'>
                      <FormField control={form.control} name="topic" render={({ field }) => (
                          <FormItem>
                          <FormLabel>Tópico ou Objetivo do E-mail</FormLabel>
                          <FormControl><Textarea placeholder="Ex: Promover o novo curso de Power BI" {...field} /></FormControl>
                          <FormMessage />
                          </FormItem>
                      )}/>
                      <div className="grid md:grid-cols-2 gap-4">
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
                      </div>
                      <Button type="button" onClick={form.handleSubmit(handleGenerateContent)} disabled={isGenerating} className="w-full text-lg py-6">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Gerar Texto do E-mail com IA
                      </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
      
          <Separator className="my-8" />
          
           {isGenerating ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">A IA está a criar o seu e-mail profissional...</p>
            </div>
          ) : generatedContent && (
            <div className="space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className='font-headline text-2xl'>3. Defina o Público-Alvo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex justify-between items-start gap-8'>
                           <Tabs defaultValue="segments" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="segments">Segmentos</TabsTrigger>
                                    <TabsTrigger value="courses">Cursos</TabsTrigger>
                                    <TabsTrigger value="vacancies">Vagas</TabsTrigger>
                                </TabsList>
                                <TabsContent value="segments" className='pt-4'>
                                    <div className="space-y-2">
                                        <FormField control={form.control} name="segments" render={({ field }) => (
                                            <>
                                                <FormItem className="flex items-center space-x-2"><Checkbox id="seg-all" checked={field.value?.includes('all')} onCheckedChange={(checked) => checked ? field.onChange(['all', 'students', 'recruiters']) : field.onChange([])} /><label htmlFor="seg-all" className='cursor-pointer'>Todos os Utilizadores</label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><Checkbox id="seg-students" checked={field.value?.includes('students')} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), 'students']) : field.onChange(field.value?.filter(v => v !== 'students'))} /><label htmlFor="seg-students" className='cursor-pointer'>Apenas Formandos</label></FormItem>
                                                <FormItem className="flex items-center space-x-2"><Checkbox id="seg-recruiters" checked={field.value?.includes('recruiters')} onCheckedChange={(checked) => checked ? field.onChange([...(field.value || []), 'recruiters']) : field.onChange(field.value?.filter(v => v !== 'recruiters'))} /><label htmlFor="seg-recruiters" className='cursor-pointer'>Apenas Recrutadores</label></FormItem>
                                            </>
                                        )}/>
                                    </div>
                                </TabsContent>
                                <TabsContent value="courses" className='pt-4 max-h-48 overflow-y-auto space-y-2'>
                                    <p className='text-sm text-muted-foreground mb-2'>Enviar para formandos inscritos em cursos específicos.</p>
                                     <FormField control={form.control} name="targetCourses" render={() => (
                                        <>
                                            {courses.map(course => (
                                                <FormField
                                                    key={course.id}
                                                    control={form.control}
                                                    name="targetCourses"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                checked={field.value?.includes(course.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                    ? field.onChange([...field.value || [], course.id])
                                                                    : field.onChange(field.value?.filter(id => id !== course.id))
                                                                }}
                                                            />
                                                            <label className='cursor-pointer'>{course.name}</label>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </>
                                     )}/>
                                </TabsContent>
                                 <TabsContent value="vacancies" className='pt-4 max-h-48 overflow-y-auto space-y-2'>
                                     <p className='text-sm text-muted-foreground mb-2'>Enviar para candidatos de vagas específicas.</p>
                                     <FormField control={form.control} name="targetVacancies" render={() => (
                                        <>
                                            {vacancies.map(vacancy => (
                                                <FormField
                                                    key={vacancy.id}
                                                    control={form.control}
                                                    name="targetVacancies"
                                                    render={({ field }) => (
                                                        <FormItem className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                checked={field.value?.includes(vacancy.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                    ? field.onChange([...field.value || [], vacancy.id])
                                                                    : field.onChange(field.value?.filter(id => id !== vacancy.id))
                                                                }}
                                                            />
                                                            <label className='cursor-pointer'>{vacancy.title}</label>
                                                        </FormItem>
                                                    )}
                                                />
                                            ))}
                                        </>
                                     )}/>
                                </TabsContent>
                            </Tabs>

                            <div className="text-center p-4 bg-secondary rounded-lg w-64">
                                <p className="text-sm text-muted-foreground">Nº de Destinatários</p>
                                <p className="text-5xl font-bold flex items-center justify-center gap-2"><Users /> {audienceCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>


                <div className="flex justify-between items-center">
                    <h2 className='font-headline text-2xl'>4. Reveja, Edite e Envie</h2>
                    <Button type="button" onClick={handleSendCampaign} disabled={!generatedContent || isSending}>
                        {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Enviar Campanha
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <FormField control={form.control} name="subject" render={({ field }) => (
                              <FormItem>
                                <FormLabel>Assunto do E-mail</FormLabel>
                                <FormControl><Input {...field} /></FormControl>
                              </FormItem>
                            )}/>
                          {selectedTemplate?.imageCount >= 1 && (
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL da Imagem Principal</FormLabel><FormControl><Input placeholder="https://exemplo.com/imagem.png" {...field} /></FormControl></FormItem>)}/>
                          )}
                          {selectedTemplate?.imageCount >= 2 && (
                             <FormField control={form.control} name="imageUrl2" render={({ field }) => (<FormItem><FormLabel>URL da Imagem Secundária</FormLabel><FormControl><Input placeholder="https://exemplo.com/imagem2.png" {...field} /></FormControl></FormItem>)}/>
                          )}
                            <FormField control={form.control} name="buttonText" render={({ field }) => (<FormItem><FormLabel>Texto do Botão</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}/>
                            <FormField control={form.control} name="buttonLink" render={({ field }) => (<FormItem><FormLabel>Link do Botão</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="html-editor" className='flex items-center gap-2'><Code size={16}/> Editor HTML</Label>
                            <Textarea 
                                id="html-editor"
                                value={currentBodyHtml || ''}
                                onChange={(e) => setCurrentBodyHtml(e.target.value)}
                                className="h-[60vh] font-mono text-xs"
                                placeholder="O código HTML do seu e-mail aparecerá aqui."
                            />
                        </div>
                    </CardContent>
                </Card>

                <h3 className="font-headline text-xl">Pré-visualização</h3>
                <div className="border rounded-lg h-[80vh] overflow-hidden bg-white">
                    <iframe 
                        srcDoc={currentBodyHtml || ''}
                        title="Pré-visualização do E-mail"
                        className="w-full h-full border-0"
                        sandbox=""
                    />
                </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
