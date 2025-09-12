import React from 'react';
import type { ResumeData } from '../../types';

const Section: React.FC<{ title: string; children: React.ReactNode; show?: boolean }> = ({ title, children, show = true }) => {
    if (!show) return null;
    return (
        <section className="mb-4">
            <h2 className="text-md font-bold text-teal-700 uppercase tracking-wider pb-1 mb-2">{title}</h2>
            {children}
        </section>
    );
};


const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;
    const technicalSkills = skills.filter(s => s.category === 'Technical');
    const softSkills = skills.filter(s => s.category === 'Soft');

    return (
        <div className="bg-white text-gray-800 p-8 font-sans w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] text-sm">
            <header className="mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight">{personal.name}</h1>
                <div className="flex justify-between items-center text-xs mt-2 text-gray-600">
                     <p>
                        {personal.phone && `${personal.phone} | `}
                        {personal.email && `${personal.email}`}
                    </p>
                    <p>
                        {personal.linkedin && `${personal.linkedin}`}
                        {personal.portfolio && ` | ${personal.portfolio}`}
                    </p>
                </div>
            </header>
            
            <main>
                <Section title="Summary" show={!!summary}>
                    <p className="text-sm leading-normal">{summary}</p>
                </Section>
                
                <Section title="Technical Skills" show={technicalSkills.length > 0}>
                    <p className="text-sm leading-relaxed">{technicalSkills.map(s => s.name).join(' • ')}</p>
                </Section>

                <Section title="Experience" show={experience.length > 0}>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{exp.role}</h3>
                                <p className="text-xs text-gray-500 font-medium">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm font-semibold text-teal-800">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm mt-1.5 space-y-1 whitespace-pre-wrap text-gray-700">
                                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                
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
                </section>
                
                <Section title="Education" show={education.length > 0}>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-base">{edu.degree}</h3>
                                <p className="text-xs text-gray-500">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="text-sm italic">{edu.institution}</p>
                        </div>
                    ))}
                </section>
                
                 {certifications.length > 0 && (
                    <Section title="Certifications">
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-1">
                                 <p className="text-sm"><span className="font-bold">{cert.name}</span>, {cert.issuer} ({cert.date})</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};
export default TechnicalTemplate;