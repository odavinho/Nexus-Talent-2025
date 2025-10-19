'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, BarChart3, MessageCircle, Library, AlertTriangle, MessageSquare, ListChecks, Mail, Award, User, Edit, FileUp, Calendar, Video, Link as LinkIcon, Download, Send, Percent, Star, FileDown } from "lucide-react";
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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { getCourses } from "@/lib/course-service";
import { GeneralReport } from "@/components/admin/general-report";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis } from "recharts";


// Mock data
const managedCourses = [
    { id: 'TA-001', name: 'Técnicas de Apresentação', students: 25, averageGrade: 88, status: 'Ativo', engagement: 85 },
    { id: 'GC-002', name: 'Gestão de Conflitos', students: 18, averageGrade: 91, status: 'Ativo', engagement: 92 },
    { id: 'EN-427', name: 'Excel Avançado', students: 32, averageGrade: null, status: 'Rascunho', engagement: 0 },
];

const mockStudents = [
    { id: 'student1', name: 'Ana Pereira', email: 'ana.p@email.com', status: 'Inscrito', grade: null },
    { id: 'student3', name: 'Carla Santos', email: 'carla.s@email.com', status: 'Inscrito', grade: 88 },
    { id: 'student5', name: 'Elisa Fernandes', email: 'elisa.f@email.com', status: 'Inscrito', grade: 92 },
];

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


function ManageClassDialog({ course }: { course: typeof managedCourses[0] }) {
    const [students, setStudents] = useState(mockStudents);
    const { toast } = useToast();

    const handleSendMessageToAll = () => {
        toast({
            title: "Mensagem Enviada (Simulado)",
            description: `A sua mensagem foi enviada para os ${students.length} alunos da turma.`,
        });
    };
    
    const handleExport = () => {
        toast({ title: 'Exportação Iniciada', description: 'A sua pauta de notas está a ser exportada como XLS.' });
    }

    return (
         <DialogContent className="max-w-5xl">
            <DialogHeader>
                <DialogTitle>Gerir Turma: {course.name}</DialogTitle>
                <DialogDescription>
                    Visualize os alunos, atribua notas, comunique e gira a logística da turma.
                </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="students" className="w-full">
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
        </DialogContent>
    )
}


export default function InstructorDashboardPage() {
    const [reportData, setReportData] = useState<any>(null);

    const handleGenerateReport = () => {
        const studentEngagementByCourse = managedCourses.map(c => ({
            name: c.name,
            engaged: c.engagement,
        }));

        setReportData({
            instructorKpis: {
                activeStudents: managedCourses.reduce((sum, c) => sum + c.students, 0),
                publishedCourses: managedCourses.filter(c => c.status === 'Ativo').length,
                avgCompletionRate: 85, // Mock data
                avgRating: 4.7, // Mock data
            },
            studentEngagementByCourse,
        });
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="font-headline text-4xl font-bold">Painel do Formador</h1>
                <p className="text-muted-foreground">Crie, gira e avalie os seus cursos e formandos de forma eficiente.</p>
            </div>

            <div className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard title="Alunos Ativos" value="75" icon={Users} />
                    <KpiCard title="Cursos Publicados" value="2" icon={BookOpen} />
                    <KpiCard title="Taxa de Conclusão Média" value="85%" icon={Percent} />
                    <KpiCard title="Avaliação Média" value="4.7" icon={Star} />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Engajamento dos Alunos por Curso</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ChartContainer config={chartConfig} className="h-64">
                                <BarChart accessibilityLayer data={managedCourses}>
                                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} interval={0} />
                                    <YAxis />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="engagement" fill="var(--color-engaged)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 />
                                Relatórios e Análises
                            </CardTitle>
                            <CardDescription>Obtenha uma visão detalhada do desempenho dos seus cursos e alunos.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">Exporte relatórios completos em PDF para as suas análises ou para partilhar.</p>
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
                            {managedCourses.map(course => (
                                <Card key={course.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/50 transition-colors">
                                    <div className="flex-grow">
                                        <h4 className="font-semibold">{course.name} <Badge variant={course.status === 'Ativo' ? 'default' : 'secondary'}>{course.status}</Badge></h4>
                                        <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                                            <span className="flex items-center gap-1"><Users size={14} /> {course.students} alunos</span>
                                            {course.averageGrade && <span className="flex items-center gap-1"><Award size={14} /> Média de {course.averageGrade}%</span>}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">Gerir Turma</Button>
                                            </DialogTrigger>
                                            <ManageClassDialog course={course} />
                                        </Dialog>
                                         <Button asChild variant="secondary"><Link href={`/dashboard/courses/edit/${course.id}`}><Edit size={16}/> Gerir Conteúdo</Link></Button>
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