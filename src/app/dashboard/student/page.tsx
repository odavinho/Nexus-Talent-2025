
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Award, UserCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CourseRecommendations } from "@/components/dashboard/course-recommendations";

export default function StudentDashboardPage() {
    // Mock data for enrolled courses
    const enrolledCourses = [
        { name: 'Técnicas de Apresentação', progress: 75, grade: 88 },
        { name: 'Gestão de Conflitos', progress: 40, grade: null },
        { name: 'Excel Avançado', progress: 100, grade: 95 },
    ];

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
                            <div className="space-y-6">
                                {enrolledCourses.map(course => (
                                    <div key={course.name}>
                                        <div className="flex justify-between items-center mb-1">
                                            <h4 className="font-medium">{course.name}</h4>
                                            <span className="text-sm font-semibold text-primary">{course.progress}%</span>
                                        </div>
                                        <Progress value={course.progress} className="h-2" />
                                    </div>
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
                                    <Button key={c.name} variant="outline" className="w-full justify-between">
                                        <span>{c.name}</span>
                                        <span className="font-bold text-primary">{c.grade}%</span>
                                    </Button>
                                  ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">Conclua cursos para ganhar certificados.</p>
                            )}
                             <Button variant="secondary" className="w-full mt-4" disabled>Ver Todos</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
