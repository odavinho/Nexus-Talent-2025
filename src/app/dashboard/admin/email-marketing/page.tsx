
'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, ArrowLeft, Send, Code, Eye, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import { GenerateEmailCampaignInputSchema, type GenerateEmailCampaignOutput } from '@/lib/schemas';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type FormValues = z.infer<typeof GenerateEmailCampaignInputSchema>;

export default function EmailMarketingPage() {
  const [generatedContent, setGeneratedContent] = useState<GenerateEmailCampaignOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(GenerateEmailCampaignInputSchema),
    defaultValues: {
      targetAudience: 'Todos os candidatos',
      emailGoal: '',
      tone: 'Profissional',
      layoutType: 'Texto com Botão',
      ctaLink: 'https://www.nexustalent.com/vacancies',
      imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?q=80&w=1080&auto=format&fit=crop',
    },
  });

  const layoutType = form.watch('layoutType');

  const handleGenerateContent: SubmitHandler<FormValues> = async (data) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const inputForAI: FormValues = { ...data };
      if (inputForAI.layoutType !== 'Imagem, Título e Botão' && data.imageUrl?.startsWith('https://images.unsplash.com')) {
        inputForAI.imageUrl = undefined;
      }
      
      const result = await generateEmailCampaignAction(inputForAI);
      setGeneratedContent(result);
      toast({
        title: "Conteúdo do E-mail Gerado!",
        description: "O conteúdo para a sua campanha foi criado pela IA. Reveja e envie.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar conteúdo',
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendCampaign = () => {
    if (!generatedContent) {
      toast({ variant: 'destructive', title: 'Nenhum conteúdo para enviar.' });
      return;
    }
    setIsSending(true);
    
    setTimeout(() => {
        setIsSending(false);
        toast({
            title: "Campanha Enviada! (Simulação)",
            description: "O seu e-mail foi 'enviado' com sucesso.",
        });
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Criar Campanha de E-mail</CardTitle>
          <CardDescription>
            Defina o seu objetivo e público-alvo, e deixe a IA criar uma campanha de e-mail eficaz para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateContent)} className="space-y-6">
              <FormField
                control={form.control}
                name="emailGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo Principal do E-mail</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Ex: Anunciar novo curso de liderança, promover vagas na área de TI..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Público-Alvo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione o público" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Todos os candidatos">Todos os candidatos</SelectItem>
                                <SelectItem value="Engenheiros de Software">Engenheiros de Software</SelectItem>
                                <SelectItem value="Gestores de Projeto">Gestores de Projeto</SelectItem>
                                <SelectItem value="Alunos de cursos de Finanças">Alunos de cursos de Finanças</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tom do E-mail</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione o tom" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Profissional">Profissional</SelectItem>
                                <SelectItem value="Amigável">Amigável</SelectItem>
                                <SelectItem value="Urgente">Urgente</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="layoutType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Layout do E-mail</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Selecione o layout" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Texto com Botão">Texto com Botão</SelectItem>
                                <SelectItem value="Imagem, Título e Botão">Imagem, Título e Botão</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <FormField
                control={form.control}
                name="ctaLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link do Botão Principal (CTA)</FormLabel>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <FormControl><Input placeholder="https://..." className="pl-9" {...field} /></FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {layoutType === 'Imagem, Título e Botão' && (
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem (opcional)</FormLabel>
                      <div className="relative">
                        <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <FormControl><Input placeholder="https://images.unsplash.com/..." className="pl-9" {...field} /></FormControl>
                      </div>
                       <FormDescription>Deixe em branco para a IA sugerir uma.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                )}
              <Button type="submit" disabled={isGenerating} className="w-full">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Gerar Conteúdo com IA
              </Button>
            </form>
          </Form>
          {isGenerating && (
            <div className="text-center pt-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-muted-foreground">Aguarde, a IA está a criar a sua campanha...</p>
            </div>
          )}
          {generatedContent && (
              <div className="mt-8 pt-6 border-t space-y-6">
              <h3 className="font-headline text-2xl">Conteúdo Gerado</h3>
              <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input id="subject" value={generatedContent.subject} onChange={(e) => setGeneratedContent({ ...generatedContent, subject: e.target.value })} />
              </div>
                <Tabs defaultValue="preview">
                  <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="preview"><Eye className="mr-2 h-4 w-4"/> Pré-visualização</TabsTrigger>
                      <TabsTrigger value="html"><Code className="mr-2 h-4 w-4"/> Editar HTML</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview">
                      <div className="border rounded-md mt-2">
                          <iframe srcDoc={generatedContent.body} className="w-full h-[500px]" sandbox="allow-scripts" title="Pré-visualização do E-mail"/>
                      </div>
                  </TabsContent>
                  <TabsContent value="html">
                      <div className="space-y-2 mt-2">
                          <Label htmlFor="body">Corpo do E-mail (HTML)</Label>
                          <Textarea id="body" value={generatedContent.body} onChange={(e) => setGeneratedContent({ ...generatedContent, body: e.target.value })} rows={20} className="font-mono text-xs"/>
                      </div>
                  </TabsContent>
              </Tabs>
              <Button onClick={handleSendCampaign} disabled={isSending} className="w-full bg-green-600 hover:bg-green-700">
                  {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                  Enviar Campanha (Simulação)
              </Button>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
