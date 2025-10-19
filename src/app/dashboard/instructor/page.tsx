
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, MessageCircle, Library, AlertTriangle, MessageSquare, ListChecks } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function InstructorDashboardPage() {
    // Mock data
    const managedCourses = [
        { name: 'Técnicas de Apresentação', students: 25 },
        { name: 'Gestão de Conflitos', students: 18 },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Painel do Formador</h1>
                <p className="text-muted-foreground">Gerencie seus cursos, alunos e conteúdo.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen />
                            Meus Cursos
                        </CardTitle>
                        <CardDescription>Crie novos cursos e gerencie o conteúdo dos existentes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ul className="space-y-2 mb-4">
                            {managedCourses.map(course => (
                                <li key={course.name} className="flex justify-between items-center text-sm p-2 bg-secondary rounded-md">
                                    <span className="font-medium">{course.name}</span>
                                    <span className="flex items-center gap-2 text-muted-foreground"><Users size={16} /> {course.students} alunos</span>
                                </li>
                            ))}
                        </ul>
                        <Button asChild>
                            <Link href="/dashboard/courses/new">Criar Novo Curso</Link>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <BarChart3 />
                            Acompanhamento e Ferramentas
                        </CardTitle>
                         <CardDescription>Acompanhe o progresso dos seus formandos e utilize ferramentas de apoio.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start gap-2" disabled>
                           <div>
                                <div className="flex items-center gap-2">
                                    <ListChecks size={18}/>
                                    <h4 className="font-semibold">Registro de Atividades</h4>
                                </div>
                                <p className="text-xs text-muted-foreground text-left">Registe notas de participação e observações das aulas presenciais.</p>
                           </div>
                        </Button>
                         <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start gap-2" disabled>
                           <div>
                                <div className="flex items-center gap-2">
                                    <Library size={18}/>
                                    <h4 className="font-semibold">Materiais Complementares</h4>
                                </div>
                                <p className="text-xs text-muted-foreground text-left">Disponibilize slides, e-books e vídeos de preparação para as aulas.</p>
                           </div>
                        </Button>
                    </CardContent>
                </Card>

                 <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageCircle />
                            Comunicação
                        </CardTitle>
                         <CardDescription>Interaja com suas turmas, envie avisos e responda a dúvidas.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                         <Button variant="default" className="justify-start h-auto p-4 flex-col items-start gap-2" disabled>
                           <div>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={18}/>
                                    <h4 className="font-semibold">Enviar Alerta Urgente</h4>
                                </div>
                                <p className="text-xs text-muted-foreground text-left">Envie notificações (SMS/Push) sobre cancelamentos ou mudanças.</p>
                           </div>
                        </Button>
                         <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start gap-2" disabled>
                           <div>
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={18}/>
                                    <h4 className="font-semibold">Fórum de Dúvidas</h4>
                                </div>
                                <p className="text-xs text-muted-foreground text-left">Responda a dúvidas e estenda o debate das aulas para o online.</p>
                           </div>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
