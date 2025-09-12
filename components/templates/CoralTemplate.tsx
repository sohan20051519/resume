import React from 'react';
import type { ResumeData } from '../../types';

const CoralTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
        if (!show) return null;
        return (
            <section className="mb-5">
                <h2 className="text-lg font-bold uppercase tracking-wider text-orange-700 pb-1 mb-3">{title}</h2>
                {children}
            </section>
        );
    };

    return (
        <div className="bg-white text-gray-800 p-8 font-sans w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] text-sm">
            <header className="text-center mb-8 pb-4 border-b-2 border-orange-200">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">{personal.name}</h1>
                <p className="text-xs mt-2 text-gray-600">
                    {personal.phone && `${personal.phone}  •  `}
                    {personal.email && `${personal.email}`}
                    {personal.linkedin && `  •  ${personal.linkedin}`}
                    {personal.portfolio && `  •  ${personal.portfolio}`}
                </p>
            </header>
            
            <main>
                <Section title="Summary" show={!!summary}>
                    <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
                </Section>

                <Section title="Experience" show={experience.length > 0}>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base text-gray-900">{exp.role}</h3>
                                <p className="text-xs text-gray-600 font-medium">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm font-semibold text-orange-800">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm mt-1.5 space-y-1 whitespace-pre-wrap text-gray-700">
                                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </Section>
                
                 <div className="grid grid-cols-2 gap-x-8">
                     <Section title="Education" show={education.length > 0}>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-2">
                                <h3 className="font-bold text-base">{edu.institution}</h3>
                                <p className="text-sm italic">{edu.degree}</p>
                                <p className="text-xs text-gray-600">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </Section>

                    <Section title="Skills" show={skills.length > 0}>
                         <ul className="list-disc list-inside text-sm mt-1.5 space-y-1 text-gray-700">
                             {skills.map(skill => <li key={skill.id}>{skill.name}</li>)}
                         </ul>
                    </Section>
                </div>


                <Section title="Projects" show={projects.length > 0}>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                             <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{proj.name}</h3>
                                {proj.link && <a href={`//${proj.link}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">{proj.link}</a>}
                            </div>
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
export default CoralTemplate;