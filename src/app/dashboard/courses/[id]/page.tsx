
'use client';

import { getCourseById, getCourses, getCourseCategories } from "@/lib/course-service";
import { notFound, useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Users, CheckCircle, Target, List, Video, FileText, Bot, Notebook, Save, Download } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { type Metadata } from 'next';
import type { Course, CourseModule, CourseTopic } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";


function CoursePlayerPage({ course }: { course: Course }) {
  const [activeModule, setActiveModule] = useState<CourseModule | null>(course.modules[0] || null);
  const [activeTopic, setActiveTopic] = useState<CourseTopic | null>(course.modules[0]?.topics[0] || null);
  const [journalNotes, setJournalNotes] = useState('');
  const { toast } = useToast();

  const handleTopicClick = (module: CourseModule, topic: CourseTopic) => {
      setActiveModule(module);
      setActiveTopic(topic);
  };
  
  const handleSaveNotes = () => {
    // Simula o salvamento das anotações
    toast({
      title: "Diário Salvo!",
      description: "As suas anotações foram salvas com sucesso (simulação).",
    });
  };

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
                <div className="w-full aspect-video bg-black rounded-lg flex flex-col items-center justify-center text-white mb-6 p-4 text-center">
                    <Video size={64} />
                    <p className="ml-4 text-xl mt-4">Simulação do Media Player</p>
                    <p className="text-muted-foreground text-sm mt-2">A mostrar conteúdo para: <strong className="text-white">{activeTopic?.title || activeModule?.title}</strong></p>
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
                                    <li className="flex items-center justify-between">
                                        <p>Apostila do Módulo.pdf</p>
                                        <Button variant="outline" size="sm" asChild>
                                          <a href="/resources/Apostila.pdf" download="Apostila_do_Modulo.pdf">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                          </a>
                                        </Button>
                                    </li>
                                    <li className="flex items-center justify-between">
                                        <p>Exercícios Práticos.zip</p>
                                        <Button variant="outline" size="sm" asChild>
                                          <a href="/resources/Exercicios.zip" download="Exercicios_Praticos.zip">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                          </a>
                                        </Button>
                                    </li>
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
                                <Textarea 
                                    placeholder="Faça as suas anotações aqui..." 
                                    className="h-32 mb-4"
                                    value={journalNotes}
                                    onChange={(e) => setJournalNotes(e.target.value)}
                                />
                                <Button onClick={handleSaveNotes}>
                                  <Save className="mr-2 h-4 w-4"/> Guardar Anotações
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Sidebar - Module List */}
            <div className="lg:col-span-1">
                <Card className="h-full flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="font-semibold text-lg">Conteúdo do Curso</h2>
                    </div>
                    <ScrollArea className="flex-grow">
                        <div className="p-2">
                            {course.modules.map((module, index) => (
                                <div key={index} className='py-2'>
                                    <h3 className='font-semibold px-3 py-2 text-primary/80'>{module.title}</h3>
                                    <div className='space-y-1'>
                                        {module.topics.map((topic, topicIndex) => (
                                            <button 
                                                key={topicIndex} 
                                                onClick={() => handleTopicClick(module, topic)}
                                                className={`w-full text-left p-3 rounded-md transition-colors flex items-center gap-3 text-sm ${activeTopic?.title === topic.title ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-secondary'}`}
                                            >
                                                <BookOpen size={16} className={`${activeTopic?.title === topic.title ? 'text-primary' : 'text-muted-foreground'}`}/>
                                                <span className="flex-grow">{topic.title}</span>
                                                {topic.videoUrl && <Video size={16} className="text-muted-foreground"/>}
                                            </button>
                                        ))}
                                    </div>
                                </div>
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

    