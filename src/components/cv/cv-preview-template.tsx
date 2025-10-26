'use client';

import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Building, Globe, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Logo } from "../shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type CvData = {
    firstName?: string;
    lastName?: string;
    academicTitle?: string;
    phoneNumber?: string;
    email?: string;
    cidade?: string;
    summary?: string;
    workExperience?: { role: string; company: string; period: string; description?: string }[];
    academicHistory?: { degree: string; institution: string; year?: string }[];
    skills?: { value: string }[];
    profilePictureUrl?: string;
    nationality?: string;
    dateOfBirth?: string;
}

export const CvPreviewTemplate = ({ data }: { data: CvData }) => {

    const getInitials = (firstName?: string, lastName?: string) => {
        const f = firstName?.[0] || '';
        const l = lastName?.[0] || '';
        return `${f}${l}`.toUpperCase();
    }


    return (
        <div className="a4-page bg-white p-10 text-gray-800 font-body text-[10pt] leading-normal">
            {/* Header */}
            <header className="flex items-center justify-between mb-8 border-b-2 border-primary pb-4">
                <div className="w-40">
                    <Logo />
                </div>
                <h2 className="font-headline text-2xl font-light text-gray-500">Curriculum Vitae</h2>
            </header>

            {/* Main Content */}
            <div className="space-y-8">

                {/* Personal Information */}
                <section>
                    <div className="grid grid-cols-[140px_1fr] gap-8">
                        <div className="w-[140px] h-[160px] bg-gray-100 rounded-md overflow-hidden">
                           <Avatar className="w-full h-full rounded-md">
                                <AvatarImage src={data.profilePictureUrl} className="object-cover" />
                                <AvatarFallback className="rounded-md text-4xl bg-gray-200">
                                    {getInitials(data.firstName, data.lastName)}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h3 className="section-title-side mb-4">INFORMAÇÃO PESSOAL</h3>
                            <h2 className="font-headline text-3xl font-bold text-gray-800 leading-tight">{data.firstName} {data.lastName}</h2>
                            <div className="mt-4 space-y-2 text-sm text-gray-600">
                                {data.cidade && <div className="flex items-center gap-3"><MapPin size={14} className="text-gray-500" /><span>{data.cidade}</span></div>}
                                {data.phoneNumber && <div className="flex items-center gap-3"><Phone size={14} className="text-gray-500" /><span>{data.phoneNumber}</span></div>}
                                {data.email && <div className="flex items-center gap-3"><Mail size={14} className="text-gray-500" /><span>{data.email}</span></div>}
                            </div>
                            <div className="mt-3 space-y-2 text-sm text-gray-600">
                                {data.dateOfBirth && <div className="flex items-center gap-3"><span className="font-semibold">Data de Nascimento:</span><span>{data.dateOfBirth}</span></div>}
                                {data.nationality && <div className="flex items-center gap-3"><span className="font-semibold">Nacionalidade:</span><span>{data.nationality}</span></div>}
                            </div>
                        </div>
                    </div>
                </section>
                
                 {data.academicTitle && (
                     <section>
                        <div className="grid grid-cols-[140px_1fr] gap-8 items-start">
                            <h3 className="section-title-side">POSIÇÃO</h3>
                            <div className="font-headline font-semibold text-base">{data.academicTitle}</div>
                        </div>
                    </section>
                 )}

                {/* Work Experience */}
                {data.workExperience && data.workExperience.length > 0 && (
                    <section>
                        <div className="grid grid-cols-[140px_1fr] gap-8">
                           <h3 className="section-title-side">EXPERIÊNCIA PROFISSIONAL</h3>
                           <div className="space-y-6">
                                {data.workExperience.map((exp, index) => (
                                    <div key={index} className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-xs font-semibold text-gray-600">{exp.period}</div>
                                        <div>
                                            <h4 className="font-headline text-base font-bold">{exp.role}</h4>
                                            <p className="text-sm font-medium text-primary">{exp.company}</p>
                                            {exp.description && <p className="mt-1 text-sm text-gray-700 list-disc pl-4">{exp.description}</p>}
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </div>
                    </section>
                )}
                
                {/* Education */}
                {data.academicHistory && data.academicHistory.length > 0 && (
                    <section>
                         <div className="grid grid-cols-[140px_1fr] gap-8">
                           <h3 className="section-title-side">EDUCAÇÃO E FORMAÇÃO</h3>
                           <div className="space-y-6">
                                {data.academicHistory.map((edu, index) => (
                                    <div key={index} className="grid grid-cols-[120px_1fr] gap-4">
                                        <div className="text-xs font-semibold text-gray-600">{edu.year}</div>
                                        <div>
                                            <h4 className="font-headline text-base font-bold">{edu.degree}</h4>
                                            <p className="text-sm font-medium text-primary">{edu.institution}</p>
                                        </div>
                                    </div>
                                ))}
                           </div>
                        </div>
                    </section>
                )}

                {/* Skills */}
                {data.skills && data.skills.length > 0 && (
                     <section>
                        <div className="grid grid-cols-[140px_1fr] gap-8">
                            <h3 className="section-title-side">COMPETÊNCIAS</h3>
                             <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                   skill.value && <Badge key={index} variant="secondary" className="text-sm">{skill.value}</Badge>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>

            <footer className="text-center text-xs text-gray-400 pt-8 mt-12 border-t">
                © {new Date().getFullYear()} NexusTalent - Gerado pelo Construtor de CV
            </footer>


            <style jsx global>{`
                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                }
                .section-title-side {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    color: hsl(var(--primary));
                    text-transform: uppercase;
                    border-right: 2px solid hsl(var(--primary));
                    padding-right: 1.5rem;
                    height: fit-content;
                    line-height: 1.4;
                }
            `}</style>
        </div>
    );
};
