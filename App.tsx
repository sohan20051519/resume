import React, { useState, useRef, useCallback } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import type { ResumeData, Template } from './types';
import { INITIAL_RESUME_DATA, TEMPLATES, DownloadIcon, UploadIcon, SparklesIcon } from './constants';
import * as geminiService from './services/geminiService';

declare const jspdf: any;
declare const html2canvas: any;

const App: React.FC = () => {
    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES[0]);
    const [isParsing, setIsParsing] = useState(false);
    const [showUploader, setShowUploader] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const resumePreviewRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDataChange = useCallback(<T extends keyof ResumeData>(section: T, value: ResumeData[T]) => {
        setResumeData(prev => ({
            ...prev,
            [section]: value,
        }));
    }, []);

    const handleDownloadPdf = async () => {
        const element = resumePreviewRef.current;
        if (!element) return;

        const originalTransform = element.style.transform;
        element.style.transform = 'scale(1)';

        const canvas = await html2canvas(element, {
            scale: 2, 
            useCORS: true,
            logging: false,
            windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
        });

        element.style.transform = originalTransform;
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${resumeData.personal.name.replace(' ', '_')}_Resume.pdf`);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleUploadAndParse = async () => {
        if (!selectedFile) {
            alert("Please select a file to parse.");
            return;
        }
        setIsParsing(true);

        const reader = new FileReader();
        reader.onload = async (e) => {
            const dataUrl = e.target?.result as string;
            if (!dataUrl) {
                alert("File is empty or could not be read.");
                setIsParsing(false);
                return;
            }
            try {
                const base64Data = dataUrl.substring(dataUrl.indexOf(',') + 1);
                const mimeType = selectedFile.type;

                const parsedData = await geminiService.parseResume({
                    base64: base64Data,
                    mimeType: mimeType,
                });

                setResumeData(prev => {
                    const newExperience = parsedData.experience?.map(e => ({ ...e, id: crypto.randomUUID() })) || prev.experience;
                    const newEducation = parsedData.education?.map(e => ({ ...e, id: crypto.randomUUID() })) || prev.education;
                    const newProjects = parsedData.projects?.map(p => ({ ...p, id: crypto.randomUUID() })) || prev.projects;
                    const newSkills = parsedData.skills?.map(s => ({ ...s, id: crypto.randomUUID() })) || prev.skills;
                    const newCerts = parsedData.certifications?.map(c => ({...c, id: crypto.randomUUID()})) || prev.certifications;

                    return {
                        ...prev,
                        personal: { ...prev.personal, ...parsedData.personal },
                        summary: parsedData.summary || prev.summary,
                        experience: newExperience,
                        education: newEducation,
                        projects: newProjects,
                        skills: newSkills,
                        certifications: newCerts,
                    }
                });

                alert("Resume parsed successfully! Please review the imported data in the form.");
                setShowUploader(false);
                setSelectedFile(null);

            } catch (error) {
                console.error(error);
                alert("An error occurred while parsing the resume.");
            } finally {
                setIsParsing(false);
            }
        };
        reader.onerror = () => {
            alert("Failed to read the selected file.");
            setIsParsing(false);
        };
        reader.readAsDataURL(selectedFile);
    };
    
    const handleCancelUpload = () => {
        setShowUploader(false);
        setSelectedFile(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
            <header className="bg-gray-800 shadow-lg p-4 flex justify-between items-center sticky top-0 z-20 flex-wrap gap-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-teal-400">AI Resume Architect</h1>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-end">
                    <div className="flex items-center gap-2">
                         <label htmlFor="template-select" className="text-sm font-medium">Template:</label>
                        <select
                            id="template-select"
                            value={selectedTemplate.id}
                            onChange={(e) => setSelectedTemplate(TEMPLATES.find(t => t.id === e.target.value) || TEMPLATES[0])}
                            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-1.5 text-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                            {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                     <button
                        onClick={() => setShowUploader(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors text-sm"
                    >
                        <UploadIcon /> Upload & Parse
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors text-sm"
                    >
                        <DownloadIcon /> Download PDF
                    </button>
                </div>
            </header>

            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
                <div className="overflow-y-auto pr-2 rounded-lg bg-gray-800/50 h-[calc(100vh-100px)]">
                    <ResumeForm data={resumeData} onDataChange={handleDataChange} />
                </div>
                <div className="overflow-y-auto flex justify-start md:justify-center items-start p-2 sm:p-4 bg-gray-800 rounded-lg h-[calc(100vh-100px)]">
                    <div ref={resumePreviewRef} className="transform origin-top scale-[0.45] sm:scale-[0.7] md:scale-[0.9] lg:scale-[0.6] xl:scale-[0.8] 2xl:scale-[0.9]">
                        <ResumePreview data={resumeData} template={selectedTemplate.component} />
                    </div>
                </div>
            </main>
            
            {showUploader && (
                <div className="fixed inset-0 bg-black/60 z-30 flex items-center justify-center p-4">
                    <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-2xl">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><SparklesIcon /> Upload & Parse Resume</h2>
                        <p className="text-sm text-gray-400 mb-4">Upload your resume file (.pdf, .docx, .txt recommended). The AI will extract the information and populate the form.</p>
                        
                        <div className="mt-4 flex justify-center items-center w-full">
                            <label htmlFor="resume-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-900 hover:bg-gray-800">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <UploadIcon />
                                    <p className="my-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">PDF, DOCX, TXT files recommended</p>
                                </div>
                                <input id="resume-upload" type="file" className="hidden" accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} ref={fileInputRef} />
                            </label>
                        </div>
                        {selectedFile && <p className="mt-4 text-center text-sm text-gray-300">File selected: <span className="font-medium">{selectedFile.name}</span></p>}
                        
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={handleCancelUpload}
                                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md"
                                disabled={isParsing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadAndParse}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md flex items-center disabled:bg-gray-500 disabled:cursor-not-allowed"
                                disabled={!selectedFile || isParsing}
                            >
                                {isParsing ? 'Parsing...' : 'Parse with AI'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;