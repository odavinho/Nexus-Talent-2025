'use client';

import { useParams, notFound, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { getVacancyById } from "@/lib/vacancy-service";
import { applications as allApplications } from "@/lib/applications";
import { users as allUsers } from "@/lib/users";
import { type Vacancy, type Application, type UserProfile, type ApplicationStatus } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, FileDown, GraduationCap } from "lucide-react";
import { RecruitmentPipeline } from "@/components/recruitment/recruitment-pipeline";
import { Timestamp } from "firebase/firestore";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface TriagedCandidate extends Application {
    candidate: UserProfile;
    score?: number;
}

// Extend jsPDF interface to include autoTable method
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export default function VacancyApplicationsPage() {
    const params = useParams();
    const vacancyId = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const searchParams = useSearchParams();

    const [vacancy, setVacancy] = useState<Vacancy | null | undefined>(undefined);
    const [applications, setApplications] = useState<TriagedCandidate[]>([]);
    
    useEffect(() => {
        if (vacancyId) {
            const foundVacancy = getVacancyById(vacancyId);
            setVacancy(foundVacancy); 
            
            if (foundVacancy) {
                const existingApps = allApplications
                    .filter(app => app.jobPostingId === vacancyId)
                    .map(app => {
                        const candidate = allUsers.find(u => u.id === app.userId);
                        return { ...app, candidate };
                    })
                    .filter((item): item is TriagedCandidate => !!item.candidate);

                const analysisParam = searchParams.get('analysis');
                let combinedApps = [...existingApps];

                if (analysisParam) {
                    try {
                        const triagedData = JSON.parse(decodeURIComponent(analysisParam)) as { id: string, name: string, score: number }[];
                        
                        triagedData.forEach(triagedItem => {
                            const candidateProfile = allUsers.find(u => u.firstName.toLowerCase() === triagedItem.name.split('.')[0].toLowerCase());
                            
                            if (candidateProfile) {
                                const existingAppIndex = combinedApps.findIndex(app => app.userId === candidateProfile.id);
                                
                                if (existingAppIndex !== -1) {
                                    // Candidate already applied, just update the score and status if needed
                                    combinedApps[existingAppIndex] = {
                                        ...combinedApps[existingAppIndex],
                                        score: triagedItem.score,
                                        status: 'Triagem' // Move to Triagem if they were just 'Recebida'
                                    };
                                } else {
                                    // New candidate from analysis, add them
                                    combinedApps.push({
                                        id: `${candidateProfile.id}_${vacancyId}`,
                                        userId: candidateProfile.id,
                                        jobPostingId: vacancyId,
                                        applicationDate: new Date(), 
                                        status: 'Triagem', // Set status to 'Triagem'
                                        candidate: candidateProfile,
                                        score: triagedItem.score,
                                    });
                                }
                            }
                        });
                    } catch(e) {
                        console.error("Failed to parse triaged candidates from URL:", e);
                    }
                }

                setApplications(combinedApps);

            } else if (foundVacancy === null) { 
                notFound();
            }
        }
    }, [vacancyId, searchParams]);

    const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
        setApplications(prev => prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app));
    };

    const handleGenerateReport = () => {
        if (!vacancy) return;

        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        // --- Header ---
        // Logo
        doc.setFillColor(33, 150, 243); // Primary color
        doc.setDrawColor(33, 150, 243);
        doc.rect(14, 15, 10, 10, 'FD'); // Square
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        // This is a simplified representation of the GraduationCap icon
        doc.text('🎓', 16, 22);

        // Title
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Nexus", 26, 22);
        doc.setTextColor(33, 150, 243);
        doc.text("Talent", 46, 22);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 0);
        doc.text(`Relatório de Recrutamento: ${vacancy.title}`, 14, 40);
        
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Vaga ID: ${vacancy.id}`, 14, 48);
        doc.text(`Total de Candidatos: ${applications.length}`, 14, 54);

        // --- Table ---
        const tableData = applications.map(app => [
            `${app.candidate.firstName} ${app.candidate.lastName}`,
            app.status,
            app.score !== undefined ? `${app.score}%` : 'N/A',
            app.candidate.academicTitle || 'N/A'
        ]);

        doc.autoTable({
            startY: 65,
            head: [['Candidato', 'Status', 'Pontuação IA', 'Habilitações']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [29, 113, 184] }, // Darker primary color for header
            didDrawPage: (data) => {
                // --- Footer ---
                doc.setFontSize(8);
                doc.setTextColor(150);
                const footerText = `Gerado por NexusTalent | ${new Date().toLocaleDateString('pt-PT')}`;
                doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
            }
        });

        doc.save(`Relatorio_${vacancy.title.replace(/ /g, '_')}.pdf`);
    };

    if (vacancy === undefined) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!vacancy) {
        return notFound();
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <Button variant="outline" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar às Minhas Vagas
                    </Button>
                     <Button variant="outline" onClick={handleGenerateReport}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Gerar Relatório (PDF)
                    </Button>
                </div>
                
                <div className="mb-8">
                    <h1 className="font-headline text-3xl font-bold">Pipeline de Recrutamento</h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        <span className="font-semibold">{vacancy.title}</span> - {applications.length} candidatura(s) no total.
                    </p>
                </div>
            </div>
            
            <RecruitmentPipeline 
                applications={applications}
                onStatusChange={handleStatusChange} 
            />
        </div>
    );
}
    