'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, MessageSquare, Library, AlertTriangle, MessageCircle, ListChecks, Mail, Award, User, Edit, FileUp, Calendar, Video, Link as LinkIcon, Download, Send, Percent, Star, FileDown, Activity, UserCheck, UserX, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getCourses } from "@/lib/course-service";
import { GeneralReport } from "@/components/admin/general-report";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { UserProfile, Course } from "@/lib/types";
import { users as mockAllUsers } from "@/lib/users";
import { getImages } from '@/lib/site-data';
import Image from "next/image";


// Mock data
const managedCoursesData = [
    { id: 'TA-001', name: 'Técnicas de Apresentação', students: 25, averageGrade: 88, status: 'Ativo', engagement: 85 },
    { id: 'GC-002', name: 'Gestão de Conflitos', students: 18, averageGrade: 91, status: 'Ativo', engagement: 92 },
    { id: 'EN-427', name: 'Excel Avançado', students: 32, averageGrade: null, status: 'Rascunho', engagement: 0 },
];

const mockStudents = mockAllUsers.slice(0, 5).map((user, index) => ({
    ...user,
    status: index < 3 ? 'Em Curso' : 'Concluído',
    finalGrade: index < 3 ? null : Math.floor(Math.random() * (98 - 75 + 1)) + 75,
}));


const mockActivityFeed = [
    { id: 1, type: 'enrollment', text: 'Ana Pereira inscreveu-se em "Técnicas de Apresentação".', time: '2h atrás' },
    { id: 2, type: 'submission', text: 'Carlos Martins submeteu o trabalho do Módulo 2.', time: '5h atrás' },
    { id: 3, type: 'forum', text: 'Nova pergunta de Sofia Nunes no fórum de "Gestão de Conflitos".', time: '1 dia atrás' },
    { id: 4, type: 'enrollment', text: 'Diogo Alves inscreveu-se em "Gestão de Conflitos".', time: '2 dias atrás' },
];

const mockTopStudents = [
    { id: 'student5', name: 'Elisa Fernandes', course: 'Gestão de Conflitos', grade: 95 },
    { id: 'student3', name: 'Carla Santos', course: 'Técnicas de Apresentação', grade: 92 },
];

const mockAtRiskStudents = [
    { id: 'student1', name: 'Ana Pereira', course: 'Técnicas de Apresentação', engagement: 'Baixo (25%)' },
]

const KpiCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

const chartConfig = {
  engaged: {
    label: "Alunos Engajados",
    color: "hsl(var(--chart-1))",
  },
}

