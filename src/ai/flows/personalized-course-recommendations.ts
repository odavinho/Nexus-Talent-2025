'use server';

/**
 * @fileOverview Provides personalized course recommendations based on user profile, past activity, and career goals.
 *
 * - personalizedCourseRecommendations - A function that returns personalized course recommendations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { PersonalizedCourseRecommendationsInputSchema, PersonalizedCourseRecommendationsOutputSchema, type PersonalizedCourseRecommendationsInput, type PersonalizedCourseRecommendationsOutput } from '@/lib/schemas';


export async function personalizedCourseRecommendations(
  input: PersonalizedCourseRecommendationsInput
): Promise<PersonalizedCourseRecommendationsOutput> {
  return personalizedCourseRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedCourseRecommendationsPrompt',
  input: {schema: PersonalizedCourseRecommendationsInputSchema},
  output: {schema: PersonalizedCourseRecommendationsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized course recommendations to users based on their profile, past activity, and career goals.

  User Profile: {{{userProfile}}}
  Course Catalog: {{{courseCatalog}}}

  Based on the user profile and the available courses, recommend the most relevant courses and explain why each course is recommended. Suggest specific learning tracks, and estimate improvements that tool could achieve if completed.
`,
});

const personalizedCourseRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedCourseRecommendationsFlow',
    inputSchema: PersonalizedCourseRecommendationsInputSchema,
    outputSchema: PersonalizedCourseRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
