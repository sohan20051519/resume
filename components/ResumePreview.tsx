
import React from 'react';
import type { ResumeData } from '../types';

interface ResumePreviewProps {
    data: ResumeData;
    template: React.FC<{ data: ResumeData }>;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template: TemplateComponent }) => {
    return (
        <div id="resume-preview" className="shadow-2xl">
           <TemplateComponent data={data} />
        </div>
    );
};

export default ResumePreview;
