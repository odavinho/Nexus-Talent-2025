'use client';

import { useParams, notFound, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getVacancyById } from "@/lib/vacancy-service";
import { applications as allApplications } from "@/lib/applications";
import { users as allUsers } from "@/lib/users";
import { type Vacancy, type Application, type UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeResumeAction } from "@/app/actions";
import { RecruiterApplicationCard } from "@/components/recruitment/recruiter-application-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Users } from "lucide-react";

interface AnalyzedCandidate extends UserProfile {
    score?: number;
}

const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
});


export default function TriagePage() {
    const params = useParams();
    const vacancyId = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const { toast } = useToast();

    const [vacancy, setVacancy] = useState<Vacancy | null | undefined>(undefined);
    const [candidates, setCandidates] = useState<AnalyzedCandidate[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
    
    useEffect(() => {
        if (vacancyId) {
            const foundVacancy = getVacancyById(vacancyId);
            setVacancy(foundVacancy); 
            
            if (foundVacancy) {
                const vacancyApplications = allApplications.filter(app => app.jobPostingId === vacancyId);
                const vacancyCandidates = vacancyApplications.map(app => allUsers.find(u => u.id === app.userId)).filter((c): c is UserProfile => !!c);
                setCandidates(vacancyCandidates);
            }
        }
    }, [vacancyId]);


    const handleAnalyzeAll = async () => {
        if (!vacancy || candidates.length === 0) {
            toast({ variant: 'destructive', title: 'Nenhum candidato para analisar.' });
            return;
        }
        setIsAnalyzing(true);
        const jobDescription = `${vacancy.title}\n\n${vacancy.description}\n\nResponsabilidades:\n${vacancy.responsibilities.join('\n')}\n\nRequisitos:\n${vacancy.requirements.join('\n')}`;

        // Mock file fetching and analysis
        const updatedCandidates = await Promise.all(
            candidates.map(async (candidate) => {
                // In a real app, you'd fetch the resume file from storage (e.g., candidate.resumeUrl)
                // Here we simulate it by creating a dummy file object for the purpose of the action.
                // The actual content analysis is mocked by the AI flow. We just need the structure.
                try {
                     const resumeDataUri = "data:application/pdf;base64,JVBERi0xLjcK..."; // Dummy base64 data
                     const result = await analyzeResumeAction({ jobDescription, resumeDataUri });
                     return { ...candidate, score: result.candidateRanking };
                } catch (error) {
                    console.error(`Erro ao analisar ${candidate.firstName}:`, error);
                    return { ...candidate, score: 0 }; // Assign a score of 0 on failure
                }
            })
        );
        
        setCandidates(updatedCandidates.sort((a, b) => (b.score ?? 0) - (a.score ?? 0)));
        setIsAnalyzing(false);
        toast({ title: 'Análise Concluída', description: 'Todos os candidatos foram analisados com sucesso.' });
    };

    const handleSelectCandidate = (candidateId: string, isSelected: boolean) => {
        setSelectedCandidates(prev => 
            isSelected ? [...prev, candidateId] : prev.filter(id => id !== candidateId)
        );
    };

    const handleSelectOver50 = () => {
        const over50 = candidates
            .filter(c => (c.score ?? 0) > 50)
            .map(c => c.id);
        setSelectedCandidates(over50);
    };

    const handleAddToPipeline = () => {
        if (selectedCandidates.length === 0) {
            toast({ variant: 'destructive', title: 'Nenhum candidato selecionado.' });
            return;
        }

        const candidatesWithScores = candidates
            .filter(c => selectedCandidates.includes(c.id))
            .map(c => ({ id: c.id, score: c.score, name: `${c.firstName} ${c.lastName}` }));

        const analysisParam = encodeURIComponent(JSON.stringify(candidatesWithScores));
        router.push(`/dashboard/recruiter/vacancies/${vacancyId}/applications?analysis=${analysisParam}`);
    };


    if (vacancy === undefined) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!vacancy) {
        return notFound();
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div className="flex-grow">
                     <Button variant="outline" onClick={() => router.back()} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar às Vagas
                    </Button>
                    <h1 className="font-headline text-3xl font-bold">Triagem de IA para: <span className="text-primary">{vacancy.title}</span></h1>
                    <p className="text-muted-foreground mt-1">Analise, selecione e adicione candidatos ao seu pipeline de recrutamento.</p>
                </div>
                 <div className="flex gap-2">
                    {candidates.some(c => c.score !== undefined) && (
                        <Button variant="outline" onClick={handleSelectOver50}>
                            <Check className="mr-2 h-4 w-4" /> Selecionar > 50%
                        </Button>
                    )}
                    <Button onClick={handleAnalyzeAll} disabled={isAnalyzing}>
                        {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Analisar Todos com IA
                    </Button>
                    <Button onClick={handleAddToPipeline} disabled={selectedCandidates.length === 0}>
                        Adicionar ao Pipeline ({selectedCandidates.length})
                    </Button>
                </div>
            </div>

            {candidates.length > 0 ? (
                 <div className="space-y-4">
                    {candidates.map(candidate => (
                        <RecruiterApplicationCard 
                            key={candidate.id}
                            candidate={candidate}
                            score={candidate.score}
                            isSelected={selectedCandidates.includes(candidate.id)}
                            onSelect={handleSelectCandidate}
                        />
                    ))}
                </div>
            ) : (
                <Alert>
                    <Users className="h-4 w-4" />
                    <AlertTitle>Nenhum candidato!</AlertTitle>
                    <AlertDescription>
                        Ainda não há candidatos para esta vaga. Divulgue a sua vaga para começar a receber candidaturas.
                    </AlertDescription>
                </Alert>
            )}

        </div>
    );
}