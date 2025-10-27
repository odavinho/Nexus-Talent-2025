'use client';

import { Mail, Phone, MapPin, Linkedin, Globe, GraduationCap } from "lucide-react";
import { type UserProfile } from "@/lib/types";
import { Logo } from "../shared/logo";

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
}

export const CvPreviewTemplate = ({ data }: { data: CvData }) => {
    return (
        <div className="a4-page bg-white text-gray-800 font-sans">
             <header className="px-10 py-6 flex justify-between items-center border-b-2 border-gray-200">
                <div className="flex items-center gap-4">
                     <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0">
                        {/* Placeholder for a photo */}
                     </div>
                     <div>
                        <h1 className="text-4xl font-bold text-gray-800 leading-tight">
                            {data.firstName} {data.lastName}
                        </h1>
                        <p className="font-headline text-lg text-gray-600">
                            {data.academicTitle}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <Logo />
                </div>
            </header>
            
            <div className="grid grid-cols-12 gap-x-8 p-10">
                {/* Left Column */}
                <div id="cv-sidebar" className="col-span-4 space-y-8 bg-primary/5 p-6 rounded-lg">
                    <div>
                        <h2 className="section-title-side text-primary">CONTACTO</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            {data.phoneNumber && <div className="flex items-start gap-3"><Phone size={14} className="mt-1 flex-shrink-0" /><span>{data.phoneNumber}</span></div>}
                            {data.email && <div className="flex items-start gap-3"><Mail size={14} className="mt-1 flex-shrink-0" /><span>{data.email}</span></div>}
                            {data.cidade && <div className="flex items-start gap-3"><MapPin size={14} className="mt-1 flex-shrink-0" /><span>{data.cidade}</span></div>}
                             <div className="flex items-start gap-3"><Linkedin size={14} className="mt-1 flex-shrink-0" /><span>linkedin.com/in/...</span></div>
                        </div>
                    </div>

                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <h2 className="section-title-side text-primary">COMPETÊNCIAS</h2>
                            <ul className="mt-4 space-y-2 text-base">
                                {data.skills.map((skill, index) => (
                                   skill.value && <li key={index}>- {skill.value}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                     <div>
                        <h2 className="section-title-side text-primary">LÍNGUAS</h2>
                        <ul className="mt-4 space-y-2 text-base">
                            <li>Português (Nativo)</li>
                            <li>Inglês (Fluente)</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-8 space-y-8">
                     {data.summary && (
                         <section>
                            <h2 className="section-title-main">RESUMO PROFISSIONAL</h2>
                            <p className="mt-4 text-base text-gray-700 text-justify">{data.summary}</p>
                        </section>
                    )}

                    {data.workExperience && data.workExperience.length > 0 && (
                        <section>
                            <h2 className="section-title-main">EXPERIÊNCIA PROFISSIONAL</h2>
                            <div className="mt-4 space-y-6">
                                {data.workExperience.map((exp, index) => (
                                    <div key={index}>
                                        <p className="text-sm font-semibold text-gray-500 uppercase">{exp.period}</p>
                                        <h3 className="font-headline text-lg font-bold text-gray-900 mt-1">{exp.role}</h3>
                                        <p className="text-base font-medium text-gray-700">{exp.company}</p>
                                        {exp.description && <p className="mt-2 text-base text-gray-600 list-disc pl-4 text-justify">{exp.description}</p>}
                                    </div>
                                ))}
                           </div>
                        </section>
                    )}
                    
                    {data.academicHistory && data.academicHistory.length > 0 && (
                        <section>
                           <h2 className="section-title-main">FORMAÇÃO ACADÉMICA</h2>
                           <div className="mt-4 space-y-5">
                                {data.academicHistory.map((edu, index) => (
                                    <div key={index}>
                                         <p className="text-sm font-semibold text-gray-500 uppercase">{edu.year}</p>
                                        <h3 className="font-headline text-lg font-bold text-gray-900 mt-1">{edu.degree}</h3>
                                        <p className="text-base font-medium text-gray-700">{edu.institution}</p>
                                    </div>
                                ))}
                           </div>
                        </section>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    font-family: 'Inter', sans-serif;
                    line-height: 1.5;
                }
                .section-title-side {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 13pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    padding-bottom: 4px;
                    border-bottom: 1.5px solid hsl(var(--primary));
                    letter-spacing: 0.1em;
                }
                 .section-title-main {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 13pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: hsl(var(--foreground));
                    padding-bottom: 6px;
                    border-bottom: 2px solid hsl(var(--primary));
                    letter-spacing: 0.05em;
                }
                .text-4xl { font-size: 28pt !important; }
                .text-lg { font-size: 13pt !important; }
                .text-base { font-size: 11pt !important; }
                .text-sm { font-size: 11pt !important; }
            `}</style>
        </div>
    );
};
