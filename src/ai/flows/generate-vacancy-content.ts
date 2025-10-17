'use server';
/**
 * @fileOverview AI-powered vacancy content generation.
 *
 * - generateVacancyContent - A function that handles the vacancy content generation process.
 * - GenerateVacancyContentInput - The input type for the generateVacancyContent function.
 * - GenerateVacancyContentOutput - The return type for the generateVacancyContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateVacancyContentInputSchema, GenerateVacancyContentOutputSchema } from '@/lib/schemas';


export type GenerateVacancyContentInput = z.infer<typeof GenerateVacancyContentInputSchema>;
export type GenerateVacancyContentOutput = z.infer<typeof GenerateVacancyContentOutputSchema>;


export async function generateVacancyContent(input: GenerateVacancyContentInput): Promise<GenerateVacancyContentOutput> {
  return generateVacancyContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVacancyContentPrompt',
  input: {schema: GenerateVacancyContentInputSchema},
  output: {schema: GenerateVacancyContentOutputSchema},
  prompt: `You are an expert recruiter. Based on the job title, category, industry, minimum experience, and demand level, generate a detailed job description in Portuguese. 
The description should include a general summary, a list of key responsibilities, a list of required qualifications and skills, and a list of 3-5 insightful, open-ended screening questions to help filter candidates.

Job Title: {{{title}}}
Category: {{{category}}}
Industry: {{{industry}}}
Minimum Experience: {{{minExperience}}}
Demand Level: {{{demandLevel}}}
`,
});

const generateVacancyContentFlow = ai.defineFlow(
  {
    name: 'generateVacancyContentFlow',
    inputSchema: GenerateVacancyContentInputSchema,
    outputSchema: GenerateVacancyContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    