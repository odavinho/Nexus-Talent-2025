'use server';
/**
 * @fileOverview A chatbot assistant to help users navigate the platform.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { searchCourses, searchVacancies } from '@/lib/chatbot-service';
import { ChatbotAssistanceInputSchema, ChatbotAssistanceOutputSchema, type ChatbotAssistanceInput, type ChatbotAssistanceOutput } from '@/lib/schemas';


export async function chatbotAssistance(input: ChatbotAssistanceInput): Promise<ChatbotAssistanceOutput> {
  return chatbotAssistanceFlow(input);
}

const findCoursesTool = ai.defineTool(
    {
      name: 'findCourses',
      description: 'Searches for available courses based on a query.',
      inputSchema: z.object({ query: z.string().describe('The search term for courses, like a topic or course name.') }),
      outputSchema: z.array(z.object({
          id: z.string(),
          name: z.string(),
          category: z.string(),
          format: z.string(),
          generalObjective: z.string(),
      })),
    },
    async ({ query }) => searchCourses(query)
  );
  
  const findVacanciesTool = ai.defineTool(
    {
      name: 'findVacancies',
      description: 'Searches for available job vacancies based on a query.',
      inputSchema: z.object({ query: z.string().describe('The search term for vacancies, like a job title or location.') }),
      outputSchema: z.array(z.object({
          id: z.string(),
          title: z.string(),
          location: z.string(),
          type: z.string(),
          description: z.string(),
      })),
    },
    async ({ query }) => searchVacancies(query)
  );

const prompt = ai.definePrompt({
    name: 'chatbotAssistancePrompt',
    input: { schema: ChatbotAssistanceInputSchema },
    output: { schema: ChatbotAssistanceOutputSchema },
    tools: [findCoursesTool, findVacanciesTool],
    prompt: `You are a friendly and helpful assistant for the NexusTalent platform. Your goal is to answer user questions about courses and job vacancies and guide them to the correct pages.

- Your name is 'Nexus Assistant'.
- Be concise and direct in your answers.
- Use the available tools to find information about courses and vacancies when the user asks.
- If you find relevant courses or vacancies, mention their names and include them in the 'suggestedLinks' output so the user can easily click on them.
- If you don't know the answer or can't find relevant information, politely say so and suggest they browse the site manually.
- The current page context is: '{{{context}}}'
- The user's question is: '{{{query}}}'`,
});

const chatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'chatbotAssistanceFlow',
    inputSchema: ChatbotAssistanceInputSchema,
    outputSchema: ChatbotAssistanceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
