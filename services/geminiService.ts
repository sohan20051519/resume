import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeData } from '../types';

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        const apiKey = process.env.API_KEY ?? process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "undefined") {
            throw new Error("API key is not set. Please set the GEMINI_API_KEY environment variable.");
        }
        ai = new GoogleGenAI({ apiKey });
    }
    return ai;
};

export const generateSummary = async (tone: string, existingSummary: string, experience: string): Promise<string> => {
  try {
    const prompt = `
      Based on the following work experience, write a professional resume summary.
      The tone should be ${tone}.
      If an existing summary is provided, use it as inspiration but create a new, improved version.

      Work Experience:
      ${experience}

      Existing Summary (optional):
      ${existingSummary}

      Generate a new summary of about 3-4 sentences. Do not use markdown.
    `;

    const response = await getAI().models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error: Could not generate summary.";
  }
};

export const generateBulletPoints = async (jobTitle: string, jobDescription: string): Promise<string[]> => {
    try {
        const prompt = `
        You are an expert resume writer. For a role as a "${jobTitle}", rewrite and enhance the following job responsibilities into 3-5 impactful, action-oriented resume bullet points.
        Start each bullet point with a strong action verb. Focus on achievements and quantifiable results.
        Do not use markdown, just return a list of bullet points separated by a newline character, each starting with '- '.

        Original Responsibilities:
        "${jobDescription}"

        Example output:
        - Spearheaded the development of a new user authentication system, improving security by 25%.
        - Optimized application performance by 40% through code refactoring and database query tuning.
        - Mentored junior developers, fostering team growth and improving code quality.
        `;

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim().split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim());
    } catch (error) {
        console.error("Error generating bullet points:", error);
        return ["Error: Could not generate bullet points."];
    }
}

export const parseResume = async (file: { base64: string; mimeType: string }): Promise<Partial<ResumeData>> => {
    try {
        const filePart = {
            inlineData: {
                data: file.base64,
                mimeType: file.mimeType,
            },
        };

        const textPart = {
            text: `
            Parse the attached resume file and extract the information into a JSON object.
            The JSON object should follow the specified schema.
            If a section is not found, return an empty string or empty array for that field.
            For skills, try to categorize them as 'Technical' or 'Soft'. If unsure, default to 'Technical'.
            `,
        };

        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [filePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        personal: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                email: { type: Type.STRING },
                                phone: { type: Type.STRING },
                                linkedin: { type: Type.STRING },
                                portfolio: { type: Type.STRING },
                            }
                        },
                        summary: { type: Type.STRING },
                        experience: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    company: { type: Type.STRING },
                                    role: { type: Type.STRING },
                                    startDate: { type: Type.STRING },
                                    endDate: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                }
                            }
                        },
                        education: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    institution: { type: Type.STRING },
                                    degree: { type: Type.STRING },
                                    startDate: { type: Type.STRING },
                                    endDate: { type: Type.STRING },
                                    gpa: { type: Type.STRING },
                                }
                            }
                        },
                        skills: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    category: { type: Type.STRING, enum: ['Technical', 'Soft'] },
                                }
                            }
                        },
.                        projects: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    link: { type: Type.STRING },
                                }
                            }
                        },
                        certifications: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    issuer: { type: Type.STRING },
                                    date: { type: Type.STRING },
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText);

    } catch (error) {
        console.error("Error parsing resume:", error);
        throw new Error("Failed to parse resume with AI.");
    }
};