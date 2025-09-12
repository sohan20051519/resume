import React from 'react';
import type { ResumeData } from '../../types';

const OnyxTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean; className?: string }> = ({ title, children, show = true, className = '' }) => {
        if (!show) return null;
        return (
            <section className={`mb-5 ${className}`}>
                <h2 className="text-xl font-bold uppercase tracking-wider text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
                {children}
            </section>
        );
    };

    const SidebarSection: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
        if (!show) return null;
        return (
            <section className="mb-6">
                <h2 className="text-lg font-semibold uppercase tracking-wider text-gray-400 mb-2">{title}</h2>
                <div className="text-sm space-y-1 text-gray-200">
                    {children}
                </div>
            </section>
        );
    };

    return (
        <div className="bg-white text-gray-800 font-sans w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] flex text-sm">
            <aside className="w-[80mm] bg-gray-900 text-white p-6 flex flex-col">
                <header className="text-left mb-10">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">{personal.name.split(' ')[0]}</h1>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-400">{personal.name.split(' ').slice(1).join(' ')}</h1>
                </header>
                
                <SidebarSection title="Contact">
                    <p className="break-words">{personal.phone}</p>
                    <p className="break-words">{personal.email}</p>
                    <p className="break-words">{personal.linkedin}</p>
                    <p className="break-words">{personal.portfolio}</p>
                </SidebarSection>
                
                <SidebarSection title="Skills">
                    {skills.map(skill => (
                        <p key={skill.id} className="bg-gray-700 rounded-sm px-2 py-0.5 mb-1.5 inline-block mr-1.5">{skill.name}</p>
                    ))}
                </SidebarSection>

                <SidebarSection title="Education">
                    {education.map(edu => (
                        <div key={edu.id} className="mb-3 text-sm">
                            <h3 className="font-bold">{edu.degree}</h3>
                            <p className="italic text-gray-300">{edu.institution}</p>
                            <p className="text-xs text-gray-400">{edu.startDate} - {edu.endDate}</p>
                        </div>
                    ))}
                </SidebarSection>
            </aside>
            <main className="w-[130mm] p-8">
                <Section title="Summary" show={!!summary}>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </Section>
                <Section title="Experience" show={experience.length > 0}>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{exp.role}</h3>
                                <p className="text-xs text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm mt-2 space-y-1 whitespace-pre-wrap text-gray-700">
                                 {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
                <Section title="Projects" show={projects.length > 0}>
                     {projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                            <h3 className="font-bold text-base">{proj.name} <span className="text-xs font-light text-blue-600 hover:underline">| {proj.link}</span></h3>
                            <p className="text-sm mt-1 text-gray-700">{proj.description}</p>
                        </div>
                    ))}
                </Section>
                 <Section title="Certifications" show={certifications.length > 0}>
                    {certifications.map(cert => (
                        <div key={cert.id} className="mb-2">
                            <p className="text-sm"><span className="font-bold">{cert.name}</span>, {cert.issuer} ({cert.date})</p>
                        </div>
                    ))}
                </Section>
            </main>
        </div>
    );
};

export default OnyxTemplate;