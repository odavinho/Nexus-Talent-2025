
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, MessageCircle, Library, AlertTriangle, MessageSquare, ListChecks } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Mock data
const managedCourses = [
    { id: 'TA-001', name: 'Técnicas de Apresentação', students: 25 },
    { id: 'GC-002', name: 'Gestão de Conflitos', students: 18 },
];

const mockStudents = [
    { id: 'student1', name: 'Ana Pereira', email: 'ana.p@email.com', status: 'Inscrito' },
    { id: 'student3', name: 'Carla Santos', email: 'carla.s@email.com', status: 'Inscrito' },
    { id: 'student5', name: 'Elisa Fernandes', email: 'elisa.f@email.com', status: 'Inscrito' },
];


export default function InstructorDashboardPage() {

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Painel do Formador</h1>
                <p className="text-muted-foreground">Gerencie seus cursos, turmas e conteúdo de forma eficiente.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Coluna Principal */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen />
                                    Meus Cursos
                                </CardTitle>
                                <Button asChild>
                                    <Link href="/dashboard/courses/new">Criar Novo Curso</Link>
                                </Button>
                            </div>
                            <CardDescription>Crie novos cursos e gerencie o conteúdo e as turmas dos existentes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {managedCourses.map(course => (
                                    <Card key={course.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/50 transition-colors">
                                        <Link href={`/dashboard/courses/${course.id}`} className="flex-grow">
                                            <h4 className="font-semibold">{course.name}</h4>
                                            <p className="text-sm text-muted-foreground flex items-center gap-2"><Users size={14} /> {course.students} alunos inscritos</p>
                                        </Link>
                                        <div className="flex gap-2 shrink-0">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline">Gerir Turma</Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Gerir Turma: {course.name}</DialogTitle>
                                                        <DialogDescription>
                                                            Visualize os alunos inscritos neste curso.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Aluno</TableHead>
                                                                    <TableHead>Email</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {mockStudents.map(student => (
                                                                    <TableRow key={student.id}>
                                                                        <TableCell className="font-medium">{student.name}</TableCell>
                                                                        <TableCell>{student.email}</TableCell>
                                                                        <TableCell><Badge>{student.status}</Badge></TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MessageCircle /> Comunicação</CardTitle>
                            <CardDescription>Interaja com suas turmas, envie avisos e responda a dúvidas.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-4">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left h-auto py-3 items-start">
                                        <div className="flex gap-3">
                                            <AlertTriangle className="text-destructive h-5 w-5 mt-1"/>
                                            <div>
                                                <p className="font-semibold">Enviar Alerta Urgente</p>
                                                <p className="text-xs text-muted-foreground font-normal">Notifique sobre cancelamentos ou mudanças.</p>
                                            </div>
                                        </div>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Enviar Alerta Urgente</DialogTitle>
                                        <DialogDescription>A mensagem será enviada via notificação Push/SMS para todos os alunos do curso selecionado (simulação).</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Textarea placeholder="Escreva a sua mensagem curta e urgente aqui..."/>
                                        <Button className="w-full" variant="destructive">Enviar Alerta</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button variant="outline" className="w-full justify-start text-left h-auto py-3 items-start" disabled>
                                <div className="flex gap-3">
                                    <MessageSquare className="text-primary h-5 w-5 mt-1"/>
                                    <div>
                                        <p className="font-semibold">Fórum de Dúvidas</p>
                                        <p className="text-xs text-muted-foreground font-normal">Aceda aos fóruns para responder aos alunos.</p>
                                    </div>
                                </div>
                            </Button>
                        </CardContent>
                    </Card>

                </div>

                {/* Coluna Lateral */}
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><BarChart3/> Acompanhamento e Ferramentas</CardTitle>
                            <CardDescription>Acompanhe o progresso e utilize ferramentas de apoio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="w-full justify-start gap-2">
                                        <ListChecks /> Registrar Atividades
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                     <DialogHeader>
                                        <DialogTitle>Registro de Atividades</DialogTitle>
                                        <DialogDescription>Registe notas de participação e observações (simulação).</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Label htmlFor="notes-students">Notas sobre os alunos</Label>
                                        <Textarea id="notes-students" placeholder="Ex: Ana Pereira demonstrou excelente participação..."/>
                                        <Button>Salvar Notas</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                             <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="secondary" className="w-full justify-start gap-2">
                                        <Library /> Materiais Complementares
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Gerir Materiais Complementares</DialogTitle>
                                        <DialogDescription>Disponibilize slides, e-books e vídeos de preparação (simulação).</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <Label htmlFor="material-upload">Carregar ficheiro</Label>
                                        <Input id="material-upload" type="file" />
                                        <Button>Carregar Material</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
