'use client';

import { Mail, Phone, MapPin, Linkedin, Globe } from "lucide-react";
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

export const CvPreviewModernTemplate = ({ data }: { data: CvData }) => {
    return (
        <div className="a4-page bg-white text-gray-800 font-sans">
            <div className="grid grid-cols-12 min-h-[297mm]">
                {/* Main Column */}
                <div className="col-span-8 p-10 pr-6">
                    <header className="mb-10">
                        <h1 className="font-headline text-4xl font-bold text-gray-800 leading-tight">
                            {data.firstName} {data.lastName}
                        </h1>
                        <h2 className="font-headline text-lg text-primary mt-1">
                            {data.academicTitle}
                        </h2>
                    </header>

                    {data.summary && (
                         <section className="mb-8">
                            <h3 className="section-title-main">Resumo Profissional</h3>
                            <p className="mt-3 text-base text-gray-700 text-justify">{data.summary}</p>
                        </section>
                    )}

                    {data.workExperience && data.workExperience.length > 0 && (
                        <section className="mb-8">
                            <h3 className="section-title-main">Experiência Profissional</h3>
                            <div className="mt-4 space-y-6">
                                {data.workExperience.map((exp, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-headline text-lg font-bold text-gray-900">{exp.role}</h4>
                                            <p className="text-sm font-medium text-gray-500">{exp.period}</p>
                                        </div>
                                        <p className="text-base font-medium text-primary">{exp.company}</p>
                                        {exp.description && <p className="mt-2 text-base text-gray-600 text-justify">{exp.description}</p>}
                                    </div>
                                ))}
                           </div>
                        </section>
                    )}

                     {data.academicHistory && data.academicHistory.length > 0 && (
                        <section>
                           <h3 className="section-title-main">Formação Académica</h3>
                           <div className="mt-4 space-y-5">
                                {data.academicHistory.map((edu, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-headline text-lg font-bold text-gray-900">{edu.degree}</h4>
                                            <p className="text-sm font-medium text-gray-500">{edu.year}</p>
                                        </div>
                                        <p className="text-base font-medium text-gray-700">{edu.institution}</p>
                                    </div>
                                ))}
                           </div>
                        </section>
                    )}
                </div>
                {/* Right Column */}
                <div className="col-span-4 bg-gray-50 p-8">
                     <div className="space-y-8">
                        <div className="mb-8"><Logo /></div>
                        <div>
                            <h3 className="section-title-side">Contacto</h3>
                            <div className="mt-3 space-y-3 text-sm">
                                {data.email && <div className="flex items-center gap-2"><Mail size={14} className="text-primary" /><span>{data.email}</span></div>}
                                {data.phoneNumber && <div className="flex items-center gap-2"><Phone size={14} className="text-primary" /><span>{data.phoneNumber}</span></div>}
                                {data.cidade && <div className="flex items-center gap-2"><MapPin size={14} className="text-primary" /><span>{data.cidade}</span></div>}
                                <div className="flex items-center gap-2"><Linkedin size={14} className="text-primary" /><span>linkedin.com/in/...</span></div>
                            </div>
                        </div>

                        {data.skills && data.skills.length > 0 && (
                            <div>
                                <h3 className="section-title-side">Competências</h3>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {data.skills.map((skill, index) => (
                                       skill.value && <span key={index} className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded">{skill.value}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                            <h3 className="section-title-side">Línguas</h3>
                            <ul className="mt-3 space-y-1 text-base">
                                <li>Português (Nativo)</li>
                                <li>Inglês (Avançado)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
             <style jsx global>{`
                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    line-height: 1.5;
                }
                .section-title-main {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 13pt;
                    font-weight: 700;
                    color: hsl(var(--primary));
                    border-bottom: 2px solid #e5e7eb;
                    padding-bottom: 4px;
                    letter-spacing: 0.025em;
                }
                 .section-title-side {
                    font-family: 'Space Grotesk', sans-serif;
                    font-size: 11pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: hsl(var(--foreground));
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
