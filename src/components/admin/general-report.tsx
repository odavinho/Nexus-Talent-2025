'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { Button } from "../ui/button";
import { FileDown, Users, BookOpen, Briefcase, TrendingUp, Star, Percent, Clock, CheckCircle } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from "react";

interface ReportData {
    totalCourses: number;
    totalVacancies: number;
    totalUsers: number;
    coursesByCategory: { name: string, total: number }[];
    vacanciesByLocation: { name: string, total: number }[];
    // New mock data for KPIs
    weeklyEngagement: { day: string, users: number }[];
    recruitmentFunnel: { stage: string, count: number }[];
    lmsKpis: {
        completionRate: number;
        averageRating: number;
        firstAttemptSuccessRate: number;
    };
    atsKpis: {
        applicationsPerVacancy: number;
        timeToHire: number;
        profileCompletionRate: number;
    };
}

interface GeneralReportProps {
    data: ReportData;
    reportType?: 'all' | 'courses' | 'vacancies';
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-background border rounded-md shadow-lg">
        <p className="font-bold">{label}</p>
        <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const KpiCard = ({ title, value, icon: Icon }: { title: string, value: string, icon: React.ElementType }) => (
    <Card>
        <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2"><Icon size={14}/> {title}</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-2xl font-bold">{value}</p>
        </CardContent>
    </Card>
);

export function GeneralReport({ data, reportType = 'all' }: GeneralReportProps) {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = () => {
        const input = reportRef.current;
        if (input) {
            const originalBg = input.style.backgroundColor;
            input.style.backgroundColor = 'white'; // Ensure background is white for canvas

            html2canvas(input, { 
                scale: 2,
                useCORS: true,
                onclone: (document) => {
                    // This is needed to ensure tailwind dark mode classes are not applied
                    document.documentElement.classList.remove('dark');
                }
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                
                pdf.setFont("helvetica", "bold");
                pdf.text("Relatório Geral - NexusTalent", pdfWidth / 2, 15, { align: 'center' });
                pdf.addImage(imgData, 'PNG', imgX, 20, imgWidth * ratio, imgHeight * ratio);
                pdf.save(`relatorio_nexustalent_${new Date().toLocaleDateString('pt-PT')}.pdf`);
                
                input.style.backgroundColor = originalBg; // Restore original background
            });
        }
    };
    
    return (
        <div className="flex flex-col h-full">
             <div id="report-content" ref={reportRef} className="flex-grow overflow-y-auto p-6 bg-white text-black">
                <div className="space-y-10">
                    <div className="text-center mb-8">
                        <h1 className="font-headline text-3xl font-bold">Relatório de Desempenho da Plataforma</h1>
                        <p className="text-gray-500">Dados de {new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* General KPIs */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpiCard title="Utilizadores Totais" value={data.totalUsers.toString()} icon={Users} />
                        <KpiCard title="Cursos Ativos" value={data.totalCourses.toString()} icon={BookOpen} />
                        <KpiCard title="Vagas Ativas" value={data.totalVacancies.toString()} icon={Briefcase} />
                    </div>

                     {/* LMS Section */}
                    <div className="space-y-6">
                        <h2 className="font-headline text-2xl font-bold border-b pb-2">Engajamento & Qualidade (LMS)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KpiCard title="Taxa de Conclusão de Curso" value={`${data.lmsKpis.completionRate}%`} icon={Percent} />
                            <KpiCard title="Avaliação Média dos Cursos" value={`${data.lmsKpis.averageRating.toFixed(1)} / 5.0`} icon={Star} />
                            <KpiCard title="Sucesso na 1ª Tentativa" value={`${data.lmsKpis.firstAttemptSuccessRate}%`} icon={CheckCircle} />
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Engajamento Semanal (Utilizadores Ativos)</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                               <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.weeklyEngagement} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="day" />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line type="monotone" dataKey="users" name="Utilizadores Ativos" stroke="#1d71b8" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                     {/* ATS Section */}
                    <div className="space-y-6">
                        <h2 className="font-headline text-2xl font-bold border-b pb-2">Funil de Recrutamento (ATS)</h2>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KpiCard title="Candidaturas / Vaga" value={data.atsKpis.applicationsPerVacancy.toFixed(1)} icon={TrendingUp} />
                            <KpiCard title="Tempo para Contratar (dias)" value={data.atsKpis.timeToHire.toString()} icon={Clock} />
                            <KpiCard title="Taxa de Conclusão de Perfil" value={`${data.atsKpis.profileCompletionRate}%`} icon={Percent} />
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Eficiência do Funil de Recrutamento</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.recruitmentFunnel}>
                                        <XAxis dataKey="stage" fontSize={12} />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="count" name="Nº de Candidatos" fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
             <div className="p-4 border-t bg-background flex justify-end">
                <Button onClick={handleExportPDF}>
                    <FileDown className="mr-2 h-4 w-4" /> Exportar para PDF
                </Button>
            </div>
        </div>
    );
}