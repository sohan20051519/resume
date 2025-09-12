import React, { useState, useCallback } from 'react';
import { AITone } from '../types';
import type { ResumeData, WorkExperience } from '../types';
import { SparklesIcon, TrashIcon, PlusIcon } from '../constants';
import * as geminiService from '../services/geminiService';
import {
    TextField,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Grid,
    IconButton,
    Box,
    Chip,
    CircularProgress,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
        <Box sx={{ p: 2, '.MuiAccordion-root': { mb: 2 } }}>
            <Accordion expanded={openSection === 'personal'} onChange={() => handleOpenSection('personal')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Personal Info</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Full Name" name="name" value={data.personal.name} onChange={handlePersonalChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Email" name="email" value={data.personal.email} onChange={handlePersonalChange} type="email" fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="Phone" name="phone" value={data.personal.phone} onChange={handlePersonalChange} fullWidth />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField label="LinkedIn" name="linkedin" value={data.personal.linkedin} onChange={handlePersonalChange} placeholder="linkedin.com/in/..." fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Portfolio/Website" name="portfolio" value={data.personal.portfolio} onChange={handlePersonalChange} placeholder="yourportfolio.com" fullWidth />
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={openSection === 'summary'} onChange={() => handleOpenSection('summary')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Summary</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField label="Career Objective / Summary" value={data.summary} onChange={handleSummaryChange} multiline rows={5} fullWidth />
                    <AIGenerateSummary data={data} onDataChange={onDataChange} />
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={openSection === 'experience'} onChange={() => handleOpenSection('experience')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Work Experience</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {data.experience.map((exp, index) => (
                        <Box key={exp.id} sx={{ p: 2, border: '1px solid grey', borderRadius: 1, mb: 2, position: 'relative' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Role / Title" value={exp.role} onChange={e => handleListItemChange('experience', index, 'role', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Company" value={exp.company} onChange={e => handleListItemChange('experience', index, 'company', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Start Date" value={exp.startDate} onChange={e => handleListItemChange('experience', index, 'startDate', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="End Date" value={exp.endDate} onChange={e => handleListItemChange('experience', index, 'endDate', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Description / Achievements" value={exp.description} onChange={e => handleListItemChange('experience', index, 'description', e.target.value)} multiline rows={6} fullWidth />
                                </Grid>
                            </Grid>
                            <AIGenerateBulletPoints exp={exp} onDescriptionUpdate={(newDesc) => handleListItemChange('experience', index, 'description', newDesc)} />
                            <IconButton onClick={() => removeListItem('experience', index)} sx={{ position: 'absolute', top: 8, right: 8 }}><TrashIcon /></IconButton>
                        </Box>
                    ))}
                    <Button onClick={() => addListItem('experience')} startIcon={<PlusIcon />}>Add Experience</Button>
                </AccordionDetails>
            </Accordion>
            
            <Accordion expanded={openSection === 'education'} onChange={() => handleOpenSection('education')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Education</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {data.education.map((edu, index) => (
                        <Box key={edu.id} sx={{ p: 2, border: '1px solid grey', borderRadius: 1, mb: 2, position: 'relative' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Institution" value={edu.institution} onChange={e => handleListItemChange('education', index, 'institution', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Degree / Major" value={edu.degree} onChange={e => handleListItemChange('education', index, 'degree', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Start Date" value={edu.startDate} onChange={e => handleListItemChange('education', index, 'startDate', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="End Date" value={edu.endDate} onChange={e => handleListItemChange('education', index, 'endDate', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="GPA" value={edu.gpa} onChange={e => handleListItemChange('education', index, 'gpa', e.target.value)} fullWidth />
                                </Grid>
                            </Grid>
                            <IconButton onClick={() => removeListItem('education', index)} sx={{ position: 'absolute', top: 8, right: 8 }}><TrashIcon /></IconButton>
                        </Box>
                    ))}
                    <Button onClick={() => addListItem('education')} startIcon={<PlusIcon />}>Add Education</Button>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={openSection === 'projects'} onChange={() => handleOpenSection('projects')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Projects</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {data.projects.map((proj, index) => (
                        <Box key={proj.id} sx={{ p: 2, border: '1px solid grey', borderRadius: 1, mb: 2, position: 'relative' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField label="Project Name" value={proj.name} onChange={e => handleListItemChange('projects', index, 'name', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Link" value={proj.link} onChange={e => handleListItemChange('projects', index, 'link', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Description" value={proj.description} onChange={e => handleListItemChange('projects', index, 'description', e.target.value)} multiline rows={3} fullWidth />
                                </Grid>
                            </Grid>
                            <IconButton onClick={() => removeListItem('projects', index)} sx={{ position: 'absolute', top: 8, right: 8 }}><TrashIcon /></IconButton>
                        </Box>
                    ))}
                    <Button onClick={() => addListItem('projects')} startIcon={<PlusIcon />}>Add Project</Button>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={openSection === 'skills'} onChange={() => handleOpenSection('skills')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Skills</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={2}>
                        {data.skills.map((skill, index) => (
                            <Grid item xs={12} sm={6} key={skill.id}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <TextField label="Skill" value={skill.name} onChange={e => handleListItemChange('skills', index, 'name', e.target.value)} fullWidth />
                                    <IconButton onClick={() => removeListItem('skills', index)}><TrashIcon /></IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <Button onClick={() => addListItem('skills')} startIcon={<PlusIcon />} sx={{ mt: 2 }}>Add Skill</Button>
                </AccordionDetails>
            </Accordion>
            
            <Accordion expanded={openSection === 'certifications'} onChange={() => handleOpenSection('certifications')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6">Certifications</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {data.certifications.map((cert, index) => (
                         <Box key={cert.id} sx={{ p: 2, border: '1px solid grey', borderRadius: 1, mb: 2, position: 'relative' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Certification Name" value={cert.name} onChange={e => handleListItemChange('certifications', index, 'name', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Issuer" value={cert.issuer} onChange={e => handleListItemChange('certifications', index, 'issuer', e.target.value)} fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Date" value={cert.date} onChange={e => handleListItemChange('certifications', index, 'date', e.target.value)} fullWidth />
                                </Grid>
                            </Grid>
                            <IconButton onClick={() => removeListItem('certifications', index)} sx={{ position: 'absolute', top: 8, right: 8 }}><TrashIcon /></IconButton>
                        </Box>
                    ))}
                    <Button onClick={() => addListItem('certifications')} startIcon={<PlusIcon />}>Add Certification</Button>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
};

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
        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.contrastText' }}>
                <SparklesIcon /> AI Summary Assistant
            </Typography>
            {isLoading ? <CircularProgress size={24} /> : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {(Object.keys(AITone) as Array<keyof typeof AITone>).map(tone => (
                        <Chip key={tone} label={AITone[tone]} onClick={() => generate(AITone[tone])} />
                    ))}
                </Box>
            )}
        </Box>
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
        <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Button onClick={generate} disabled={isLoading} startIcon={<SparklesIcon />}>
                {isLoading ? 'Generating...' : 'AI Suggest Bullet Points'}
            </Button>
            {suggestions.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2">Click to add a suggestion:</Typography>
                    {suggestions.map((s, i) => (
                        <Button key={i} onClick={() => addSuggestion(s)} fullWidth sx={{ mt: 1, justifyContent: 'flex-start', textTransform: 'none' }}>
                            {s}
                        </Button>
                    ))}
                </Box>
            )}
        </Box>
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
