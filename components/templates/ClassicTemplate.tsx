

import React from 'react';
import type { ResumeData } from '../../types';
import { PhoneIcon, EmailIcon, LinkedInIcon, WebsiteIcon } from '../../constants';

const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
    const { personal, summary, experience, education, skills, projects, certifications } = data;

    return (
        <div className="bg-white text-gray-800 p-8 font-serif w-[210mm] h-[297mm] min-w-[210mm] min-h-[297mm]">
            <header className="text-center mb-8 border-b-2 border-gray-400 pb-4">
                <h1 className="text-4xl font-bold tracking-wider">{personal.name}</h1>
                <div className="flex justify-center items-center flex-wrap gap-x-4 gap-y-1 text-sm mt-2">
                    {personal.phone && <span className="flex items-center gap-1.5"><PhoneIcon className="w-4 h-4" />{personal.phone}</span>}
                    {personal.email && <span className="flex items-center gap-1.5"><EmailIcon className="w-4 h-4" />{personal.email}</span>}
                    {personal.linkedin && <span className="flex items-center gap-1.5"><LinkedInIcon className="w-4 h-4" />{personal.linkedin}</span>}
                    {personal.portfolio && <span className="flex items-center gap-1.5"><WebsiteIcon className="w-4 h-4" />{personal.portfolio}</span>}
                </div>
            </header>
            <main>
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">SUMMARY</h2>
                    <p className="text-sm">{summary}</p>
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">EXPERIENCE</h2>
                    {experience.map(exp => (
                        <div key={exp.id} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-md">{exp.role}</h3>
                                <p className="text-sm font-light">{exp.startDate} - {exp.endDate}</p>
                            </div>
                            <p className="text-sm italic">{exp.company}</p>
                            <ul className="list-disc list-inside text-sm mt-1 whitespace-pre-wrap">
                                {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.replace(/^- /, '')}</li>)}
                            </ul>
                        </div>
                    ))}
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">EDUCATION</h2>
                    {education.map(edu => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-md">{edu.institution}</h3>
                                <p className="text-sm font-light">{edu.startDate} - {edu.endDate}</p>
                            </div>
                            <p className="text-sm italic">{edu.degree}{edu.gpa && `, GPA: ${edu.gpa}`}</p>
                        </div>
                    ))}
                </section>
                <section className="mb-6">
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">PROJECTS</h2>
                    {projects.map(proj => (
                        <div key={proj.id} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-md">{proj.name}</h3>
                                {proj.link && <p className="text-sm font-light">{proj.link}</p>}
                            </div>
                            <p className="text-sm mt-1">{proj.description}</p>
                        </div>
                    ))}
                </section>
                <section>
                    <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">SKILLS</h2>
                    <p className="text-sm">{skills.map(skill => skill.name).join(' | ')}</p>
                </section>
                {certifications.length > 0 && (
                    <section className="mt-6">
                        <h2 className="text-xl font-bold border-b border-gray-300 pb-1 mb-2">CERTIFICATIONS</h2>
                        {certifications.map(cert => (
                            <div key={cert.id} className="mb-2">
                                <p className="text-sm"><span className="font-bold">{cert.name}</span> - {cert.issuer} ({cert.date})</p>
                            </div>
                        ))}
                    </section>
                )}
            </main>
        </div>
    );
};
export default ClassicTemplate;