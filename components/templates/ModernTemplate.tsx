

import React from 'react';
import type { ResumeData } from '../../types';
import { PhoneIcon, EmailIcon, LinkedInIcon, WebsiteIcon } from '../../constants';

const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className="bg-white text-gray-800 font-sans w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] flex">
            <aside className="w-1/3 bg-gray-800 text-white p-6 flex flex-col">
                <header className="text-center mb-10">
                    <h1 className="text-3xl font-bold tracking-tight text-white">{personal.name}</h1>
                </header>
                <section className="mb-6">
                    <h2 className="text-lg font-semibold uppercase tracking-wider text-teal-400 mb-2">Contact</h2>
                    <div className="text-sm space-y-2">
                        {personal.phone && <p className="flex items-center gap-2"><PhoneIcon className="w-4 h-4 flex-shrink-0" /> <span className="break-all">{personal.phone}</span></p>}
                        {personal.email && <p className="flex items-center gap-2"><EmailIcon className="w-4 h-4 flex-shrink-0" /> <span className="break-all">{personal.email}</span></p>}
                        {personal.linkedin && <p className="flex items-center gap-2"><LinkedInIcon className="w-4 h-4 flex-shrink-0" /> <span className="break-all">{personal.linkedin}</span></p>}
                        {personal.portfolio && <p className="flex items-center gap-2"><WebsiteIcon className="w-4 h-4 flex-shrink-0" /> <span className="break-all">{personal.portfolio}</span></p>}
                    </div>
                </section>
                <section className="mb-6">
                    <h2 className="text-lg font-semibold uppercase tracking-wider text-teal-400 mb-2">Skills</h2>
                    <div className="text-sm space-y-1">
                        {skills.map(skill => (
                            <p key={skill.id}>{skill.name}</p>
                        ))}
                    </div>
                </section>
                 <section>
                    <h2 className="text-lg font-semibold uppercase tracking-wider text-teal-400 mb-2">Education</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-3 text-sm">
                            <h3 className="font-bold">{edu.degree}</h3>
                            <p className="italic">{edu.institution}</p>
                            <p className="text-xs">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </section>
            </aside>
            <main className="w-2/3 p-8">
                 <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-teal-400 pb-1 mb-3">Summary</h2>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-teal-400 pb-1 mb-3">Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-lg">{exp.role}</h3>
                                <p className="text-sm text-gray-600">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-md italic text-gray-700">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm mt-2 space-y-1 whitespace-pre-wrap">
                                 {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                <section className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-teal-400 pb-1 mb-3">Projects</h2>
                     {projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                            <h3 className="font-bold text-lg">{proj.name} <span className="text-sm font-light text-gray-600">| {proj.link}</span></h3>
                            <p className="text-sm mt-1">{proj.description}</p>
                        </div>
                    ))}
                </section>
                 {certifications.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-teal-400 pb-1 mb-3">Certifications</h2>
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-2">
                                <p className="text-sm"><span className="font-bold">{cert.name}</span>, {cert.issuer} ({cert.date})</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};

export default ModernTemplate;