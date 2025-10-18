'use server';
/**
 * @fileOverview AI-powered email marketing campaign generation.
 *
 * - generateEmailCampaign - A function that creates email content based on a goal and audience.
 */

import { ai } from '@/ai/genkit';
import { GenerateEmailCampaignInputSchema, GenerateEmailCampaignOutputSchema, type GenerateEmailCampaignInput, type GenerateEmailCampaignOutput } from '@/lib/schemas';

export async function generateEmailCampaign(input: GenerateEmailCampaignInput): Promise<GenerateEmailCampaignOutput> {
  return generateEmailCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailCampaignPrompt',
  input: { schema: GenerateEmailCampaignInputSchema },
  output: { schema: GenerateEmailCampaignOutputSchema },
  prompt: `Você é um especialista em e-mail marketing para uma plataforma de recrutamento e formação chamada NexusTalent.
Sua tarefa é criar um e-mail marketing eficaz em português, utilizando um layout HTML profissional e responsivo.

**Público-Alvo:** {{{targetAudience}}}
**Objetivo do E-mail:** {{{emailGoal}}}
**Tom:** {{{tone}}}
**Layout Escolhido:** {{{layoutType}}}
**Link do Call-to-Action (CTA):** {{{ctaLink}}}
{{#if imageUrl}}**URL da Imagem a ser usada:** {{{imageUrl}}}{{/if}}

Crie o seguinte:
1.  **Assunto (Subject):** Um assunto curto, apelativo e que desperte a curiosidade, alinhado com o objetivo.
2.  **Corpo do E-mail (Body):** O conteúdo completo do e-mail em formato HTML. O HTML deve ser "inline-styled" e usar tabelas para o layout para garantir máxima compatibilidade com clientes de e-mail.
    - Inclua um cabeçalho com o logótipo da NexusTalent (use uma imagem de placeholder: https://placehold.co/150x50/1d71b8/ffffff?text=NexusTalent).
    - Estruture o corpo da mensagem de forma clara e legível. Use um container com largura máxima de 600px.
    - Incorpore as cores da marca (primária: #1d71b8, accent: #f59e0b).
    - Inclua um botão de Call-to-Action (CTA) claro e proeminente, utilizando o link fornecido ({{{ctaLink}}}).
    - Termine com um rodapé profissional que inclua links para redes sociais (placeholders) e uma opção de cancelamento de subscrição.
    - O texto do e-mail deve ser bem escrito, persuasivo e adaptado ao público-alvo e ao tom especificado.

    {{#if (and imageUrl (eq layoutType "Imagem, Título e Botão"))}}
    - **Layout com Imagem:** Comece com a imagem, seguida por um título (h1), um ou dois parágrafos de texto, e termine com o botão de CTA.
    {{else}}
    - **Layout de Texto:** Comece com um título (h1), seguido por parágrafos de texto e termine com o botão de CTA.
    {{/if}}`,
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
