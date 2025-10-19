'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getCourseById } from '@/lib/course-service';
import type { Course } from '@/lib/types';
import { useUser } from '@/firebase';
import { users as mockUsers } from '@/lib/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, User as UserIcon } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const enrollmentSchema = z.object({
  firstName: z.string().min(1, 'O nome é obrigatório.'),
  lastName: z.string().min(1, 'O apelido é obrigatório.'),
  email: z.string().email('Por favor, insira um e-mail válido.'),
  phoneNumber: z.string().optional(),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export default function EnrollPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { user, isUserLoading } = useUser();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
    }
  });

  useEffect(() => {
    if (id) {
      const foundCourse = getCourseById(id);
      setCourse(foundCourse || null);
    }
    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    if (user && !isUserLoading) {
        // Find a mock user profile. In a real app, this would be a Firestore fetch.
        const mockUserProfile = mockUsers.find(u => u.id === 'student1'); 
        form.reset({
            firstName: mockUserProfile?.firstName || user.displayName?.split(' ')[0] || '',
            lastName: mockUserProfile?.lastName || user.displayName?.split(' ').slice(1).join(' ') || '',
            email: user.email || '',
            phoneNumber: mockUserProfile?.phoneNumber || '',
        });
    }
  }, [user, isUserLoading, form]);


  const onSubmit: SubmitHandler<EnrollmentFormValues> = (data) => {
    if (!course) return;

    toast({
        title: "Dados Confirmados!",
        description: "A redirecionar para o passo final de pagamento.",
    });

    // For mandatory payment courses, redirect to checkout
    if (course.format === 'Presencial' || true) { // Assuming all courses need payment for now
        router.push(`/courses/${course.id}/checkout`);
    } else {
        // For free courses, directly to dashboard
        router.push('/dashboard/student');
    }
  };

  if (isLoading || isUserLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!course) {
    return notFound();
  }
   if (!user) {
    router.push(`/login?redirect=/courses/${id}/enroll`);
    return null;
  }

  return (
    <>
      <Header />
      <main className="py-12 bg-secondary">
        <div className="container mx-auto max-w-2xl">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Inscrição no Curso</CardTitle>
              <CardDescription>Confirme ou edite os seus dados para se inscrever em <strong className="text-primary">{course.name}</strong>.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Apelido</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                    </div>
                    <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>E-mail</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField control={form.control} name="phoneNumber" render={({ field }) => (<FormItem><FormLabel>Telefone (Opcional)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />

                    <Button type="submit" className="w-full" size="lg">Confirmar e Prosseguir</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
