'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, ArrowLeft, Mail, Image as ImageIcon, Text, Send, Eye, Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import type { EmailCampaignContent } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  topic: z.string().min(1, "O tópico é obrigatório."),
  tone: z.enum(['Profissional', 'Amigável', 'Urgente']),
  language: z.enum(['Português', 'Inglês']),
  template: z.enum(['simple', 'withImage']),
  buttonText: z.string().min(1, "O texto do botão é obrigatório."),
  buttonLink: z.string().url("Por favor, insira um URL válido."),
});

type FormValues = z.infer<typeof formSchema>;

export default function EmailMarketingPage() {
  const [generatedContent, setGeneratedContent] = useState<EmailCampaignContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "Lançamento de um novo curso de Liderança",
      tone: 'Profissional',
      language: 'Português',
      template: 'withImage',
      buttonText: "Saber Mais",
      buttonLink: "https://nexustalent.com/courses/new-leadership-course"
    },
  });

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
        description: `O e-mail "${generatedContent.subject}" foi enviado para a lista de marketing.`,
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
              <FormField control={form.control} name="topic" render={({ field }) => (
                <FormItem>
                  <FormLabel>1. Tópico ou Objetivo do E-mail</FormLabel>
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

              <h3 className="text-lg font-semibold border-t pt-4">2. Detalhes do Call-to-Action</h3>
                <FormField control={form.control} name="buttonText" render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do Botão</FormLabel>
                  <FormControl><Input placeholder="Ex: Inscreva-se Agora" {...field} /></FormControl>
                </FormItem>
              )}/>
                <FormField control={form.control} name="buttonLink" render={({ field }) => (
                <FormItem>
                  <FormLabel>Link do Botão</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
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
                 <Button onClick={handleSendCampaign} disabled={!generatedContent || isSending}>
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
                        onChange={(e) => setGeneratedContent({...generatedContent, bodyHtml: e.target.value})}
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
