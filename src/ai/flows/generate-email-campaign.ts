'use server';
/**
 * @fileOverview AI-powered email marketing campaign generation.
 *
 * - generateEmailCampaign - A function that handles the email content generation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateEmailCampaignInputSchema, EmailCampaignContentSchema, type GenerateEmailCampaignInput, type EmailCampaignContent } from '@/lib/schemas';

export async function generateEmailCampaign(input: GenerateEmailCampaignInput): Promise<EmailCampaignContent> {
  return generateEmailCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEmailCampaignPrompt',
  input: { schema: GenerateEmailCampaignInputSchema },
  output: { schema: EmailCampaignContentSchema },
  prompt: `Você é um especialista em marketing digital e copywriter. Sua tarefa é criar o conteúdo para uma campanha de e-mail profissional e persuasiva.

O objetivo do e-mail é: {{{topic}}}
O tom deve ser: {{{tone}}}
O idioma deve ser: {{{language}}}

Com base nisso, gere o seguinte conteúdo:
1.  **subject**: Um assunto (título) de e-mail curto, impactante e que incentive a abertura.
2.  **body**: O corpo do e-mail. Comece com uma saudação apropriada (ex: "Olá,"). Estruture o texto de forma clara, com parágrafos curtos. Use uma linguagem que se alinhe com o tom solicitado. O objetivo é informar e persuadir o leitor a clicar no botão de call-to-action.
3.  **buttonText**: O texto para o botão de call-to-action, que deve ser claro e direto.
4.  **buttonLink**: Um URL de exemplo para o botão, que seja relevante para o tópico.
5.  **imageUrl**: Se o template for 'withImage', gere um prompt de uma a três palavras para um gerador de imagens IA criar uma imagem de cabeçalho relevante (ex: "tecnologia abstrata", "reunião profissional"). Se for 'simple', retorne uma string vazia.
`,
});

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateEmailImage',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (promptText) => {
    if (!promptText) return "";
    try {
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: `Uma imagem de cabeçalho profissional e moderna para um e-mail sobre: ${promptText}. A imagem deve ser limpa, atrativa e adequada para um contexto de negócios. Evite texto na imagem.`,
      });
      return media.url;
    } catch (e) {
      console.error("Image generation failed for email campaign:", e);
      return ""; // Return empty string on failure to not block the process
    }
  }
);

const generateEmailCampaignFlow = ai.defineFlow(
  {
    name: 'generateEmailCampaignFlow',
    inputSchema: GenerateEmailCampaignInputSchema,
    outputSchema: EmailCampaignContentSchema,
  },
  async (input) => {
    const { output: textOutput } = await prompt(input);
    if (!textOutput) {
      throw new Error('AI failed to generate email content.');
    }

    let imageDataUri = "";
    if (input.template === 'withImage' && textOutput.imageUrl) {
      imageDataUri = await generateImageFlow(textOutput.imageUrl);
    }
    
    return {
        ...textOutput,
        imageDataUri: imageDataUri
    };
  }
);
