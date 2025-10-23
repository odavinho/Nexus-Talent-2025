'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, ArrowLeft, Mail, Image as ImageIcon, Text, Send, Eye, Code, Link as LinkIcon, LayoutTemplate } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import type { EmailCampaignContent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { getTemplates, type EmailTemplate } from '@/lib/email-templates';


const formSchema = z.object({
  topic: z.string().min(1, "O tópico é obrigatório."),
  tone: z.enum(['Profissional', 'Amigável', 'Urgente']),
  language: z.enum(['Português', 'Inglês']),
  template: z.string().min(1, "É obrigatório selecionar um template."), // Now stores template ID
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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Lançamento de um novo curso de Liderança",
      tone: 'Profissional',
      language: 'Português',
      template: 'newsletter',
      subject: '',
      imageUrl: 'https://picsum.photos/seed/1/600/300',
      imageUrl2: 'https://picsum.photos/seed/2/600/300',
      buttonText: "Saber Mais",
      buttonLink: "https://nexustalent.com/courses/new-leadership-course",
    },
  });
  
  const selectedTemplateId = form.watch('template');
  const imageUrl1 = form.watch('imageUrl');
  const imageUrl2 = form.watch('imageUrl2');

  // Effect to update the preview when image URLs change
  useEffect(() => {
      if (generatedContent) {
          let updatedHtml = generatedContent.bodyHtml;
          
          updatedHtml = updatedHtml.replace(/\[IMAGE_URL_1\]/g, imageUrl1 || 'https://placehold.co/600x300?text=Imagem+1');
          updatedHtml = updatedHtml.replace(/\[IMAGE_URL_2\]/g, imageUrl2 || 'https://placehold.co/600x300?text=Imagem+2');

          setGeneratedContent(prev => prev ? {...prev, bodyHtml: updatedHtml} : null);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl1, imageUrl2]);


  const handleGenerateContent: SubmitHandler<FormValues> = async (data) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateEmailCampaignAction({
        topic: data.topic,
        tone: data.tone,
        language: data.language,
        template: data.template
      });
      
      if (!result) throw new Error("A IA não retornou conteúdo.");

      // Fill placeholders with current image URLs
      let finalBodyHtml = result.bodyHtml
        .replace(/\[IMAGE_URL_1\]/g, data.imageUrl || 'https://placehold.co/600x300?text=Imagem+1')
        .replace(/\[IMAGE_URL_2\]/g, data.imageUrl2 || 'https://placehold.co/600x300?text=Imagem+2');
      
      // Update the main form fields based on AI generation
      form.setValue('subject', result.subject);
      form.setValue('buttonText', result.buttonText);
      form.setValue('buttonLink', result.buttonLink);

      setGeneratedContent({...result, bodyHtml: finalBodyHtml});

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
        description: `O e-mail "${generatedContent.subject}" foi enviado.`,
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
        <form onSubmit={form.handleSubmit(handleGenerateContent)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl flex items-center gap-2"><Mail /> Criador de Campanhas de E-mail</CardTitle>
              <CardDescription>Gere e envie campanhas de e-mail profissionais com o poder da IA, escolhendo o seu template visual preferido.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">1. Selecione um Template</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className={cn(
                          "border-2 rounded-lg cursor-pointer hover:border-primary transition-all p-2",
                          selectedTemplateId === template.id ? 'border-primary' : 'border-transparent'
                        )}
                        onClick={() => form.setValue('template', template.id)}
                      >
                        <div className='bg-white rounded-md overflow-hidden'>
                          <div className="aspect-[4/3] scale-[0.2] origin-top-left">
                              <iframe 
                                  srcDoc={template.html}
                                  title={template.name}
                                  className="w-[1200px] h-[900px] border-0"
                                  sandbox=""
                              />
                          </div>
                          <p className="text-center font-medium p-2 text-sm">{template.name}</p>
                        </div>
                      </div>
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
                  </div>
                </div>
                
                <Button type="button" onClick={form.handleSubmit(handleGenerateContent)} disabled={isGenerating} className="w-full text-lg py-6">
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Gerar Texto do E-mail com IA
                </Button>
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
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className='font-headline text-2xl'>3. Reveja, Edite e Envie</h2>
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
                                <FormControl>
                                  <Input {...field} onChange={e => {
                                    field.onChange(e);
                                    if (generatedContent) {
                                      setGeneratedContent({...generatedContent, subject: e.target.value});
                                    }
                                  }}/>
                                </FormControl>
                              </FormItem>
                            )}/>
                          {selectedTemplate?.imageCount === 1 && (
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL da Imagem 1</FormLabel><FormControl><Input placeholder="https://exemplo.com/imagem.png" {...field} /></FormControl></FormItem>)}/>
                          )}
                          {selectedTemplate?.imageCount === 2 && (
                            <>
                              <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL da Imagem 1</FormLabel><FormControl><Input placeholder="https://exemplo.com/imagem1.png" {...field} /></FormControl></FormItem>)}/>
                              <FormField control={form.control} name="imageUrl2" render={({ field }) => (<FormItem><FormLabel>URL da Imagem 2</FormLabel><FormControl><Input placeholder="https://exemplo.com/imagem2.png" {...field} /></FormControl></FormItem>)}/>
                            </>
                          )}
                            <FormField control={form.control} name="buttonText" render={({ field }) => (<FormItem><FormLabel>Texto do Botão</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}/>
                            <FormField control={form.control} name="buttonLink" render={({ field }) => (<FormItem><FormLabel>Link do Botão</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)}/>
                        </div>
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
                    </CardContent>
                </Card>

                <h3 className="font-headline text-xl">Pré-visualização</h3>
                <div className="border rounded-lg h-[80vh] overflow-hidden">
                    <iframe 
                        srcDoc={generatedContent.bodyHtml}
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
