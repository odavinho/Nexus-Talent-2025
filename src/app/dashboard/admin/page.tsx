
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookMarked, User, Briefcase, GraduationCap, Settings, Files, BarChart, Mail, AreaChart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GeneralReport } from "@/components/admin/general-report";
import { getCourses, getCourseCategories } from "@/lib/course-service";
import { getVacancies } from "@/lib/vacancy-service";
import { users } from "@/lib/users";
import { useState } from "react";


export default function AdminDashboardPage() {
  const [reportData, setReportData] = useState<any>(null);

  const handleGenerateReport = () => {
    const courses = getCourses();
    const courseCategories = getCourseCategories();
    const vacancies = getVacancies(true);
    const totalUsers = users.length;

    const courseData = courseCategories.map(category => ({
      name: category.name,
      total: courses.filter(course => course.category === category.id).length
    })).filter(c => c.total > 0);

    const vacancyData = vacancies.reduce((acc, vacancy) => {
        const location = vacancy.location;
        const existing = acc.find(item => item.name === location);
        if (existing) {
            existing.total++;
        } else {
            acc.push({ name: location, total: 1 });
        }
        return acc;
    }, [] as { name: string, total: number }[]);

    // Mock data for new charts and KPIs
    const weeklyEngagementData = [
      { day: 'Seg', users: 120 },
      { day: 'Ter', users: 150 },
      { day: 'Qua', users: 170 },
      { day: 'Qui', users: 140 },
      { day: 'Sex', users: 200 },
      { day: 'Sáb', users: 90 },
      { day: 'Dom', users: 70 },
    ];

    const recruitmentFunnelData = [
        { stage: 'Candidaturas', count: 1200 },
        { stage: 'Triagem', count: 400 },
        { stage: 'Entrevista', count: 150 },
        { stage: 'Oferta', count: 50 },
        { stage: 'Contratado', count: 25 },
    ];

    setReportData({
      totalCourses: courses.length,
      totalVacancies: vacancies.length,
      totalUsers: totalUsers,
      coursesByCategory: courseData,
      vacanciesByLocation: vacancyData,
      weeklyEngagement: weeklyEngagementData,
      recruitmentFunnel: recruitmentFunnelData,
      lmsKpis: {
        completionRate: 78,
        averageRating: 4.6,
        firstAttemptSuccessRate: 85,
      },
      atsKpis: {
        applicationsPerVacancy: 45.2,
        timeToHire: 28,
        profileCompletionRate: 65,
      }
    });
  }

  return (
    <div>
        <div className="flex items-center gap-4 mb-8">
            <User className="w-10 h-10 text-primary" />
            <div>
            <h1 className="font-headline text-4xl font-bold">Painel do Administrador</h1>
            <p className="text-muted-foreground">Gestão total da plataforma NexusTalent.</p>
            </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 grid gap-8 auto-rows-min">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap />
                                Gestão de Cursos
                            </CardTitle>
                            <CardDescription>Adicione, edite e organize todos os cursos da plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/dashboard/courses/new">Adicionar Curso</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/admin/courses">Gerir Cursos</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase />
                                Gestão de Vagas
                            </CardTitle>
                            <CardDescription>Publique e administre as oportunidades de emprego.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/dashboard/recruiter/vacancies/new">Adicionar Vaga</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/admin/vacancies">Gerir Vagas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Files />
                                Gestão de Candidaturas
                            </CardTitle>
                            <CardDescription>Visualize e gerencie todos os candidatos às vagas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/dashboard/admin/applications">Gerir Candidaturas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User />
                                Gestão de Usuários
                            </CardTitle>
                            <CardDescription>Gerencie todos os usuários, papéis e permissões.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/admin/users">Gerir Usuários</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail />
                                E-mail Marketing
                            </CardTitle>
                            <CardDescription>Crie e envie campanhas de e-mail com IA.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Button asChild>
                                <Link href="/dashboard/admin/email-marketing">Criar Campanha</Link>
                            </Button>
                            <Button asChild variant="outline">
                                <Link href="/dashboard/admin/campaigns">Ver Campanhas</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings />
                                Configurações do Site
                            </CardTitle>
                            <CardDescription>Edite o conteúdo estático do site, como parceiros e estatísticas.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/dashboard/settings">Gerir Conteúdo</Link>
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart />
                                Relatórios Gerais
                            </CardTitle>
                            <CardDescription>Visão geral do desempenho da plataforma.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="default" onClick={handleGenerateReport}>
                                        Gerar Relatório
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh]">
                                    <DialogHeader>
                                        <DialogTitle>Relatório Geral da Plataforma</DialogTitle>
                                        <DialogDescription>
                                            Visão geral do estado atual da plataforma NexusTalent.
                                        </DialogDescription>
                                    </DialogHeader>
                                    {reportData && <GeneralReport data={reportData} />}
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
