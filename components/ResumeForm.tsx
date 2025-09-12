
import React, { useState, useCallback } from 'react';
// FIX: Import AITone as a value, and other types as type-only.
import { AITone } from '../types';
import type { ResumeData, PersonalInfo, WorkExperience, Education, Project, Skill, Certification } from '../types';
import { SparklesIcon, TrashIcon, PlusIcon, ChevronDownIcon } from '../constants';
import * as geminiService from '../services/geminiService';

type OnDataChange = <T extends keyof ResumeData>(section: T, value: ResumeData[T]) => void;

interface ResumeFormProps {
    data: ResumeData;
    onDataChange: OnDataChange;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onDataChange }) => {
    const [openSection, setOpenSection] = useState<string>('personal');

    const handleOpenSection = (section: string) => {
        setOpenSection(openSection === section ? '' : section);
    };

    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onDataChange('personal', { ...data.personal, [e.target.name]: e.target.value });
    };

    const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onDataChange('summary', e.target.value);
    };
    
    // FIX: Replaced generic handler with a more type-safe version to resolve multiple type errors.
    // Generic handler for list items
    const handleListItemChange = <K extends 'experience' | 'education' | 'projects' | 'skills' | 'certifications'>(
        section: K,
        index: number,
        field: keyof ResumeData[K][number],
        value: any
    ) => {
        const list = data[section].map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        onDataChange(section, list as any);
    };

    const addListItem = (section: 'experience' | 'education' | 'projects' | 'skills' | 'certifications') => {
        const newItem = createNewItem(section);
        const list = [...data[section], newItem];
        onDataChange(section, list as any);
    };
    
    const removeListItem = (section: 'experience' | 'education' | 'projects' | 'skills' | 'certifications', index: number) => {
        const list = data[section].filter((_, i) => i !== index);
        onDataChange(section, list as any);
    };

    return (
        <div className="space-y-4 p-4">
            <FormSection title="Personal Info" id="personal" isOpen={openSection === 'personal'} onToggle={handleOpenSection}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Full Name" name="name" value={data.personal.name} onChange={handlePersonalChange} />
                    <Input label="Email" name="email" value={data.personal.email} onChange={handlePersonalChange} type="email" />
                    <Input label="Phone" name="phone" value={data.personal.phone} onChange={handlePersonalChange} />
                    <Input label="LinkedIn" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/..." />
                    <Input label="Portfolio/Website" name="portfolio" value={data.personal.portfolio} onChange={handlePersonalChange} placeholder="yourportfolio.com" />
                </div>
            </FormSection>

            <FormSection title="Summary" id="summary" isOpen={openSection === 'summary'} onToggle={handleOpenSection}>
                <Textarea label="Career Objective / Summary" value={data.summary} onChange={handleSummaryChange} rows={5} />
                <AIGenerateSummary data={data} onDataChange={onDataChange} />
            </FormSection>

            <FormSection title="Work Experience" id="experience" isOpen={openSection === 'experience'} onToggle={handleOpenSection}>
                {data.experience.map((exp, index) => (
                    <div key={exp.id} className="p-4 border border-gray-700 rounded-md mb-4 relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Role / Title" value={exp.role} onChange={e => handleListItemChange('experience', index, 'role', e.target.value)} />
                            <Input label="Company" value={exp.company} onChange={e => handleListItemChange('experience', index, 'company', e.target.value)} />
                            <Input label="Start Date" value={exp.startDate} onChange={e => handleListItemChange('experience', index, 'startDate', e.target.value)} />
                            <Input label="End Date" value={exp.endDate} onChange={e => handleListItemChange('experience', index, 'endDate', e.target.value)} />
                        </div>
                        <Textarea label="Description / Achievements" value={exp.description} onChange={e => handleListItemChange('experience', index, 'description', e.target.value)} rows={6} className="mt-4" />
                        <AIGenerateBulletPoints exp={exp} onDescriptionUpdate={(newDesc) => handleListItemChange('experience', index, 'description', newDesc)} />
                        <button onClick={() => removeListItem('experience', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </div>
                ))}
                <AddItemButton onClick={() => addListItem('experience')} text="Add Experience" />
            </FormSection>
            
            <FormSection title="Education" id="education" isOpen={openSection === 'education'} onToggle={handleOpenSection}>
                {data.education.map((edu, index) => (
                     <div key={edu.id} className="p-4 border border-gray-700 rounded-md mb-4 relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Institution" value={edu.institution} onChange={e => handleListItemChange('education', index, 'institution', e.target.value)} />
                            <Input label="Degree / Major" value={edu.degree} onChange={e => handleListItemChange('education', index, 'degree', e.target.value)} />
                            <Input label="Start Date" value={edu.startDate} onChange={e => handleListItemChange('education', index, 'startDate', e.target.value)} />
                            <Input label="End Date" value={edu.endDate} onChange={e => handleListItemChange('education', index, 'endDate', e.target.value)} />
                            <Input label="GPA" value={edu.gpa} onChange={e => handleListItemChange('education', index, 'gpa', e.target.value)} />
                        </div>
                        <button onClick={() => removeListItem('education', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </div>
                ))}
                <AddItemButton onClick={() => addListItem('education')} text="Add Education" />
            </FormSection>

            <FormSection title="Projects" id="projects" isOpen={openSection === 'projects'} onToggle={handleOpenSection}>
                 {data.projects.map((proj, index) => (
                     <div key={proj.id} className="p-4 border border-gray-700 rounded-md mb-4 relative">
                        <div className="space-y-4">
                            <Input label="Project Name" value={proj.name} onChange={e => handleListItemChange('projects', index, 'name', e.target.value)} />
                            <Input label="Link" value={proj.link} onChange={e => handleListItemChange('projects', index, 'link', e.target.value)} />
                            <Textarea label="Description" value={proj.description} onChange={e => handleListItemChange('projects', index, 'description', e.target.value)} rows={3} />
                        </div>
                        <button onClick={() => removeListItem('projects', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </div>
                 ))}
                 <AddItemButton onClick={() => addListItem('projects')} text="Add Project" />
            </FormSection>

            <FormSection title="Skills" id="skills" isOpen={openSection === 'skills'} onToggle={handleOpenSection}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.skills.map((skill, index) => (
                        <div key={skill.id} className="flex items-center gap-2">
                             <Input label="Skill" value={skill.name} onChange={e => handleListItemChange('skills', index, 'name', e.target.value)} className="flex-grow" />
                            <button onClick={() => removeListItem('skills', index)} className="text-red-500 hover:text-red-400 mt-6"><TrashIcon /></button>
                        </div>
                    ))}
                </div>
                <AddItemButton onClick={() => addListItem('skills')} text="Add Skill" />
            </FormSection>
            
            <FormSection title="Certifications" id="certifications" isOpen={openSection === 'certifications'} onToggle={handleOpenSection}>
                 {data.certifications.map((cert, index) => (
                     <div key={cert.id} className="p-4 border border-gray-700 rounded-md mb-4 relative">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input label="Certification Name" value={cert.name} onChange={e => handleListItemChange('certifications', index, 'name', e.target.value)} />
                            <Input label="Issuer" value={cert.issuer} onChange={e => handleListItemChange('certifications', index, 'issuer', e.target.value)} />
                            <Input label="Date" value={cert.date} onChange={e => handleListItemChange('certifications', index, 'date', e.target.value)} />
                        </div>
                        <button onClick={() => removeListItem('certifications', index)} className="absolute top-2 right-2 text-red-500 hover:text-red-400"><TrashIcon /></button>
                    </div>
                 ))}
                 <AddItemButton onClick={() => addListItem('certifications')} text="Add Certification" />
            </FormSection>
        </div>
    );
};


// Helper components defined outside the main component to avoid re-creation on render
interface FormSectionProps {
    title: string;
    id: string;
    isOpen: boolean;
    onToggle: (id: string) => void;
    children: React.ReactNode;
}
const FormSection: React.FC<FormSectionProps> = ({ title, id, isOpen, onToggle, children }) => (
    <div className="bg-gray-800 rounded-lg shadow-md">
        <button onClick={() => onToggle(id)} className="w-full text-left p-4 flex justify-between items-center bg-gray-700/50 rounded-t-lg hover:bg-gray-700">
            <h2 className="text-lg font-semibold text-teal-400">{title}</h2>
            <ChevronDownIcon className={`${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && <div className="p-4">{children}</div>}
    </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}
const Input: React.FC<InputProps> = ({ label, className, ...props }) => (
    <div className={`w-full ${className}`}>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input {...props} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
    </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}
const Textarea: React.FC<TextareaProps> = ({ label, className, ...props }) => (
    <div className={`w-full ${className}`}>
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-gray-900 border border-gray-600 rounded-md px-3 py-2 text-sm focus:ring-teal-500 focus:border-teal-500" />
    </div>
);

const AddItemButton: React.FC<{ onClick: () => void; text: string }> = ({ onClick, text }) => (
    <button onClick={onClick} className="mt-4 w-full bg-teal-800 hover:bg-teal-700 text-teal-200 font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors">
        <PlusIcon /> {text}
    </button>
);

const AIGenerateSummary: React.FC<{ data: ResumeData; onDataChange: OnDataChange }> = ({ data, onDataChange }) => {
    const [isLoading, setIsLoading] = useState(false);
    const generate = async (tone: AITone) => {
        setIsLoading(true);
        const experienceText = data.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n\n');
        const newSummary = await geminiService.generateSummary(tone, data.summary, experienceText);
        onDataChange('summary', newSummary);
        setIsLoading(false);
    };

    return (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-md">
            <p className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2"><SparklesIcon /> AI Summary Assistant</p>
            {isLoading ? <p className="text-sm text-gray-400">Generating...</p> : (
                <div className="flex flex-wrap gap-2">
                    {(Object.keys(AITone) as Array<keyof typeof AITone>).map(tone => (
                        <button key={tone} onClick={() => generate(AITone[tone])} className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 font-semibold py-1 px-3 rounded-full">{AITone[tone]}</button>
                    ))}
                </div>
            )}
        </div>
    );
};

const AIGenerateBulletPoints: React.FC<{ exp: WorkExperience; onDescriptionUpdate: (newDesc: string) => void }> = ({ exp, onDescriptionUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    
    const generate = async () => {
        setIsLoading(true);
        setSuggestions([]);
        const newBullets = await geminiService.generateBulletPoints(exp.role, exp.description);
        setSuggestions(newBullets);
        setIsLoading(false);
    };

    const addSuggestion = (bullet: string) => {
        const currentDesc = exp.description.trim();
        const newDesc = currentDesc ? `${currentDesc}\n${bullet}` : bullet;
        onDescriptionUpdate(newDesc);
    };
    
    return (
        <div className="mt-4 p-3 bg-gray-900/50 rounded-md">
            <button onClick={generate} disabled={isLoading} className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2 hover:text-yellow-300 disabled:text-gray-500">
                <SparklesIcon /> {isLoading ? 'Generating Achievements...' : 'AI Suggest Bullet Points'}
            </button>
            {suggestions.length > 0 && (
                <div className="space-y-2 mt-2">
                    <p className="text-xs text-gray-400">Click to add a suggestion:</p>
                    {suggestions.map((s, i) => (
                        <button key={i} onClick={() => addSuggestion(s)} className="block w-full text-left text-sm p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const createNewItem = (section: string) => {
    const id = crypto.randomUUID();
    switch (section) {
        case 'experience': return { id, company: '', role: '', startDate: '', endDate: '', description: '' };
        case 'education': return { id, institution: '', degree: '', startDate: '', endDate: '', gpa: '' };
        case 'projects': return { id, name: '', description: '', link: '' };
        case 'skills': return { id, name: '', category: 'Technical' };
        case 'certifications': return { id, name: '', issuer: '', date: '' };
        default: throw new Error("Invalid section");
    }
};

export default ResumeForm;
