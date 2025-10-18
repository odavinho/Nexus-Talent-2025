'use client';

import { useUser } from '@/firebase';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Wand2, PlusCircle, Trash2, Edit, User, Briefcase, GraduationCap, Award, Link as LinkIcon, FileText, Download, ArrowLeft } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { extractProfileFromResumeAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { users } from '@/lib/users'; // Using mock user data
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';


const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});

const profileSchema = z.object({
    firstName: z.string().min(1, 'O nome é obrigatório.'),
    lastName: z.string().min(1, 'O apelido é obrigatório.'),
    academicTitle: z.string().min(3, 'O título académico é obrigatório.'),
    nationality: z.string().min(3, 'A nacionalidade é obrigatória.'),
    yearsOfExperience: z.coerce.number().min(0, 'Os anos de experiência devem ser um número positivo.'),
    functionalArea: z.string().min(3, 'A área funcional é obrigatória.'),
    skills: z.string().describe("Competências separadas por vírgula").optional(),
    resumeUrl: z.string().url('Por favor, insira um URL válido para o seu CV.').optional().or(z.literal('')),
    academicHistory: z.array(z.object({
        institution: z.string().min(1, "Instituição é obrigatória"),
        degree: z.string().min(1, "Curso/Grau é obrigatória"),
        year: z.string().min(4, "Ano é obrigatório"),
    })).optional(),
    workExperience: z.array(z.object({
        company: z.string().min(1, "Empresa é obrigatória"),
        role: z.string().min(1, "Função é obrigatória"),
        period: z.string().min(1, "Período é obrigatório"),
        description: z.string().optional(),
    })).optional(),
    receivesNotifications: z.boolean().optional(),
    receivesJobAlerts: z.boolean().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const { user, isUserLoading } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Use local state for profile data instead of Firestore
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isProfileLoading, setIsProfileLoading] = useState(true);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '', lastName: '', academicTitle: '', nationality: '',
            yearsOfExperience: 0, functionalArea: '', skills: '', resumeUrl: '',
            academicHistory: [], workExperience: [],
            receivesNotifications: true, receivesJobAlerts: true,
        }
    });

    useEffect(() => {
        if (user) {
            // Find a mock user profile. In a real app, you'd fetch this.
            const mockUserProfile = users.find(u => u.userType === 'student'); 
            setUserProfile(mockUserProfile || null);
        }
        setIsProfileLoading(false);
    }, [user]);

    useEffect(() => {
        if (userProfile) {
            const [firstName, ...lastNameParts] = user?.displayName?.split(' ') || ['', ''];
            form.reset({
                firstName: userProfile.firstName || firstName,
                lastName: userProfile.lastName || lastNameParts.join(' '),
                academicTitle: userProfile.academicTitle || '',
                nationality: userProfile.nationality || '',
                yearsOfExperience: userProfile.yearsOfExperience || 0,
                functionalArea: userProfile.functionalArea || '',
                skills: Array.isArray(userProfile.skills) ? userProfile.skills.join(', ') : '',
                resumeUrl: userProfile.resumeUrl || '',
                academicHistory: userProfile.academicHistory || [],
                workExperience: userProfile.workExperience || [],
                receivesNotifications: userProfile.receivesNotifications !== false,
                receivesJobAlerts: userProfile.receivesJobAlerts !== false,
            });
        }
    }, [userProfile, form, user]);

    const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        if (!user) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Utilizador não autenticado.' });
            return;
        }
        setIsSubmitting(true);
        
        const finalData = {
            ...data,
            skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        };

        const profileToSave: UserProfile = {
            ...userProfile, 
            ...finalData,   
            id: user.id,
            email: user.email!,
            userType: userProfile?.userType || 'student',
        };

        // Simulate saving
        setTimeout(() => {
            setUserProfile(profileToSave); // Update local state
            toast({ title: 'Sucesso!', description: 'O seu perfil foi atualizado (nesta sessão).' });
            setIsEditing(false);
            setIsSubmitting(false);
        }, 1000);
    };
    
    if (isUserLoading || isProfileLoading) {
        return <ProfileSkeleton />;
    }

    if (!isEditing && userProfile) {
        return <ProfileView profile={userProfile} onEdit={() => setIsEditing(true)} />;
    }

    return <ProfileForm form={form} onSubmit={onSubmit} isSubmitting={isSubmitting} onCancel={() => setIsEditing(false)} />;
}

