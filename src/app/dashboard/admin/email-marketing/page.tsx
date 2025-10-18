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
import { Loader2, Wand2, ArrowLeft, Mail, Image as ImageIcon, Text, Send, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import type { EmailCampaignContent } from '@/lib/types';
import { Label } from '@/components/ui/label';

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
      
      // Update form values with generated content for editing
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
      // Opcional: Redirecionar ou limpar formulário
    }, 1500);
  };

  const template = form.watch('template');

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Coluna de Configuração e Edição */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl flex items-center gap-2"><Mail /> Criador de Campanhas de E-mail</CardTitle>
              <CardDescription>Gere e envie campanhas de e-mail profissionais com o poder da IA.</CardDescription>
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
          
          {generatedContent && (
            <Card>
              <CardHeader>
                <CardTitle>Editar Conteúdo Gerado</CardTitle>
                <CardDescription>Ajuste o texto e os links antes de enviar.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="edit-subject">Assunto</Label>
                    <Input id="edit-subject" value={generatedContent.subject} onChange={(e) => setGeneratedContent({...generatedContent, subject: e.target.value})} />
                </div>
                 <div>
                    <Label htmlFor="edit-body">Corpo do E-mail</Label>
                    <Textarea id="edit-body" value={generatedContent.body} onChange={(e) => setGeneratedContent({...generatedContent, body: e.target.value})} rows={10} />
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Coluna de Pré-visualização */}
        <div className="space-y-4">
            <Card className="sticky top-24">
            <CardHeader className="flex-row justify-between items-center">
                <CardTitle className="flex items-center gap-2"><Eye /> Pré-visualização</CardTitle>
                <Button onClick={handleSendCampaign} disabled={!generatedContent || isSending}>
                    {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Enviar Campanha
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white text-gray-800">
                {/* Email Preview */}
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">{generatedContent?.subject || "Assunto do seu e-mail aparecerá aqui"}</h2>
                    
                    {template === 'withImage' && (
                        <div className="mb-6 bg-gray-200 h-40 rounded-md flex items-center justify-center">
                           <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                    )}

                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: generatedContent?.body.replace(/\n/g, '<br />') || "<p>O conteúdo gerado pela IA aparecerá aqui. Preencha o formulário e clique em 'Gerar Conteúdo' para começar.</p>" }} />
                    
                    <div className="mt-8 text-center">
                        <a 
                            href={form.getValues('buttonLink')} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-md no-underline"
                        >
                            {form.getValues('buttonText')}
                        </a>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 text-xs text-gray-500 text-center border-t">
                    <p>NexusTalent &copy; {new Date().getFullYear()}. Todos os direitos reservados.</p>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
