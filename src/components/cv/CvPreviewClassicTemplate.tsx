'use client';

import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
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

export const CvPreviewClassicTemplate = ({ data }: { data: CvData }) => {
    return (
        <div className="a4-page bg-white text-gray-800 font-serif p-6">
             <header className="text-center border-b-2 border-gray-800 pb-4 mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold tracking-wider uppercase">
                        {data.firstName} {data.lastName}
                    </h1>
                    <h2 className="text-lg font-light tracking-widest text-gray-600 mt-2">
                        {data.academicTitle}
                    </h2>
                </div>
                <div className="text-right">
                    <Logo />
                </div>
            </header>
            <div className="text-center mb-8">
                <div className="mt-4 flex justify-center items-center gap-x-6 gap-y-2 text-sm flex-wrap">
                    {data.email && <div className="flex items-center gap-2"><Mail size={12} /><span>{data.email}</span></div>}
                    {data.phoneNumber && <div className="flex items-center gap-2"><Phone size={12} /><span>{data.phoneNumber}</span></div>}
                    {data.cidade && <div className="flex items-center gap-2"><MapPin size={12} /><span>{data.cidade}</span></div>}
                </div>
            </div>
            
            <div className="space-y-8">
                {data.summary && (
                    <section>
                        <h3 className="section-title-classic">Resumo</h3>
                        <p className="mt-3 text-base text-gray-700 text-justify">{data.summary}</p>
                    </section>
                )}

                {data.workExperience && data.workExperience.length > 0 && (
                    <section>
                        <h3 className="section-title-classic">Experiência Profissional</h3>
                        <div className="mt-4 space-y-5">
                            {data.workExperience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="text-lg font-bold text-gray-900">{exp.role}</h4>
                                        <p className="text-base font-medium text-gray-600">{exp.period}</p>
                                    </div>
                                    <p className="text-base italic text-gray-700">{exp.company}</p>
                                    {exp.description && <p className="mt-2 text-base text-gray-600 text-justify">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                
                {data.academicHistory && data.academicHistory.length > 0 && (
                    <section>
                        <h3 className="section-title-classic">Formação Académica</h3>
                        <div className="mt-4 space-y-4">
                            {data.academicHistory.map((edu, index) => (
                                <div key={index}>
                                     <div className="flex justify-between items-baseline">
                                        <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                                        <p className="text-base font-medium text-gray-600">{edu.year}</p>
                                    </div>
                                    <p className="text-base italic text-gray-700">{edu.institution}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {data.skills && data.skills.length > 0 && (
                    <section>
                        <h3 className="section-title-classic">Competências</h3>
                        <p className="mt-3 text-base text-gray-700 text-justify">
                            {data.skills.map(s => s.value).filter(Boolean).join(' • ')}
                        </p>
                    </section>
                )}
            </div>
            
            <style jsx global>{`
                .a4-page {
                    width: 210mm;
                    min-height: 297mm;
                    font-family: 'Times New Roman', serif;
                    line-height: 1.5;
                }
                .section-title-classic {
                    font-size: 13pt;
                    font-weight: 700;
                    text-transform: uppercase;
                    color: hsl(var(--foreground));
                    letter-spacing: 0.15em;
                    text-align: center;
                    border-bottom: 1px solid #ccc;
                    border-top: 1px solid #ccc;
                    padding: 4px 0;
                }
                .text-4xl { font-size: 28pt !important; }
                .text-lg { font-size: 13pt !important; }
                .text-base { font-size: 11pt !important; }
                .text-sm { font-size: 11pt !important; }
            `}</style>
        </div>
    );
};
