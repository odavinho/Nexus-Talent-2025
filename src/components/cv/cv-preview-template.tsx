'use client';

import { Mail, Phone, MapPin, Briefcase, GraduationCap, Award } from "lucide-react";
import { Badge } from "../ui/badge";

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
        <div className="a4-page p-8 text-gray-800 font-sans text-sm">
            {/* Header */}
            <header className="text-center mb-8 border-b-2 border-gray-300 pb-4">
                <h1 className="text-4xl font-bold text-gray-800">{data.firstName} {data.lastName}</h1>
                <h2 className="text-xl font-light text-gray-600 mt-1">{data.academicTitle}</h2>
                <div className="flex justify-center gap-6 mt-4 text-xs text-gray-500">
                    {data.email && <div className="flex items-center gap-2"><Mail size={12} /><span>{data.email}</span></div>}
                    {data.phoneNumber && <div className="flex items-center gap-2"><Phone size={12} /><span>{data.phoneNumber}</span></div>}
                    {data.cidade && <div className="flex items-center gap-2"><MapPin size={12} /><span>{data.cidade}</span></div>}
                </div>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                    {/* Summary */}
                    {data.summary && (
                        <section>
                            <h3 className="section-title flex items-center gap-3 mb-3"><Briefcase size={18} className="text-primary"/>Resumo Profissional</h3>
                            <p className="text-gray-600 leading-relaxed text-sm">{data.summary}</p>
                        </section>
                    )}

                    {/* Work Experience */}
                    {data.workExperience && data.workExperience.length > 0 && (
                        <section>
                            <h3 className="section-title flex items-center gap-3 mb-4"><Briefcase size={18} className="text-primary"/>Experiência Profissional</h3>
                            <div className="space-y-6">
                                {data.workExperience.map((exp, index) => (
                                    <div key={index} className="pl-4 border-l-2 border-gray-200">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-semibold text-base">{exp.role}</h4>
                                            <p className="text-xs text-gray-500 font-medium">{exp.period}</p>
                                        </div>
                                        <p className="text-sm font-medium text-primary">{exp.company}</p>
                                        {exp.description && <p className="mt-2 text-sm text-gray-600">{exp.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <div className="col-span-1 space-y-8">
                    {/* Education */}
                     {data.academicHistory && data.academicHistory.length > 0 && (
                        <section>
                            <h3 className="section-title flex items-center gap-3 mb-3"><GraduationCap size={18} className="text-primary"/>Educação</h3>
                            <div className="space-y-4">
                                {data.academicHistory.map((edu, index) => (
                                    <div key={index}>
                                        <h4 className="font-semibold">{edu.degree}</h4>
                                        <p className="text-sm text-gray-600">{edu.institution}</p>
                                        <p className="text-xs text-gray-500">{edu.year}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Skills */}
                    {data.skills && data.skills.length > 0 && (
                        <section>
                            <h3 className="section-title flex items-center gap-3 mb-3"><Award size={18} className="text-primary"/>Competências</h3>
                             <div className="flex flex-wrap gap-2">
                                {data.skills.map((skill, index) => (
                                   skill.value && <Badge key={index} variant="secondary">{skill.value}</Badge>
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
                }
                .section-title {
                    font-size: 1.125rem; /* 18px */
                    font-weight: 700;
                    color: #374151; /* gray-700 */
                    border-bottom: 2px solid #e5e7eb; /* gray-200 */
                    padding-bottom: 0.5rem;
                }
            `}</style>
        </div>
    );
};
