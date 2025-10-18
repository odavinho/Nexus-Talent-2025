'use server';
/**
 * @fileOverview AI-powered email marketing campaign generation.
 *
 * - generateEmailCampaign - A function that creates email content based on a goal and audience.
 * - GenerateEmailCampaignInput - The input type for the function.
 * - GenerateEmailCampaignOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateEmailCampaignInputSchema = z.object({
  targetAudience: z.string().describe('The target audience for the email (e.g., "Todos os candidatos", "Engenheiros de Software", "Alunos inscritos no curso X").'),
  emailGoal: z.string().describe('A brief and clear objective for the email campaign (e.g., "Anunciar novo curso de liderança", "Promover vagas abertas na área de TI", "Convidar para um webinar gratuito").'),
  tone: z.enum(['Profissional', 'Amigável', 'Urgente']).describe('The desired tone for the email.'),
});
export type GenerateEmailCampaignInput = z.infer<typeof GenerateEmailCampaignInputSchema>;

export const GenerateEmailCampaignOutputSchema = z.object({
  subject: z.string().describe('A catchy and relevant subject line for the email.'),
  body: z.string().describe('The full body of the email, formatted in simple text. Use line breaks for paragraphs. Include a greeting, the main message, a call-to-action, and a closing.'),
});
export type GenerateEmailCampaignOutput = z.infer<typeof GenerateEmailCampaignOutputSchema>;

export async function generateEmailCampaign(input: GenerateEmailCampaignInput): Promise<GenerateEmailCampaignOutput> {
  return generateEmailCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailCampaignPrompt',
  input: { schema: GenerateEmailCampaignInputSchema },
  output: { schema: GenerateEmailCampaignOutputSchema },
  prompt: `Você é um especialista em e-mail marketing para uma plataforma de recrutamento e formação chamada NexusTalent.
Sua tarefa é criar um e-mail marketing eficaz em português.

**Público-Alvo:** {{{targetAudience}}}
**Objetivo do E-mail:** {{{emailGoal}}}
**Tom:** {{{tone}}}

Crie o seguinte:
1.  **Assunto (Subject):** Um assunto curto, apelativo e que desperte a curiosidade, alinhado com o objetivo.
2.  **Corpo do E-mail (Body):** O texto completo do e-mail. Comece com uma saudação apropriada (ex: "Olá [Nome do Candidato]," ou "Olá a todos,"). Desenvolva a mensagem principal de forma clara e concisa. Termine com uma chamada para ação (call-to-action) clara e uma despedida profissional. Use quebras de linha para separar parágrafos.`,
});

const generateEmailCampaignFlow = ai.defineFlow(
  {
    name: 'generateEmailCampaignFlow',
    inputSchema: GenerateEmailCampaignInputSchema,
    outputSchema: GenerateEmailCampaignOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
