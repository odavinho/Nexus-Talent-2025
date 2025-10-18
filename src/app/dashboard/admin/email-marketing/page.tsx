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
import { Loader2, Wand2, ArrowLeft, Send, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import { GenerateEmailCampaignInputSchema } from '@/lib/schemas';

type FormValues = z.infer<typeof GenerateEmailCampaignInputSchema>;

export default function EmailMarketingPage() {
  const [generatedContent, setGeneratedContent] = useState<{ subject: string, body: string } | null>(null);
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
    },
  });

  const handleGenerateContent: SubmitHandler<FormValues> = async (data) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const result = await generateEmailCampaignAction(data);
      setGeneratedContent(result);
      toast({
        title: "Conteúdo do E-mail Gerado!",
        description: "O conteúdo para a sua campanha foi criado pela IA. Reveja e envie.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao gerar conteúdo',
        description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.',
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
    // Simulate sending email
    setTimeout(() => {
        toast({
            title: "Campanha Enviada (Simulação)!",
            description: "O seu e-mail foi enviado para o público-alvo selecionado.",
        });
        setIsSending(false);
        router.push('/dashboard/admin');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2"><Mail /> Nova Campanha de E-mail Marketing</CardTitle>
          <CardDescription>
            Defina o seu objetivo e público-alvo, e deixe a IA criar uma campanha de e-mail eficaz para você.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleGenerateContent)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Público-Alvo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione o público" /></SelectTrigger></FormControl>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione o tom" /></SelectTrigger></FormControl>
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
              </div>

               <FormField
                control={form.control}
                name="emailGoal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Objetivo do E-mail</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: Anunciar novo curso de liderança, promover vagas na área de TI..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Gerar Conteúdo com IA
              </Button>
            </form>
          </Form>

          {generatedContent && (
            <div className="mt-8 pt-6 border-t space-y-6">
              <h3 className="font-headline text-2xl">Conteúdo Gerado (Pode editar)</h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input id="subject" value={generatedContent.subject} onChange={(e) => setGeneratedContent({ ...generatedContent, subject: e.target.value })} />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="body">Corpo do E-mail</Label>
                    <Textarea id="body" value={generatedContent.body} onChange={(e) => setGeneratedContent({ ...generatedContent, body: e.target.value })} rows={12} />
                </div>
              </div>
              <Button onClick={handleSendCampaign} disabled={isSending} className="w-full bg-green-600 hover:bg-green-700">
                 {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                 Enviar Campanha
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
