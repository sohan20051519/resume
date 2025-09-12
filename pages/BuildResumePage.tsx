import React, { useState, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import type { ResumeData, Template } from '../types';
import { INITIAL_RESUME_DATA, TEMPLATES, DownloadIcon, UploadIcon, SparklesIcon } from '../constants';
import * as geminiService from '../services/geminiService';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Select, MenuItem, FormControl, InputLabel, Modal, Paper } from '@mui/material';

const BuildResumePage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const templateId = searchParams.get('template');

    const [resumeData, setResumeData] = useState<ResumeData>(INITIAL_RESUME_DATA);
    const [selectedTemplate, setSelectedTemplate] = useState<Template>(
        TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0]
    );
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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                            AI Resume Architect
                        </Link>
                    </Typography>
                    <Button color="inherit" component={Link} to="/templates">Templates</Button>
                    <Button color="inherit" component={Link} to="/build">Build Your Resume</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="template-select-label">Template</InputLabel>
                    <Select
                        labelId="template-select-label"
                        id="template-select"
                        value={selectedTemplate.id}
                        label="Template"
                        onChange={(e) => setSelectedTemplate(TEMPLATES.find(t => t.id === e.target.value) || TEMPLATES[0])}
                    >
                        {TEMPLATES.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={() => setShowUploader(true)} startIcon={<UploadIcon />}>
                    Upload & Parse
                </Button>
            </Box>
            <Grid container sx={{ flexGrow: 1, overflow: 'hidden' }}>
                <Grid item xs={12} md={6} sx={{ overflowY: 'auto', p: 2 }}>
                    <ResumeForm data={resumeData} onDataChange={handleDataChange} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ overflowY: 'auto', p: 2, bgcolor: 'grey.200' }}>
                    <Box ref={resumePreviewRef} sx={{ transform: 'scale(0.8)', transformOrigin: 'top' }}>
                        <ResumePreview data={resumeData} template={selectedTemplate.component} />
                    </Box>
                </Grid>
            </Grid>
            <Modal open={showUploader} onClose={handleCancelUpload}>
                <Paper sx={{ p: 4, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400 }}>
                    <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                        <SparklesIcon /> Upload & Parse Resume
                    </Typography>
                    <Typography sx={{ mb: 2 }}>
                        Upload your resume file (.pdf, .docx, .txt recommended). The AI will extract the information and populate the form.
                    </Typography>
                    <Button variant="contained" component="label">
                        Upload File
                        <input type="file" hidden onChange={handleFileChange} ref={fileInputRef} accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                    </Button>
                    {selectedFile && <Typography sx={{ mt: 2 }}>File selected: {selectedFile.name}</Typography>}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button onClick={handleCancelUpload} disabled={isParsing}>Cancel</Button>
                        <Button onClick={handleUploadAndParse} variant="contained" disabled={!selectedFile || isParsing}>
                            {isParsing ? 'Parsing...' : 'Parse with AI'}
                        </Button>
                    </Box>
                </Paper>
            </Modal>
        </Box>
    );
};

export default BuildResumePage;
