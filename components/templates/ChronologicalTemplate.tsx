import React from 'react';
import type { ResumeData } from '../../types';

const ChronologicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
        if (!show) return null;
        return (
            <section className="mb-6">
                <h2 className="text-lg font-semibold uppercase tracking-wider text-gray-500 pb-1 mb-4">{title}</h2>
                {children}
            </section>
        );
    };

    const TimelineItem: React.FC<{ title: string; subtitle: string; date: string; children: React.ReactNode; isLast?: boolean }> = ({ title, subtitle, date, children, isLast = false }) => (
        <div className="flex">
            <div className="flex flex-col items-center mr-4">
                <div>
                    <div className="flex items-center justify-center w-6 h-6 bg-teal-500 rounded-full">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>
                {!isLast && <div className="w-px h-full bg-gray-300"></div>}
            </div>
            <div className="pb-8">
                <p className="mb-1 text-xs text-gray-500">{date}</p>
                <h3 className="font-bold text-base">{title}</h3>
                <p className="text-sm italic text-gray-700 mb-2">{subtitle}</p>
                <div className="text-sm text-gray-700">{children}</div>
            </div>
        </div>
    );


    return (
        <div className="bg-white text-gray-800 p-8 font-sans w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] text-sm">
            <header className="text-left mb-6">
                <h1 className="text-4xl font-bold tracking-tight">{personal.name}</h1>
                <p className="text-xs mt-2 text-gray-600">
                    {personal.phone} <span className="text-gray-300">|</span> {personal.email} <span className="text-gray-300">|</span> {personal.linkedin} {personal.portfolio && <><span className="text-gray-300">|</span> {personal.portfolio}</>}
                </p>
            </header>
            
            <main className="grid grid-cols-3 gap-x-8">
                <div className="col-span-2">
                    <p className="text-sm leading-relaxed mb-6 border-l-4 border-teal-500 pl-4">{summary}</p>
                    <Section title="Experience">
                        {experience.map((exp, index) => (
                            <TimelineItem 
                                key={exp.id} 
                                title={exp.role} 
                                subtitle={exp.company} 
                                date={`${exp.startDate} - ${exp.endDate}`}
                                isLast={index === experience.length - 1}
                            >
                                <ul className="list-disc list-inside text-sm mt-1.5 space-y-1 whitespace-pre-wrap text-gray-700">
                                    {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                                </ul>
                            </TimelineItem>
                        ))}
                    </Section>
                </div>
                <div className="col-span-1">
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => <span key={skill.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">{skill.name}</span>)}
                        </div>
                    </Section>
                    <Section title="Projects">
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-3">
                                <h3 className="font-bold text-base">{proj.name}</h3>
                                {proj.link && <a href={`//${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{proj.link}</a>}
                                <p className="text-sm mt-1 text-gray-700">{proj.description}</p>
                            </div>
                        ))}
                    </Section>
                    <Section title="Education">
                        {education.map(edu => (
                            <div key={edu.id} className="mb-3">
                                <h3 className="font-bold text-base">{edu.degree}</h3>
                                <p className="text-sm italic">{edu.institution}</p>
                                <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </Section>
                     <Section title="Certifications" show={certifications.length > 0}>
                        {certifications.map(cert => (
                            <p key={cert.id} className="text-sm mb-1"><span className="font-bold">{cert.name}</span>, {cert.issuer}</p>
                        ))}
                    </Section>
                </div>
            </main>
        </div>
    );
};
export default ChronologicalTemplate;