function ProfileView({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
    const router = useRouter();
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
            </Button>
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="font-headline text-4xl font-bold">{profile.firstName} {profile.lastName}</h1>
                    <p className="text-muted-foreground text-xl mt-1">{profile.academicTitle}</p>
                    <p className="text-muted-foreground text-sm mt-2">{profile.functionalArea}  &middot; {profile.yearsOfExperience} anos de experiência</p>
                </div>
                <Button onClick={onEdit}><Edit className="mr-2 h-4 w-4" /> Editar Perfil</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> Experiência Profissional</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {profile.workExperience?.length ? profile.workExperience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold">{exp.role}</h3>
                                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                                    </div>
                                    <p className="text-sm text-primary font-medium">{exp.company}</p>
                                    {exp.description && <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>}
                                </div>
                            )) : <p className="text-sm text-muted-foreground">Nenhuma experiência profissional adicionada.</p>}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><GraduationCap /> Formação Académica</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {profile.academicHistory?.length ? profile.academicHistory.map((edu, index) => (
                                <div key={index} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="font-semibold">{edu.degree}</h3>
                                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                                </div>
                            )) : <p className="text-sm text-muted-foreground">Nenhuma formação académica adicionada.</p>}
                        </CardContent>
                    </Card>
                </div>
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Award /> Competências</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                             {profile.skills?.length ? profile.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary">{skill}</Badge>
                            )) : <p className="text-sm text-muted-foreground">Nenhuma competência adicionada.</p>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FileText /> Currículo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {profile.resumeUrl ? (
                                <Button asChild variant="outline">
                                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                                        <Download size={16} className="mr-2" /> Baixar CV
                                    </a>
                                </Button>
                            ) : <p className="text-sm text-muted-foreground">Nenhum CV carregado.</p>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function ProfileForm({ form, onSubmit, isSubmitting, onCancel }: { form: any; onSubmit: SubmitHandler<ProfileFormValues>, isSubmitting: boolean, onCancel: () => void }) {
    const { toast } = useToast();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [cvFile, setCvFile] = useState<File | null>(null);
    
    const { fields: academicFields, append: appendAcademic, remove: removeAcademic } = useFieldArray({
        control: form.control, name: "academicHistory"
    });

    const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
        control: form.control, name: "workExperience"
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setCvFile(file);
        }
    };

    const handleAnalyzeAndFill = async () => {
         if (!cvFile) {
            toast({ variant: 'destructive', title: 'Nenhum ficheiro selecionado', description: 'Por favor, carregue o seu CV em formato PDF ou DOCX.' });
            return;
        }
        setIsAnalyzing(true);
        try {
            const resumeDataUri = await fileToDataUri(cvFile);
            const result = await extractProfileFromResumeAction({ resumeDataUri });

            form.reset({ ...form.getValues(), ...result, skills: result.skills?.join(', ') || '' });

            toast({ title: 'Perfil preenchido!', description: 'Os dados do seu CV foram preenchidos. Por favor, reveja e salve.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Erro na Análise', description: error instanceof Error ? error.message : 'Não foi possível analisar o CV.' });
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-3xl">Editar Perfil Profissional</CardTitle>
                <CardDescription>
                    Mantenha suas informações atualizadas. Um perfil completo aumenta suas chances de ser encontrado por recrutadores.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4 mb-8 p-6 border rounded-lg bg-secondary/50">
                    <h4 className="font-semibold text-lg">Preenchimento Automático com IA</h4>
                    <p className="text-sm text-muted-foreground">
                        Poupe tempo! Carregue o seu CV em formato PDF ou DOCX e deixe a nossa IA preencher os campos do seu perfil por si.
                    </p>
                    <div className="flex gap-4 items-center">
                        <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" className="max-w-xs" onChange={handleFileChange} />
                        <Button variant="outline" onClick={handleAnalyzeAndFill} disabled={isAnalyzing}>
                            {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />} Analisar e Preencher
                        </Button>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div>
                            <h3 className="font-headline text-xl mb-4">Informação Pessoal</h3>
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6"><FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Apelido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
                                <div className="grid md:grid-cols-2 gap-6"><FormField control={form.control} name="nationality" render={({ field }) => (<FormItem><FormLabel>Nacionalidade</FormLabel><FormControl><Input placeholder="Ex: Angolana" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
                            </div>
                        </div>
                        <Separator />
                        <div>
                             <h3 className="font-headline text-xl mb-4">Formação Académica</h3>
                             <div className="space-y-6">
                                {academicFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md relative space-y-4"><FormField control={form.control} name={`academicHistory.${index}.institution`} render={({ field }) => (<FormItem><FormLabel>Instituição de Ensino</FormLabel><FormControl><Input placeholder="Ex: Universidade Agostinho Neto" {...field} /></FormControl><FormMessage /></FormItem>)} /><div className="grid md:grid-cols-2 gap-6"><FormField control={form.control} name={`academicHistory.${index}.degree`} render={({ field }) => (<FormItem><FormLabel>Curso/Grau</FormLabel><FormControl><Input placeholder="Ex: Licenciatura em Engenharia Informática" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`academicHistory.${index}.year`} render={({ field }) => (<FormItem><FormLabel>Ano de Conclusão</FormLabel><FormControl><Input placeholder="Ex: 2015" {...field} /></FormControl><FormMessage /></FormItem>)} /></div><Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeAcademic(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div>
                                ))}<Button type="button" variant="outline" size="sm" onClick={() => appendAcademic({ institution: '', degree: '', year: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Adicionar Formação</Button>
                             </div>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-headline text-xl mb-4">Experiência Profissional</h3>
                            <div className="space-y-6">
                                <FormField control={form.control} name="academicTitle" render={({ field }) => (<FormItem><FormLabel>Título Profissional Principal</FormLabel><FormControl><Input placeholder="Ex: Engenheiro de Software Sénior" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <div className="grid md:grid-cols-2 gap-6"><FormField control={form.control} name="yearsOfExperience" render={({ field }) => (<FormItem><FormLabel>Anos de Experiência</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name="functionalArea" render={({ field }) => (<FormItem><FormLabel>Área Funcional Principal</FormLabel><FormControl><Input placeholder="Ex: Tecnologia da Informação" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
                                {workFields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-md relative space-y-4 pt-6"><h4 className="font-semibold absolute -top-3 bg-background px-2">Experiência {index + 1}</h4><div className="grid md:grid-cols-2 gap-6"><FormField control={form.control} name={`workExperience.${index}.company`} render={({ field }) => (<FormItem><FormLabel>Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`workExperience.${index}.role`} render={({ field }) => (<FormItem><FormLabel>Função</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} /></div><FormField control={form.control} name={`workExperience.${index}.period`} render={({ field }) => (<FormItem><FormLabel>Período</FormLabel><FormControl><Input placeholder="Ex: Jan 2020 - Presente" {...field} /></FormControl><FormMessage /></FormItem>)} /><FormField control={form.control} name={`workExperience.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Descrição das Responsabilidades</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>)} /><Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeWork(index)}><Trash2 className="h-4 w-4 text-destructive"/></Button></div>
                                ))} <Button type="button" variant="outline" size="sm" onClick={() => appendWork({ company: '', role: '', period: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4"/>Adicionar Experiência</Button>
                            </div>
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-headline text-xl mb-4">Competências</h3>
                            <FormField control={form.control} name="skills" render={({ field }) => (<FormItem><FormLabel>Principais Competências</FormLabel><FormControl><Textarea placeholder="Ex: React, Gestão de Projetos, Liderança,..." rows={3} {...field} /></FormControl><FormDescription>Separe as competências por vírgulas.</FormDescription><FormMessage /></FormItem>)} />
                        </div>
                        <Separator />
                        <div>
                            <h3 className="font-headline text-xl mb-4">Preferências de Comunicação</h3>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="receivesNotifications"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Notificações Gerais</FormLabel>
                                                <FormDescription>Receber notificações sobre atividades, cursos e novidades da plataforma.</FormDescription>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="receivesJobAlerts"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>Alertas de Vagas</FormLabel>
                                                <FormDescription>Receber e-mails sobre novas vagas de emprego que correspondem ao seu perfil.</FormDescription>
                                            </div>
                                            <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <Separator />
                        <div className="flex gap-4">
                            <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

function ProfileSkeleton() {
    return (
         <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                    <div className="space-y-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-10 w-full" /></div>
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-11 w-full" />
            </CardContent>
        </Card>
    );
}
