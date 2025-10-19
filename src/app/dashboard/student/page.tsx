
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, UserCircle, Download } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseRecommendations } from "@/components/dashboard/course-recommendations";
import { useToast } from "@/hooks/use-toast";
import { CertificateGenerator } from "@/components/student/certificate-generator";

export default function StudentDashboardPage() {
    // Mock data for enrolled courses
    const enrolledCourses = [
        { id: 'TA-001', name: 'Técnicas de Apresentação', progress: 75, grade: null, format: 'Online' },
        { id: 'GC-002', name: 'Gestão de Conflitos', progress: 40, grade: null, format: 'Presencial' },
        { id: 'EN-427', name: 'Excel Avançado', progress: 100, grade: 95, format: 'Online' },
        { id: 'GE-003', name: 'Gestão Emocional', progress: 100, grade: 92, format: 'Presencial' },
    ];
    
    const { toast } = useToast();

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Painel do Formando</h1>
                <p className="text-muted-foreground">Bem-vindo! A sua jornada de aprendizado começa aqui.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen />
                                Meus Cursos em Andamento
                            </CardTitle>
                            <CardDescription>Continue de onde parou e acompanhe seu progresso.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {enrolledCourses.filter(c => c.progress < 100).map(course => (
                                    <Link key={course.id} href={`/dashboard/courses/${course.id}`} className="block hover:bg-secondary/50 p-4 rounded-lg transition-colors border">
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-medium">{course.name}</h4>
                                            <span className="text-sm font-semibold text-primary">{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} className="h-2" />
                                        <p className="text-xs text-muted-foreground mt-2">Modalidade: {course.format}</p>
                                    </Link>
                                ))}
                            </div>
                             <Button asChild className="mt-6">
                                <Link href="/courses">Explorar mais cursos</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <CourseRecommendations />
                    
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCircle />
                                Meu Perfil Profissional
                            </CardTitle>
                             <CardDescription>Mantenha seu perfil atualizado para se destacar para os recrutadores.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground text-sm mb-4">Um perfil completo aumenta em até 5x as suas chances de ser contactado.</p>
                            <Button asChild className="w-full">
                                <Link href="/dashboard/student/profile">Gerir Meu Perfil</Link>
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Award />
                                Meus Certificados
                            </CardTitle>
                            <CardDescription>Os seus certificados serão emitidos e guardados aqui.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {enrolledCourses.filter(c => c.progress === 100).length > 0 ? (
                                <div className="space-y-2">
                                  {enrolledCourses.filter(c => c.progress === 100).map(c => (
                                    <div key={c.id} className="flex items-center justify-between p-3 border rounded-md bg-secondary/30">
                                        <div>
                                            <p className="font-semibold text-sm">{c.name}</p>
                                            <p className="text-xs text-muted-foreground">Nota Final: {c.grade}%</p>
                                        </div>
                                        <CertificateGenerator courseId={c.id} grade={c.grade!} />
                                    </div>
                                  ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">Conclua cursos para ganhar certificados.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
