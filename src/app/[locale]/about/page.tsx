import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Target, Users, GraduationCap } from 'lucide-react';
import { getImages } from '@/lib/site-data';
import { LocationsSection } from '@/components/home/locations-section';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { RunningCourses } from '@/components/home/running-courses';

const testimonials = [
    {
        quote: "A Nexus Talent transformou completamente nossa experiência educacional. Os métodos de ensino inovadores e a abordagem personalizada tornaram o aprendizado envolvente e agradável. O compromisso deles em desenvolver talentos é evidente em todos os aspectos de seus programas.",
        name: "Ernie Howard",
        role: "Cliente",
        avatarId: "avatar-1"
    },
    {
        quote: "O compromisso da Nexus Talent com a excelência em educação é incomparável. A abordagem personalizada e a dedicação ao desenvolvimento de talentos criaram um ambiente onde os estudantes prosperam. Seus métodos de ensino inovadores tiveram um impacto positivo significativo.",
        name: "Marty Leeto",
        role: "Cliente",
        avatarId: "avatar-2"
    },
    {
        quote: "Trabalhar com a Nexus Talent foi um divisor de águas para nossa instituição. Seus métodos inovadores e abordagem personalizada revolucionaram a forma como percebemos o aprendizado. A dedicação ao desenvolvimento de talentos criou uma experiência educacional dinâmica.",
        name: "Kylie Portis",
        role: "Cliente",
        avatarId: "avatar-3"
    },
    {
        quote: "Recomendo altamente a Nexus Talent por seu compromisso excepcional com a excelência. A atenção personalizada e a dedicação ao desenvolvimento de talentos criaram um ambiente de aprendizado verdadeiramente transformador e enriquecedor.",
        name: "Michaela K",
        role: "Cliente",
        avatarId: "avatar-4"
    },
];

export default function AboutPage() {
    const images = getImages();
    const aboutHeroImage = images.find(p => p.id === 'about-hero');

    return (
        <>
            <Header />
            <main>
                {/* Hero Section */}
                <section className="relative bg-background py-20 md:py-32">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="font-headline text-4xl md:text-6xl font-bold">Formamos e Recrutamos com Excelência</h1>
                        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            A Nexus Talent é sua plataforma de formação profissional e recrutamento de elite. Conectamos talentos a oportunidades e impulsionamos o crescimento.
                        </p>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="py-16 sm:py-24 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Por que nos escolher?</h2>
                            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">Capacite-se e encontre sua equipe ideal com a Nexus Talent.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="flex flex-col items-center">
                                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                                    <GraduationCap size={32} />
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-2">Cursos Online e Presenciais</h3>
                                <p className="text-muted-foreground">Descubra nossa plataforma de cursos projetada para impulsionar sua carreira e ampliar suas habilidades.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                                    <Target size={32} />
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-2">Recrutamento e Seleção</h3>
                                <p className="text-muted-foreground">Encontre a equipe ideal com nossos serviços especializados de recrutamento e seleção de talentos.</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="bg-primary/10 text-primary p-4 rounded-full mb-4">
                                    <Users size={32} />
                                </div>
                                <h3 className="font-headline text-xl font-bold mb-2">Cessão de Mão de Obra</h3>
                                <p className="text-muted-foreground">Serviços de cessão de mão de obra especializada para diversos setores no Brasil, Angola e Portugal.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                <RunningCourses />

                {/* Locations Section */}
                <LocationsSection />

                {/* Testimonials Section */}
                <section className="py-16 sm:py-24 bg-card">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="font-headline text-3xl sm:text-4xl font-bold">O que nossos clientes dizem</h2>
                            <p className="mt-3 max-w-2xl mx-auto text-muted-foreground">Depoimentos de clientes satisfeitos com nossos serviços.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {testimonials.map((testimonial, index) => {
                                const avatar = images.find(p => p.id === testimonial.avatarId);
                                return (
                                    <Card key={index} className="bg-background">
                                        <CardContent className="pt-6">
                                            <p className="text-muted-foreground italic mb-4">"{testimonial.quote}"</p>
                                            <div className="flex items-center gap-4">
                                                {avatar && (
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                        <Image src={avatar.imageUrl} alt={testimonial.name} fill className="object-cover" data-ai-hint={avatar.imageHint} />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold">{testimonial.name}</p>
                                                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}