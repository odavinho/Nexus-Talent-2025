
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, MessageCircle, Library, AlertTriangle, MessageSquare, ListChecks } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
                <p className="text-muted-foreground">Gerencie seus cursos, turmas e conteúdo.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <Card className="lg:col-span-2">
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
            </div>
        </div>
    );
}
