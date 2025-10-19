
'use client';

import { getCourseById, getCourses, getCourseCategories } from "@/lib/course-service";
import { notFound, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, CheckCircle, Target, List, Video, FileText, Bot, Notebook } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { type Metadata } from 'next';
import type { Course, CourseModule } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";


function CoursePlayerPage({ course }: { course: Course }) {
  const [activeModule, setActiveModule] = useState<CourseModule | null>(course.modules[0] || null);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col">
       <div className="mb-6">
         <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft size={16} /> Voltar ao Painel
          </Link>
         <h1 className="font-headline text-3xl md:text-4xl font-bold mt-2">{course.name}</h1>
       </div>

        <div className="grid lg:grid-cols-3 gap-8 flex-grow">
            {/* Main Content - Video Player and Tabs */}
            <div className="lg:col-span-2 flex flex-col">
                {/* Video Player Placeholder */}
                <div className="w-full aspect-video bg-black rounded-lg flex items-center justify-center text-white mb-6">
                    <Video size={64} />
                    <p className="ml-4 text-xl">Simulação do Media Player</p>
                </div>
                
                {/* Tabs for Resources, Quizzes, Notes */}
                <Tabs defaultValue="resources" className="w-full">
                    <TabsList>
                        <TabsTrigger value="resources"><FileText className="mr-2 h-4 w-4"/>Recursos</TabsTrigger>
                        <TabsTrigger value="quiz"><Bot className="mr-2 h-4 w-4"/>Teste Rápido</TabsTrigger>
                        <TabsTrigger value="journal"><Notebook className="mr-2 h-4 w-4"/>Diário de Aprendizagem</TabsTrigger>
                    </TabsList>
                    <TabsContent value="resources">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Materiais para Download</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center justify-between"><p>Apostila do Módulo.pdf</p><Button variant="outline" size="sm">Download</Button></li>
                                    <li className="flex items-center justify-between"><p>Exercícios Práticos.zip</p><Button variant="outline" size="sm">Download</Button></li>
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="quiz">
                         <Card>
                            <CardContent className="p-6 text-center">
                                <h3 className="font-semibold mb-4">Quiz Interativo (Simulação)</h3>
                                <p className="text-muted-foreground mb-4">Esta área irá conter um quiz interativo para testar os seus conhecimentos.</p>
                                <Button>Iniciar Quiz</Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="journal">
                         <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold mb-4">Minhas Anotações</h3>
                                <Textarea placeholder="Faça as suas anotações aqui. Elas serão salvas automaticamente." className="h-32"/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Sidebar - Module List */}
            <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg">Módulos do Curso</h2>
                    </div>
                    <ScrollArea className="flex-grow">
                        <div className="p-2 space-y-1">
                            {course.modules.map((module, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setActiveModule(module)}
                                    className={`w-full text-left p-3 rounded-md transition-colors ${activeModule?.title === module.title ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary'}`}
                                >
                                    <p className="flex items-center gap-2"><BookOpen size={16}/> Módulo {index + 1}: {module.title}</p>
                                    <div className="pl-6 mt-1">
                                        {module.topics.map((topic, topicIndex) => (
                                            <p key={topicIndex} className="text-xs text-muted-foreground">&bull; {topic}</p>
                                        ))}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </Card>
            </div>
        </div>
    </div>
  );
}


export default function CourseDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [course, setCourse] = useState<Course | null | undefined>(undefined);

  useEffect(() => {
    if (id) {
        const foundCourse = getCourseById(id);
        setCourse(foundCourse);
    }
  }, [id]);

  if (course === undefined) {
    return <div>A carregar...</div>
  }
  
  if (!course) {
    return notFound();
  }
  
  return <CoursePlayerPage course={course} />;
}
