'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from "../ui/button";
import { FileDown } from "lucide-react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useRef } from "react";
import { Logo } from "../shared/logo";

interface ReportData {
    totalCourses?: number;
    totalVacancies?: number;
    totalUsers?: number;
    coursesByCategory?: { name: string, total: number }[];
    vacanciesByLocation?: { name: string, total: number }[];
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
        <p className="text-sm">{`Total: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export function GeneralReport({ data, reportType = 'all' }: GeneralReportProps) {
    const reportRef = useRef<HTMLDivElement>(null);

    const handleExportPDF = () => {
        const input = reportRef.current;
        if (input) {
            html2canvas(input, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgWidth = canvas.width;
                const imgHeight = canvas.height;
                const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
                const imgX = (pdfWidth - imgWidth * ratio) / 2;
                const imgY = 15;
                
                pdf.setFont("helvetica", "bold");
                pdf.text("Relatório Geral - NexusTalent", pdfWidth / 2, 10, { align: 'center' });
                pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
                pdf.save(`relatorio_nexustalent_${new Date().toLocaleDateString('pt-PT')}.pdf`);
            });
        }
    };
    
    return (
        <div className="flex flex-col h-full">
             <div id="report-content" ref={reportRef} className="flex-grow overflow-y-auto p-4 bg-white text-black">
                <div className="space-y-8">
                     {reportType !== 'courses' && reportType !== 'vacancies' && (
                        <div className="text-center mb-8">
                            <h1 className="font-headline text-3xl font-bold">Relatório Geral da Plataforma</h1>
                            <p className="text-muted-foreground">Dados de {new Date().toLocaleDateString('pt-PT', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                     )}

                    {(reportType === 'all' || reportType === 'courses') && data.coursesByCategory && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição de Cursos por Categoria</CardTitle>
                                <CardDescription>Total de Cursos: {data.totalCourses}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.coursesByCategory} layout="vertical" margin={{ left: 120 }}>
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} interval={0} fontSize={12} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="total" name="Nº de Cursos" fill="#1d71b8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                    
                    {(reportType === 'all' || reportType === 'vacancies') && data.vacanciesByLocation && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribuição de Vagas por Localização</CardTitle>
                                <CardDescription>Total de Vagas: {data.totalVacancies}</CardDescription>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.vacanciesByLocation}>
                                        <XAxis dataKey="name" interval={0} angle={-45} textAnchor="end" height={80} fontSize={12}/>
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="total" name="Nº de Vagas" fill="#f59e0b" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {reportType === 'all' && (
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="text-center">
                                <CardHeader><CardTitle>{data.totalCourses}</CardTitle></CardHeader>
                                <CardContent><p>Cursos Totais</p></CardContent>
                            </Card>
                             <Card className="text-center">
                                <CardHeader><CardTitle>{data.totalVacancies}</CardTitle></CardHeader>
                                <CardContent><p>Vagas Totais</p></CardContent>
                            </Card>
                             <Card className="text-center">
                                <CardHeader><CardTitle>{data.totalUsers}</CardTitle></CardHeader>
                                <CardContent><p>Utilizadores Registados</p></CardContent>
                            </Card>
                        </div>
                    )}
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
