
import React from 'react';
import type { ResumeData } from '../../types';

const CompactTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className="bg-white text-gray-900 p-6 font-sans w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm] text-xs">
            <header className="text-center mb-4">
                <h1 className="text-2xl font-bold">{personal.name}</h1>
                <p className="text-xs">
                    {personal.phone && `${personal.phone} | `}{personal.email && `${personal.email}`}{personal.linkedin && ` | ${personal.linkedin}`}{personal.portfolio && ` | ${personal.portfolio}`}
                </p>
            </header>
            
            <p className="text-center text-xs mb-4">{summary}</p>

            <div className="grid grid-cols-1 gap-x-6">
                <section className="mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider bg-gray-200 px-2 py-1 mb-2">Experience</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-2.5">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold">{exp.role} <span className="font-normal italic">@ {exp.company}</span></h3>
                                <p className="font-light">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <ul className="list-disc list-inside mt-1 text-gray-700 whitespace-pre-wrap">
                                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>

                <div className="grid grid-cols-2 gap-x-6">
                    <section className="mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider bg-gray-200 px-2 py-1 mb-2">Education</h2>
                        {education.map(edu => (
                            <div key={edu.id} className="mb-1.5">
                                <h3 className="font-bold">{edu.institution}</h3>
                                <p className="italic">{edu.degree}</p>
                                <p className="text-gray-600">{edu.startDate} - {edu.endDate}</p>
                            </div>
                        ))}
                    </section>

                    <section className="mb-3">
                        <h2 className="text-sm font-bold uppercase tracking-wider bg-gray-200 px-2 py-1 mb-2">Projects</h2>
                        {projects.map(proj => (
                            <div key={proj.id} className="mb-1.5">
                                <h3 className="font-bold">{proj.name}</h3>
                                <p className="text-gray-700">{proj.description}</p>
                                <p className="text-blue-600">{proj.link}</p>
                            </div>
                        ))}
                    </section>
                </div>

                <section className="mb-3">
                    <h2 className="text-sm font-bold uppercase tracking-wider bg-gray-200 px-2 py-1 mb-2">Skills</h2>
                    <p>{skills.map(s => s.name).join(' • ')}</p>
                </section>

                {certifications.length > 0 && (
                    <section>
                        <h2 className="text-sm font-bold uppercase tracking-wider bg-gray-200 px-2 py-1 mb-2">Certifications</h2>
                        {certifications.map(cert => (
                            <p key={cert.id} className="mb-1"><span className="font-bold">{cert.name}</span>, {cert.issuer} ({cert.date})</p>
                        ))}
                    </section>
                )}
            </div>
        </div>
    );
};

export default CompactTemplate;
