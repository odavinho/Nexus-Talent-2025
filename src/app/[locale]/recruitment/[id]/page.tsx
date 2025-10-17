'use client';

import { getVacancyById } from "@/lib/vacancy-service";
import { notFound, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Briefcase, MapPin, Share2, Loader2, HelpCircle, Award, GraduationCap, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getCourseCategories } from "@/lib/course-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import type { UserProfile, Vacancy, CourseCategory } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";

export default function VacancyDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [vacancy, setVacancy] = useState<Vacancy | null | undefined>(undefined);
  const [category, setCategory] = useState<CourseCategory | null>(null);


  useEffect(() => {
    if (id) {
        const foundVacancy = getVacancyById(id);
        setVacancy(foundVacancy);
        if(foundVacancy){
            const categories = getCourseCategories();
            setCategory(categories.find(c => c.name === foundVacancy.category) || null);
        }
    }
  }, [id]);


  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  const [isApplying, setIsApplying] = useState(false);
  
  if (vacancy === undefined) {
    // Still loading
    return <div>Loading...</div>;
  }
  
  if (!vacancy) {
    notFound();
  }

  const handleApply = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Acesso Negado",
        description: "Você precisa fazer login para se candidatar a uma vaga.",
      });
      router.push('/login');
      return;
    }
    
    // This is now a mock application process
    setIsApplying(true);
    setTimeout(() => {
        toast({
            title: "Candidatura Simulada!",
            description: `A sua candidatura para ${vacancy.title} foi enviada com sucesso (simulação).`,
        });
        setIsApplying(false);
    }, 1500);

  };

  const toDate = (date: Timestamp | Date | undefined): Date | null => {
    if (!date) return null;
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    return date;
  }

  const closingDate = toDate(vacancy.closingDate);


  return (
    <>
      <Header />
      <main className="bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/recruitment" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft size={16} /> Voltar para as vagas
          </Link>
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              {category && <Badge className="mb-2">{category.name}</Badge>}
              <h1 className="font-headline text-3xl md:text-4xl font-bold">{vacancy.title}</h1>
              
              <div className="mt-6 prose prose-lg max-w-none text-foreground/90">
                  <p>{vacancy.description}</p>
                  
                  {vacancy.responsibilities && vacancy.responsibilities.length > 0 && (
                    <>
                      <h3 className="font-headline">Responsabilidades:</h3>
                      <ul>
                        {vacancy.responsibilities.map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    </>
                  )}

                  {vacancy.requirements && vacancy.requirements.length > 0 && (
                    <>
                      <h3 className="font-headline">Requisitos:</h3>
                      <ul>
                        {vacancy.requirements.map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    </>
                  )}
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                  <Card>
                      <CardHeader>
                          <CardTitle>Resumo da Vaga</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="space-y-4 text-sm">
                              <div className="flex items-center gap-3">
                                  <MapPin className="w-5 h-5 text-muted-foreground" />
                                  <span><strong>Localização:</strong> {vacancy.location}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                                  <span><strong>Tipo de Contrato:</strong> {vacancy.type}</span>
                              </div>
                              {vacancy.salaryRange && vacancy.showSalary && (
                                <div className="flex items-center gap-3">
                                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                                    <span><strong>Salário:</strong> {vacancy.salaryRange}</span>
                                </div>
                              )}
                               {vacancy.minExperience && (
                                <div className="flex items-center gap-3">
                                    <Award className="w-5 h-5 text-muted-foreground" />
                                    <span><strong>Experiência Mínima:</strong> {vacancy.minExperience}</span>
                                </div>
                              )}
                              {vacancy.minEducationLevel && (
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="w-5 h-5 text-muted-foreground" />
                                    <span><strong>Habilitações Mínimas:</strong> {vacancy.minEducationLevel}</span>
                                </div>
                              )}
                              {closingDate && (
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground" />
                                    <span><strong>Prazo de Candidatura:</strong> {format(closingDate, "d 'de' MMMM, yyyy", { locale: pt })}</span>
                                </div>
                              )}
                          </div>
                          
                          {vacancy.screeningQuestions && vacancy.screeningQuestions.length > 0 && (
                            <div className="mt-6 pt-6 border-t">
                                <h4 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle size={18}/> Perguntas de Triagem</h4>
                                <div className="space-y-4">
                                {vacancy.screeningQuestions.map((question, index) => (
                                    <div key={index} className="space-y-2">
                                        <Label htmlFor={`question-${index}`}>{question}</Label>
                                        <Textarea id={`question-${index}`} placeholder="Sua resposta..." rows={3} />
                                    </div>
                                ))}
                                </div>
                            </div>
                          )}

                          <Button 
                            size="lg" 
                            className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
                            onClick={handleApply}
                            disabled={isUserLoading || isApplying}
                          >
                            {isApplying ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>A processar...</>
                            ) : (
                                "Candidatar-se"
                            )}
                          </Button>
                          <Button size="lg" variant="outline" className="w-full mt-2">
                              <Share2 size={16} className="mr-2"/>
                              Compartilhar
                          </Button>
                      </CardContent>
                  </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
