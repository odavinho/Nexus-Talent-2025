'use client';

import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
import { type UserProfile } from "@/lib/types";

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
        <div className="a4-page bg-white text-gray-900 font-sans leading-relaxed">
            <div className="grid grid-cols-3">
                {/* Left Column */}
                <div className="col-span-1 bg-primary text-primary-foreground p-8 space-y-8">
                    <div>
                        <h2 className="section-title-side text-primary-foreground/80">CONTACTO</h2>
                        <div className="mt-4 space-y-3 text-sm">
                            {data.phoneNumber && <div className="flex items-start gap-3"><Phone size={14} className="mt-1" /><span>{data.phoneNumber}</span></div>}
                            {data.email && <div className="flex items-start gap-3"><Mail size={14} className="mt-1" /><span>{data.email}</span></div>}
                            {data.cidade && <div className="flex items-start gap-3"><MapPin size={14} className="mt-1" /><span>{data.cidade}</span></div>}
                             <div className="flex items-start gap-3"><Linkedin size={14} className="mt-1" /><span>linkedin.com/in/...</span></div>
                        </div>
                    </div>

                    {data.skills && data.skills.length > 0 && (
                        <div>
                            <h2 className="section-title-side text-primary-foreground/80">COMPETÊNCIAS</h2>
                            <ul className="mt-4 space-y-2 text-sm list-disc pl-4">
                                {data.skills.map((skill, index) => (
                                   skill.value && <li key={index}>{skill.value}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                     <div>
                        <h2 className="section-title-side text-primary-foreground/80">LÍNGUAS</h2>
                        <ul className="mt-4 space-y-2 text-sm list-disc pl-4">
                            <li>Português (Nativo)</li>
                            <li>Inglês (Fluente)</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column */}
                <div className="col-span-2 p-8 space-y-8">
                     <div>
                        <h1 className="font-headline text-4xl font-bold text-gray-800 leading-tight">{data.firstName} {data.lastName}</h1>
                        <p className="text-xl font-light text-primary mt-1">{data.academicTitle}</p>
                    </div>

                    {data.summary && (
                         <section>
                            <h2 className="section-title-main">RESUMO PROFISSIONAL</h2>
                            <p className="mt-4 text-sm text-gray-700">{data.summary}</p>
                        </section>
                    )}

                    {data.workExperience && data.workExperience.length > 0 && (
                        <section>
                            <h2 className="section-title-main">EXPERIÊNCIA PROFISSIONAL</h2>
                            <div className="mt-4 space-y-6">
                                {data.workExperience.map((exp, index) => (
                                    <div key={index}>
                                        <h3 className="font-headline text-base font-bold">{exp.role} <span className="font-normal text-gray-600">| {exp.company}</span></h3>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mt-1">{exp.period}</p>
                                        {exp.description && <p className="mt-2 text-sm text-gray-700 list-disc pl-4">{exp.description}</p>}
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
                                        <h3 className="font-headline text-base font-bold">{edu.degree}</h3>
                                        <p className="text-sm font-medium text-gray-600">{edu.institution}</p>
                                        <p className="text-xs font-semibold text-gray-500 uppercase mt-1">{edu.year}</p>
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
                    font-size: 10pt;
                }
                .section-title-side {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    padding-bottom: 4px;
                    border-bottom: 1px solid currentColor;
                    letter-spacing: 0.05em;
                }
                 .section-title-main {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 13pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: hsl(var(--primary));
                    padding-bottom: 6px;
                    border-bottom: 2px solid hsl(var(--primary));
                    letter-spacing: 0.05em;
                }
            `}</style>
        </div>
    );
};