function ManageClassDialog({ course }: { course: Course }) {
    const { toast } = useToast();
    const [students, setStudents] = useState(mockStudents);
    const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    const handleAssignGrade = (studentId: string, grade: number) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, finalGrade: grade, status: 'Concluído' } : s));
        toast({ title: "Nota Atribuída!", description: `A nota de ${grade}% foi atribuída.` });
        setIsGradeModalOpen(false);
    };

    const handleSendMessage = () => {
        toast({ title: "Mensagem Enviada!", description: `A sua mensagem para ${selectedStudent?.firstName} foi enviada (simulado).` });
        setIsMessageModalOpen(false);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary">Gerir Turma</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">Gerir Turma: {course.name}</DialogTitle>
                    <DialogDescription>Visualize os alunos, atribua notas, comunique e gira a logística da turma.</DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-hidden">
                    <Tabs defaultValue="students" className="h-full flex flex-col">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="students">Alunos</TabsTrigger>
                            <TabsTrigger value="grades">Pauta de Notas</TabsTrigger>
                            <TabsTrigger value="communication">Comunicação</TabsTrigger>
                            <TabsTrigger value="logistics">Logística</TabsTrigger>
                        </TabsList>
                        <TabsContent value="students" className="flex-grow overflow-auto">
                           <Card>
                               <CardHeader><CardTitle>Alunos Inscritos ({students.length})</CardTitle></CardHeader>
                               <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Aluno</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Nota Final</TableHead>
                                                <TableHead className="text-right">Ações</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map(student => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                                                    <TableCell>{student.email}</TableCell>
                                                    <TableCell><Badge variant={student.status === 'Concluído' ? 'default' : 'secondary'}>{student.status}</Badge></TableCell>
                                                    <TableCell>{student.finalGrade ? `${student.finalGrade}%` : 'N/A'}</TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                                                            <DropdownMenuContent>
                                                                <DropdownMenuItem asChild><Link href={`/dashboard/recruiter/candidates/${student.id}`} target="_blank">Ver Perfil</Link></DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsGradeModalOpen(true); }}>Atribuir Nota</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => { setSelectedStudent(student); setIsMessageModalOpen(true); }}>Enviar Mensagem</DropdownMenuItem>
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
                        <TabsContent value="grades" className="flex-grow overflow-auto">
                             <Card>
                                <CardHeader className="flex-row justify-between items-center">
                                    <CardTitle>Pauta de Notas</CardTitle>
                                    <Button variant="outline"><Download className="mr-2 h-4 w-4"/>Exportar Pauta (XLS)</Button>
                                </CardHeader>
                                <CardContent>
                                     <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Aluno</TableHead>
                                                <TableHead>Nota Final</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {students.map(student => (
                                                <TableRow key={student.id}>
                                                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                                                    <TableCell>{student.finalGrade ? `${student.finalGrade}%` : <span className="text-muted-foreground">Pendente</span>}</TableCell>
                                                    <TableCell><Badge variant={student.status === 'Concluído' ? 'default' : 'secondary'}>{student.status}</Badge></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                             </Card>
                        </TabsContent>
                        <TabsContent value="communication" className="flex-grow overflow-auto">
                            <Card>
                                <CardHeader><CardTitle>Enviar Anúncio para a Turma</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div><Label htmlFor="announcement-subject">Assunto</Label><Input id="announcement-subject" placeholder="Ex: Alteração de Horário da Próxima Aula"/></div>
                                    <div><Label htmlFor="announcement-message">Mensagem</Label><Textarea id="announcement-message" placeholder="Escreva a sua mensagem aqui..." rows={8}/></div>
                                    <Button><Send className="mr-2 h-4 w-4"/>Enviar Anúncio</Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                         <TabsContent value="logistics" className="flex-grow overflow-auto">
                            <Card>
                                <CardHeader><CardTitle>Logística do Curso</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {course.format === 'Online' ? (
                                        <p className="text-muted-foreground">Este curso é 100% online, não requer logística de sala.</p>
                                    ) : (
                                        <>
                                            <div><Label htmlFor="course-room">Sala de Formação</Label><Input id="course-room" placeholder="Ex: Sala 3, Edifício A"/></div>
                                            <div><Label htmlFor="course-schedule">Horário</Label><Input id="course-schedule" placeholder="Ex: Segundas e Quartas, 18h - 21h"/></div>
                                            <div><Label htmlFor="course-vacancies">Vagas</Label><Input id="course-vacancies" type="number" placeholder="25"/></div>
                                            <Button>Guardar Alterações de Logística</Button>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
                 {selectedStudent && (
                    <>
                        <Dialog open={isGradeModalOpen} onOpenChange={setIsGradeModalOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Atribuir Nota Final a {selectedStudent.firstName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <Label htmlFor="final-grade">Nota (0-100)</Label>
                                    <Input id="final-grade" type="number" max={100} min={0} />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsGradeModalOpen(false)}>Cancelar</Button>
                                    <Button onClick={() => handleAssignGrade(selectedStudent.id, parseInt((document.getElementById('final-grade') as HTMLInputElement).value || '0'))}>Atribuir</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                         <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Enviar Mensagem para {selectedStudent.firstName}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-2">
                                    <Label htmlFor="student-message">Mensagem</Label>
                                    <Textarea id="student-message" rows={5} placeholder="Escreva a sua mensagem..."/>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsMessageModalOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleSendMessage}>Enviar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                 )}
            </DialogContent>
        </Dialog>
    );
}


export function InstructorDashboard() {
    const [reportData, setReportData] = useState<any>(null);
    const [managedCourses, setManagedCourses] = useState<Course[]>([]);
    
    useEffect(() => {
        setManagedCourses(getCourses());
    }, []);

    const handleGenerateReport = () => {
        const studentEngagementByCourse = managedCoursesData.map(c => ({
            name: c.name,
            engaged: c.engagement,
        }));

        setReportData({
            instructorKpis: {
                activeStudents: managedCoursesData.reduce((sum, c) => sum + c.students, 0),
                publishedCourses: managedCoursesData.filter(c => c.status === 'Ativo').length,
                avgCompletionRate: 85, // Mock data
                avgRating: 4.7, // Mock data
            },
            studentEngagementByCourse,
        });
    }
    
    const activityIcon = (type: string) => {
        switch (type) {
            case 'enrollment': return <UserCheck className="h-4 w-4 text-blue-500" />;
            case 'submission': return <FileUp className="h-4 w-4 text-green-500" />;
            case 'forum': return <MessageSquare className="h-4 w-4 text-orange-500" />;
            default: return <Activity className="h-4 w-4 text-gray-500" />;
        }
    }
    
    const allImages = getImages();


    return (
        <div>
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Painel do Formador</h1>
                <p className="text-muted-foreground">Crie, gira e avalie os seus cursos e formandos de forma eficiente.</p>
            </div>

            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard title="Alunos Ativos" value="75" icon={Users} />
                    <KpiCard title="Cursos Publicados" value={managedCoursesData.length.toString()} icon={BookOpen} />
                    <KpiCard title="Taxa de Conclusão Média" value="85%" icon={Percent} />
                    <KpiCard title="Avaliação Média" value="4.7" icon={Star} />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Engajamento dos Alunos por Curso</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-64">
                                    <BarChart accessibilityLayer data={managedCoursesData}>
                                        <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} interval={0} />
                                        <YAxis />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="engagement" fill="var(--color-engaged)" radius={4} name="Engajamento"/>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
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
                                <CardDescription>Crie novos cursos e gira o conteúdo e as turmas dos existentes.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {managedCourses.map(course => {
                                        const image = allImages.find(p => p.id === course.imageId);
                                        const imageSrc = course.imageDataUri || image?.imageUrl;
                                        const courseMockData = managedCoursesData.find(c => c.id === course.id);

                                        return (
                                            <Card key={course.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/50 transition-colors">
                                                <div className="flex-grow flex items-center gap-4">
                                                    {imageSrc && (
                                                        <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                            <Image src={imageSrc} alt={course.name} fill className="object-cover" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h4 className="font-semibold">{course.name} <Badge variant={courseMockData?.status === 'Ativo' ? 'default' : 'secondary'}>{courseMockData?.status || 'Rascunho'}</Badge></h4>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                                                            <span className="flex items-center gap-1"><Users size={14} /> {courseMockData?.students || 0} alunos</span>
                                                            {courseMockData?.averageGrade && <span className="flex items-center gap-1"><Award size={14} /> Média de {courseMockData.averageGrade}%</span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 shrink-0 self-end sm:self-center">
                                                    <ManageClassDialog course={course} />
                                                    <Button asChild variant="outline">
                                                        <Link href={`/dashboard/courses/edit/${course.id}`}><Edit size={16}/> Editar</Link>
                                                    </Button>
                                                </div>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                         <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity />
                                    Atividade Recente
                                </CardTitle>
                                <CardDescription>Últimas ações nos seus cursos.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {mockActivityFeed.map(item => (
                                        <div key={item.id} className="flex items-start gap-3">
                                            <div className="flex-shrink-0 mt-1">{activityIcon(item.type)}</div>
                                            <div>
                                                <p className="text-sm">{item.text}</p>
                                                <p className="text-xs text-muted-foreground">{item.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users />
                                    Alunos em Destaque
                                </CardTitle>
                                <CardDescription>Acompanhe o desempenho dos seus formandos.</CardDescription>
                            </CardHeader>
                             <CardContent>
                                <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><UserCheck className="text-green-500" /> Melhor Desempenho</h4>
                                    <div className="space-y-2">
                                        {mockTopStudents.map(student => (
                                            <div key={student.id} className="flex items-center justify-between text-xs p-2 rounded-md bg-secondary">
                                                <span>{student.name}</span>
                                                <span className="font-bold">{student.grade}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <Separator className="my-4"/>
                                 <div>
                                    <h4 className="font-semibold text-sm flex items-center gap-2 mb-2"><UserX className="text-red-500" /> Em Risco</h4>
                                    <div className="space-y-2">
                                        {mockAtRiskStudents.map(student => (
                                            <div key={student.id} className="flex items-center justify-between text-xs p-2 rounded-md bg-secondary">
                                                <span>{student.name}</span>
                                                <Badge variant="destructive">{student.engagement}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 />
                                    Relatórios e Análises
                                </CardTitle>
                                <CardDescription>Obtenha uma visão detalhada do desempenho.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">Exporte relatórios completos em PDF.</p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="default" onClick={handleGenerateReport}>
                                            <FileDown className="mr-2 h-4 w-4" /> Gerar Relatório
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[90vh]">
                                        <DialogHeader>
                                            <DialogTitle>Relatório de Desempenho do Formador</DialogTitle>
                                            <DialogDescription>
                                                Visão geral da sua atividade na plataforma NexusTalent.
                                            </DialogDescription>
                                        </DialogHeader>
                                        {reportData && <GeneralReport data={reportData} reportType="instructor" />}
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
