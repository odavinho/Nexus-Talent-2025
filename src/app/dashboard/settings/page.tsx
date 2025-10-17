'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Building, Award, ArrowLeft, Loader2, Save } from "lucide-react";
import { EditableImageGrid } from "@/components/dashboard/settings/editable-image-grid";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from "@/hooks/use-toast";
import { getSiteData, updateSiteData } from "@/app/actions";
import type { SiteData } from "@/lib/site-data";
import { Skeleton } from "@/components/ui/skeleton";


const statSchema = z.object({
  value: z.string().min(1, "O valor é obrigatório."),
  label: z.string().min(1, "O rótulo é obrigatório."),
});

const siteDataSchema = z.object({
  stats: z.array(statSchema),
});

type FormValues = z.infer<typeof siteDataSchema>;

function SettingsForm({ siteData, onFormSubmit, isSaving }: { siteData: SiteData, onFormSubmit: SubmitHandler<FormValues>, isSaving: boolean }) {
    const form = useForm<FormValues>({
        resolver: zodResolver(siteDataSchema),
        defaultValues: {
            stats: siteData.stats || [],
        },
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "stats",
    });

    useEffect(() => {
        form.reset({ stats: siteData.stats });
    }, [siteData, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star />
                            Estatísticas da Home
                        </CardTitle>
                        <CardDescription className="mt-2">Edite os números de destaque exibidos na página inicial.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4">
                                    <FormField
                                        control={form.control}
                                        name={`stats.${index}.value`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Valor</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`stats.${index}.label`}
                                        render={({ field }) => (
                                            <FormItem className="mt-4">
                                                <FormLabel>Rótulo</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : <><Save className="mr-2 h-4 w-4" /> Guardar Alterações</>}
                    </Button>
                </div>
            </form>
        </Form>
    );
}


export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
        try {
            const data = await getSiteData();
            setSiteData(data);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro ao carregar dados', description: 'Não foi possível carregar as configurações do site.'});
        }
    }
    loadData();
  }, [toast]);
  

  const handleFormSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSaving(true);
    try {
        if (!siteData) throw new Error("Dados do site não carregados.");
        const result = await updateSiteData({ ...siteData, stats: data.stats });
        if (result.success) {
            toast({ title: "Sucesso!", description: "Configurações atualizadas."});
            const updatedData = await getSiteData();
            setSiteData(updatedData);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Erro ao guardar', description: error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.'});
    } finally {
        setIsSaving(false);
    }
  };

  if (!siteData) {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-8">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
  }

  const partners = siteData.images.filter(p => p.id.startsWith('partner-'));
  const certifications = siteData.images.filter(p => p.id.startsWith('cert-'));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div className="mb-8">
          <h1 className="font-headline text-4xl font-bold">Configurações do Site</h1>
          <p className="text-muted-foreground mt-2">
            Visualize e edite os dados do site. As alterações serão refletidas em tempo real.
          </p>
        </div>
        <div className="space-y-8">
            <SettingsForm siteData={siteData} onFormSubmit={handleFormSubmit} isSaving={isSaving} />
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building />
                        Parceiros
                    </CardTitle>
                    <CardDescription className="mt-2">Os logotipos de parceiros exibidos no carrossel da página inicial.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditableImageGrid items={partners} itemType="parceiro" idPrefix="partner-" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Award />
                        Certificações
                    </CardTitle>
                    <CardDescription className="mt-2">As certificações e acreditações exibidas na página inicial.</CardDescription>
                </CardHeader>
                <CardContent>
                    <EditableImageGrid items={certifications} itemType="certificação" idPrefix="cert-" />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
