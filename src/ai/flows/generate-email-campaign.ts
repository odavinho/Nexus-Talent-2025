'use server';
/**
 * @fileOverview AI-powered email marketing campaign generation.
 *
 * - generateEmailCampaign - A function that creates email content based on a goal and audience.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateEmailCampaignInputSchema, GenerateEmailCampaignOutputSchema, type GenerateEmailCampaignInput, type GenerateEmailCampaignOutput } from '@/lib/schemas';

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
