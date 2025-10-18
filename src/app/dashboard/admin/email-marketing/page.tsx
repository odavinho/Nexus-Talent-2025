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
import { Loader2, Wand2, ArrowLeft, Send, Mail, Code, Eye, Link as LinkIcon, Image as ImageIcon, History, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { generateEmailCampaignAction } from '@/app/actions';
import { GenerateEmailCampaignInputSchema } from '@/lib/schemas';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addCampaign, getCampaigns, type EmailCampaign } from '@/lib/email-campaign-service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

type FormValues = z.infer<typeof GenerateEmailCampaignInputSchema>;

export default function EmailMarketingPage() {
  const [generatedContent, setGeneratedContent] = useState<{ subject: string, body: string } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('new');
  const [sentCampaigns, setSentCampaigns] = useState<EmailCampaign[]>([]);
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
      imageUrl: '',
    },
  });

  const layoutType = form.watch('layoutType');

  const handleGenerateContent: SubmitHandler<FormValues> = async (data) => {
    setIsGenerating(true);
    setGeneratedContent(null);
    try {
      const inputForAI: FormValues = { ...data };
      if (inputForAI.layoutType !== 'Imagem, Título e Botão' || !inputForAI.imageUrl) {
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

    const campaignData: Omit<EmailCampaign, 'id' | 'sentDate'> = {
        subject: generatedContent.subject,
        body: generatedContent.body,
        targetAudience: form.getValues('targetAudience'),
    };
    
    // This now saves the campaign and returns the new full list
    const newCampaigns = addCampaign(campaignData);
    setSentCampaigns(newCampaigns);

    toast({
        title: "Campanha Enviada e Guardada!",
        description: "O seu e-mail foi 'enviado' e guardado no histórico.",
    });
    
    // Reset form and switch to sent campaigns tab
    setGeneratedContent(null);
    form.reset();
    setIsSending(false);
    setActiveTab('sent');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'sent') {
        // Load campaigns when switching to the tab
        setSentCampaigns(getCampaigns());
    }
  };
  
  const handleReuseCampaign = (campaign: EmailCampaign) => {
    setGeneratedContent({ subject: campaign.subject, body: campaign.body });
    form.setValue('targetAudience', campaign.targetAudience);
    setActiveTab('new');
    toast({ title: 'Conteúdo Reutilizado', description: 'O conteúdo da campanha anterior foi carregado no editor.' });
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto mb-8">
            <TabsTrigger value="new"><Mail className="mr-2 h-4 w-4" /> Nova Campanha</TabsTrigger>
            <TabsTrigger value="sent"><History className="mr-2 h-4 w-4" /> Campanhas Enviadas</TabsTrigger>
        </TabsList>

        <TabsContent value="new">
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
                    <FormField control={form.control} name="emailGoal" render={({ field }) => ( <FormItem> <FormLabel>Objetivo Principal do E-mail</FormLabel> <FormControl> <Textarea placeholder="Ex: Anunciar novo curso de liderança, promover vagas na área de TI..." {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FormField
                            control={form.control}
                            name="targetAudience"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Público-Alvo</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Selecione o público" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Todos os candidatos">Todos os candidatos</SelectItem>
                                                <SelectItem value="Engenheiros de Software">Engenheiros de Software</SelectItem>
                                                <SelectItem value="Gestores de Projeto">Gestores de Projeto</SelectItem>
                                                <SelectItem value="Alunos de cursos de Finanças">Alunos de cursos de Finanças</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Selecione o tom" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Profissional">Profissional</SelectItem>
                                                <SelectItem value="Amigável">Amigável</SelectItem>
                                                <SelectItem value="Urgente">Urgente</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
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
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger><SelectValue placeholder="Selecione o layout" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Texto com Botão">Texto com Botão</SelectItem>
                                                <SelectItem value="Imagem, Título e Botão">Imagem, Título e Botão</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField control={form.control} name="ctaLink" render={({ field }) => ( <FormItem> <FormLabel>Link do Botão Principal (CTA)</FormLabel> <div className="relative"> <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> <FormControl><Input placeholder="https://..." className="pl-9" {...field} /></FormControl> </div> <FormMessage /> </FormItem> )}/>
                    {layoutType === 'Imagem, Título e Botão' && ( <FormField control={form.control} name="imageUrl" render={({ field }) => ( <FormItem> <FormLabel>URL da Imagem (opcional)</FormLabel> <div className="relative"> <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> <FormControl><Input placeholder="https://images.unsplash.com/..." className="pl-9" {...field} /></FormControl> </div> <FormMessage /> </FormItem> )}/> )}
                    <Button type="submit" disabled={isGenerating} className="w-full">
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Gerar Conteúdo com IA
                    </Button>
                    </form>
                </Form>
                {isGenerating && ( <div className="text-center pt-10"> <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> <p className="mt-2 text-muted-foreground">Aguarde, a IA está a criar a sua campanha...</p> </div> )}
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
                        Enviar e Guardar Campanha
                    </Button>
                    </div>
                )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="sent">
             <Card>
                <CardHeader>
                    <CardTitle>Histórico de Campanhas Enviadas</CardTitle>
                    <CardDescription>Visualize, reutilize ou exclua campanhas enviadas anteriormente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assunto</TableHead>
                                <TableHead>Público-Alvo</TableHead>
                                <TableHead>Data de Envio</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sentCampaigns.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Nenhuma campanha enviada ainda.</TableCell>
                                </TableRow>
                            ) : (
                                sentCampaigns.map((campaign) => (
                                    <TableRow key={campaign.id}>
                                        <TableCell className="font-medium">{campaign.subject}</TableCell>
                                        <TableCell>{campaign.targetAudience}</TableCell>
                                        <TableCell>{format(campaign.sentDate, "d 'de' MMMM, yyyy 'às' HH:mm", { locale: pt })}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => handleReuseCampaign(campaign)}><Copy className="mr-2 h-4 w-4" />Reutilizar</Button>
                                            <Button variant="ghost" size="sm" disabled><Eye className="mr-2 h-4 w-4" />Ver</Button>
                                            <Button variant="destructive" size="sm" disabled><Trash2 className="mr-2 h-4 w-4" />Excluir</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
