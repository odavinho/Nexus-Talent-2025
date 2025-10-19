'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, MessageCircle, Library, AlertTriangle, MessageSquare, ListChecks, Mail, Award, User, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const managedCourses = [
    { id: 'TA-001', name: 'Técnicas de Apresentação', students: 25 },
    { id: 'GC-002', name: 'Gestão de Conflitos', students: 18 },
];

const mockStudents = [
    { id: 'student1', name: 'Ana Pereira', email: 'ana.p@email.com', status: 'Inscrito', grade: null },
    { id: 'student3', name: 'Carla Santos', email: 'carla.s@email.com', status: 'Inscrito', grade: 88 },
    { id: 'student5', name: 'Elisa Fernandes', email: 'elisa.f@email.com', status: 'Inscrito', grade: 92 },
];


function ManageClassDialog({ course }: { course: typeof managedCourses[0] }) {
    const [students, setStudents] = useState(mockStudents);
    const { toast } = useToast();

    const handleSendMessageToAll = () => {
        toast({
            title: "Mensagem Enviada (Simulado)",
            description: `A sua mensagem foi enviada para os ${students.length} alunos da turma.`,
        });
    };

    return (
         <DialogContent className="max-w-4xl">
            <DialogHeader>
                <DialogTitle>Gerir Turma: {course.name}</DialogTitle>
                <DialogDescription>
                    Visualize os alunos inscritos, atribua notas e comunique com a turma.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <h4 className="font-semibold mb-2">Alunos Inscritos</h4>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Aluno</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Nota Final</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map(student => (
                                <TableRow key={student.id}>
                                    <TableCell className="font-medium">{student.name}</TableCell>
                                    <TableCell>{student.email}</TableCell>
                                    <TableCell><Badge>{student.status}</Badge></TableCell>
                                    <TableCell className="text-center">{student.grade ? `${student.grade}%` : 'N/A'}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon"><MoreHorizontal size={16}/></Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem><User className="mr-2 h-4 w-4" />Ver Perfil</DropdownMenuItem>
                                                <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Enviar Mensagem</DropdownMenuItem>
                                                <DropdownMenuItem><Award className="mr-2 h-4 w-4" />Atribuir Nota</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                <div className="md:col-span-1 space-y-4">
                     <h4 className="font-semibold mb-2">Comunicação</h4>
                     <Card className="bg-secondary/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Enviar Mensagem à Turma</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <Textarea placeholder="Escreva a sua mensagem aqui..." className="mb-2 h-24"/>
                             <Button className="w-full" onClick={handleSendMessageToAll}>Enviar para Todos</Button>
                        </CardContent>
                     </Card>
                     <Card>
                         <CardHeader className="pb-2">
                            <CardTitle className="text-base">Pauta de Notas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/>Gerir Pauta / Notas</Button>
                        </CardContent>
                     </Card>
                </div>
            </div>
        </DialogContent>
    )
}


export default function InstructorDashboardPage() {

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Painel do Formador</h1>
                <p className="text-muted-foreground">Gerencie seus cursos, turmas e conteúdo de forma eficiente.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Coluna Principal */}
                <div className="lg:col-span-3 space-y-8">
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
                            <CardDescription>Crie novos cursos e gerencie o conteúdo e as turmas dos existentes. Clique num curso para aceder às ferramentas de gestão.</CardDescription>
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
                                                <ManageClassDialog course={course} />
                                            </Dialog>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    );
}
