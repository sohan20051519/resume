
import React, { useState, useRef, useCallback } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import type { ResumeData, Template } from './types';
import { parseResume } from './services/geminiService';
// FIX: The `useReactToPrint` hook is a named export, not a default export.
import { useReactToPrint } from 'react-to-print';

// Templates
import ClassicTemplate from './components/templates/ClassicTemplate';
import ModernTemplate from './components/templates/ModernTemplate';
import CompactTemplate from './components/templates/CompactTemplate';
import ExecutiveTemplate from './components/templates/ExecutiveTemplate';
import TechnicalTemplate from './components/templates/TechnicalTemplate';
import OnyxTemplate from './components/templates/OnyxTemplate';
import CoralTemplate from './components/templates/CoralTemplate';
import ChronologicalTemplate from './components/templates/ChronologicalTemplate';

const templates: Template[] = [
    { id: 'classic', name: 'Classic', component: ClassicTemplate },
    { id: 'modern', name: 'Modern', component: ModernTemplate },
    { id: 'onyx', name: 'Onyx', component: OnyxTemplate },
    { id: 'technical', name: 'Technical', component: TechnicalTemplate },
    { id: 'executive', name: 'Executive', component: ExecutiveTemplate },
    { id: 'coral', name: 'Coral', component: CoralTemplate },
    { id: 'chronological', name: 'Chronological', component: ChronologicalTemplate },
    { id: 'compact', name: 'Compact', component: CompactTemplate },
];

const initialData: ResumeData = {
  personal: { name: 'Your Name', email: 'your.email@example.com', phone: '123-456-7890', linkedin: 'linkedin.com/in/yourprofile', portfolio: 'yourportfolio.com' },
  summary: 'A brief professional summary about your skills, experience, and career goals. This section should be a concise pitch to the recruiter.',
  education: [
    { id: crypto.randomUUID(), institution: 'University of Example', degree: 'B.S. in Computer Science', startDate: 'Aug 2018', endDate: 'May 2022', gpa: '3.8' }
  ],
  experience: [
    { id: crypto.randomUUID(), company: 'Tech Solutions Inc.', role: 'Software Engineer', startDate: 'Jun 2022', endDate: 'Present', description: '- Developed and maintained web applications using React and Node.js.\n- Collaborated with cross-functional teams to deliver high-quality software.' }
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'React', category: 'Technical' },
    { id: crypto.randomUUID(), name: 'TypeScript', category: 'Technical' },
    { id: crypto.randomUUID(), name: 'Teamwork', category: 'Soft' },
  ],
  projects: [
    { id: crypto.randomUUID(), name: 'Personal Portfolio Website', description: 'A responsive website to showcase my projects and skills.', link: 'yourportfolio.com' }
  ],
  certifications: [
    { id: crypto.randomUUID(), name: 'Certified Kubernetes Application Developer', issuer: 'The Linux Foundation', date: '2023' }
  ],
};


const App: React.FC = () => {
    const [data, setData] = useState<ResumeData>(initialData);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePrint = useReactToPrint({
        documentTitle: `${data.personal.name || 'Resume'}-resume`,
    });

    const handleDataChange = useCallback(<T extends keyof ResumeData>(section: T, value: ResumeData[T]) => {
        setData(prevData => ({
            ...prevData,
            [section]: value
        }));
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                if (base64) {
                    const parsedData = await parseResume({ base64, mimeType: file.type });
                    const mergedData: ResumeData = {
                        personal: { ...initialData.personal, ...parsedData.personal },
                        summary: parsedData.summary || initialData.summary,
                        experience: parsedData.experience?.map(item => ({ ...item, id: crypto.randomUUID() })) || initialData.experience,
                        education: parsedData.education?.map(item => ({ ...item, id: crypto.randomUUID() })) || initialData.education,
                        skills: parsedData.skills?.map(item => ({ ...item, id: crypto.randomUUID(), category: item.category || 'Technical' })) || initialData.skills,
                        projects: parsedData.projects?.map(item => ({ ...item, id: crypto.randomUUID() })) || initialData.projects,
                        certifications: parsedData.certifications?.map(item => ({ ...item, id: crypto.randomUUID() })) || initialData.certifications,
                    };
                    setData(mergedData);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError("Failed to parse resume. Please try again or enter details manually.");
            console.error(err);
        } finally {
            setIsLoading(false);
            if(event.target) event.target.value = '';
        }
    };

    const handleDownloadJson = () => {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume-data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-onBackground font-sans">
            <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-outline/20 shadow-sm">
                <div className="max-w-screen-2xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-primary">AI Resume Builder</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="bg-surfaceVariant text-onSurfaceVariant px-4 py-2 rounded-lg font-semibold shadow-1 hover:shadow-2 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Parsing...' : 'Upload Resume'}
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt" />
                        <button onClick={handleDownloadJson} className="bg-surfaceVariant text-onSurfaceVariant px-4 py-2 rounded-lg font-semibold shadow-1 hover:shadow-2 transition-shadow">Download JSON</button>
                    </div>
                </div>
            </header>
            <main className="flex-grow grid grid-cols-1 xl:grid-cols-2 gap-8 p-4 md:p-8 max-w-screen-2xl mx-auto">
                <div className="xl:overflow-y-auto xl:h-[calc(100vh-120px)] pr-4">
                    <ResumeForm data={data} onDataChange={handleDataChange} />
                </div>
                <div className="xl:overflow-y-auto xl:h-[calc(100vh-120px)]">
                    <div className="bg-background/80 backdrop-blur-sm sticky top-[80px] z-10 p-4 rounded-2xl shadow-neumorphic mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <label htmlFor="template-select" className="text-sm font-medium text-onSurfaceVariant">Template:</label>
                            <select
                                id="template-select"
                                value={selectedTemplate.id}
                                onChange={(e) => setSelectedTemplate(templates.find(t => t.id === e.target.value) || templates[0])}
                                className="bg-background border-transparent rounded-lg py-1 px-2 text-sm text-onBackground shadow-neumorphic-inset focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            >
                                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        {/* FIX: The `content` property was removed from `useReactToPrint` config to avoid a TS error. Instead, the content is now passed directly to the `handlePrint` function call. */}
                        <button onClick={() => handlePrint(undefined, () => componentRef.current)} className="bg-primary text-onPrimary px-4 py-2 rounded-lg font-semibold shadow-1 hover:shadow-2 transition-shadow">Print / Save PDF</button>
                    </div>
                    {error && <div className="p-4 mb-4 text-sm text-onPrimary bg-error rounded-lg" role="alert">{error}</div>}
                    <div ref={componentRef} className="transform scale-[0.9] origin-top">
                      <ResumePreview data={data} template={selectedTemplate.component} />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;