'use client';

import { useState, useEffect } from 'react';
import { useParams, notFound, useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { getCourseById } from '@/lib/course-service';
import { users as mockAllUsers } from '@/lib/users';
import type { Course, UserProfile } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Award, Mail, MoreHorizontal, Download, Send, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

// Mock data for students in this specific course
const mockStudentData = [
    { id: 'student1', name: 'Ana Pereira', email: 'ana.p@email.com', status: 'Inscrito', grade: 92 },
    { id: 'student3', name: 'Carla Santos', email: 'carla.s@email.com', status: 'Inscrito', grade: 88 },
    { id: 'student5', name: 'Elisa Fernandes', email: 'elisa.f@email.com', status: 'Concluído', grade: 95 },
    { id: 'student7', name: 'Sofia Nunes', email: 'sofia.n@email.com', status: 'Inscrito', grade: null },
    { id: 'student9', name: 'Inês Lopes', email: 'ines.l@email.com', status: 'Concluído', grade: 85 },
];


export default function ManageCoursePage() {
    const params = useParams();
    const courseId = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const { toast } = useToast();
    
    const [course, setCourse] = useState<Course | null | undefined>(undefined);
    const [students, setStudents] = useState(mockStudentData);
    const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
    const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [grade, setGrade] = useState('');

    useEffect(() => {
        if (courseId) {
            setCourse(getCourseById(courseId));
        }
    }, [courseId]);

    const handleOpenMessageDialog = (studentId: string) => {
        const student = mockAllUsers.find(u => u.id === studentId);
        if (student) {
            setSelectedStudent(student);
            setIsMessageDialogOpen(true);
        }
    };
    
    const handleOpenGradeDialog = (studentId: string) => {
        const student = mockAllUsers.find(u => u.id === studentId);
        if (student) {
            setSelectedStudent(student);
            const studentData = students.find(s => s.id === studentId);
            setGrade(studentData?.grade?.toString() || '');
            setIsGradeDialogOpen(true);
        }
    };

    const handleSendMessage = () => {
        setIsMessageDialogOpen(false);
        toast({
            title: "Mensagem Enviada (Simulado)",
            description: `A sua mensagem para ${selectedStudent?.firstName} foi enviada.`,
        });
        setMessage('');
    };
    
    const handleSetGrade = () => {
        if (!selectedStudent) return;
        const newGrade = parseInt(grade, 10);
        if (!isNaN(newGrade) && newGrade >= 0 && newGrade <= 100) {
            setStudents(prev => prev.map(s => s.id === selectedStudent.id ? { ...s, grade: newGrade } : s));
            setIsGradeDialogOpen(false);
            toast({
                title: "Nota Atribuída!",
                description: `A nota de ${selectedStudent.firstName} foi atualizada para ${newGrade}%.`,
            });
            setGrade('');
        } else {
             toast({
                variant: 'destructive',
                title: "Nota Inválida",
                description: `Por favor, insira um valor entre 0 e 100.`,
            });
        }
    };

    const handleSendMessageToAll = () => {
        toast({
            title: "Mensagem Enviada (Simulado)",
            description: `A sua mensagem foi enviada para os ${students.length} alunos da turma.`,
        });
    };
    
    const handleExport = () => {
        toast({ title: 'Exportação Iniciada', description: 'A sua pauta de notas está a ser exportada como XLS.' });
    }

    if (course === undefined) {
        // You can return a loading skeleton here
        return <div>A carregar...</div>;
    }

    if (!course) {
        return notFound();
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
             <Button variant="outline" onClick={() => router.back()} className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao Painel
            </Button>
            <CardHeader className="px-0">
                <CardTitle className="font-headline text-3xl">Gerir Turma: {course.name}</CardTitle>
                <CardDescription>
                    Visualize os alunos, atribua notas, comunique e gira a logística da turma.
                </CardDescription>
            </CardHeader>
            <Tabs defaultValue="students" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="students">Alunos</TabsTrigger>
                    <TabsTrigger value="grades">Pauta de Notas</TabsTrigger>
                    <TabsTrigger value="communication">Comunicação</TabsTrigger>
                    <TabsTrigger value="logistics">Logística</TabsTrigger>
                </TabsList>
                <TabsContent value="students" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Alunos Inscritos ({students.length})</CardTitle></CardHeader>
                        <CardContent>
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
                                                        <DropdownMenuItem asChild>
                                                          <Link href={`/dashboard/recruiter/candidates/${student.id}`} target="_blank">
                                                            <User className="mr-2 h-4 w-4" />Ver Perfil
                                                          </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleOpenMessageDialog(student.id)}>
                                                          <Mail className="mr-2 h-4 w-4" />Enviar Mensagem
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => handleOpenGradeDialog(student.id)}>
                                                          <Award className="mr-2 h-4 w-4" />Atribuir Nota
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="grades" className="mt-4">
                     <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Pauta de Notas</CardTitle>
                                <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4"/>Exportar (XLS)</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Aqui você poderá inserir e editar as notas de trabalhos, testes e a nota final de cada aluno.</p>
                            {/* Placeholder for grade management UI */}
                        </CardContent>
                     </Card>
                </TabsContent>
                 <TabsContent value="communication" className="mt-4">
                     <Card>
                        <CardHeader>
                            <CardTitle>Enviar Anúncio para a Turma</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Textarea placeholder="Escreva a sua mensagem aqui..." className="h-32"/>
                             <Button className="w-full" onClick={handleSendMessageToAll}><Send className="mr-2 h-4 w-4"/>Enviar para Todos</Button>
                        </CardContent>
                     </Card>
                </TabsContent>
                <TabsContent value="logistics" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Agendamento de Aulas</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <p className="text-sm text-muted-foreground">Gira a logística para aulas presenciais ou sessões online.</p>
                             <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sala">Sala/Local</Label>
                                    <Input id="sala" placeholder="Ex: Sala 3, Auditório Principal"/>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="vagas">Nº de Vagas</Label>
                                    <Input id="vagas" type="number" placeholder="25"/>
                                </div>
                             </div>
                             <div className="space-y-2">
                                <Label htmlFor="horario">Horários</Label>
                                <Textarea id="horario" placeholder="Ex: Segunda e Quarta, 18h-20h"/>
                             </div>
                             <Button><Calendar className="mr-2 h-4 w-4"/>Guardar Agendamento</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
             <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enviar Mensagem para {selectedStudent?.firstName}</DialogTitle>
                        <DialogDescription>A sua mensagem será enviada por e-mail e notificação push (simulado).</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Textarea 
                            placeholder={`Escreva a sua mensagem para ${selectedStudent?.firstName}...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="h-32"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsMessageDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSendMessage}>
                            <Send className="mr-2 h-4 w-4" /> Enviar Mensagem
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Atribuir Nota Final para {selectedStudent?.firstName}</DialogTitle>
                        <DialogDescription>Insira a nota final (0-100) para este aluno no curso.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <Label htmlFor="grade-input">Nota Final (%)</Label>
                        <Input 
                            id="grade-input"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Ex: 88"
                            value={grade}
                            onChange={(e) => setGrade(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsGradeDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSetGrade}>
                            <Award className="mr-2 h-4 w-4" /> Atribuir Nota
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}