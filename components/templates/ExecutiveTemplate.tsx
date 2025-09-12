import React from 'react';
import type { ResumeData } from '../../types';

const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
        <section className="mb-5">
            <h2 className="text-sm font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
            {children}
        </section>
    );
};

const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className="bg-white text-gray-800 p-8 font-serif w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] text-sm">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-wider">{personal.name}</h1>
                <p className="text-xs mt-2 text-gray-600">
                    {personal.phone && `${personal.phone} • `}
                    {personal.email && `${personal.email}`}
                    {personal.linkedin && ` • ${personal.linkedin}`}
                    {personal.portfolio && ` • ${personal.portfolio}`}
                </p>
            </header>
            
            <main>
                <Section title="Summary" show={!!summary}>
                    <p className="text-sm leading-relaxed">{summary}</p>
                </Section>

                <Section title="Professional Experience" show={experience.length > 0}>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{exp.role}</h3>
                                <p className="text-xs text-gray-600">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm italic text-gray-700">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm mt-1 space-y-1 whitespace-pre-wrap text-gray-700">
                                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>

                <Section title="Education" show={education.length > 0}>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{edu.institution}</h3>
                                <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="text-sm italic">{edu.degree}{edu.gpa && `, GPA: ${edu.gpa}`}</p>
                        </div>
                    ))}
                </Section>

                <Section title="Projects" show={projects.length > 0}>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{proj.name}</h3>
                                {proj.link && <p className="text-xs text-gray-600">{proj.link}</p>}
                            </div>
                            <p className="text-sm mt-1 text-gray-700">{proj.description}</p>
                        </div>
                    ))}
                </section>
                
                <Section title="Skills" show={skills.length > 0}>
                    <p className="text-sm text-gray-700">{skills.map(skill => skill.name).join(' | ')}</p>
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
export default ExecutiveTemplate;