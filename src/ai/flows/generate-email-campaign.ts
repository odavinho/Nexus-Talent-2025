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
  prompt: `Você é um especialista em marketing por e-mail e designer. Sua tarefa é criar um e-mail HTML completo, profissional, responsivo e persuasivo.

Use tabelas para o layout para garantir a máxima compatibilidade com clientes de e-mail.
Incorpore as cores da marca: cor primária hsl(197, 76%, 53%) para links e botões, e um cinzento escuro como #333 para o texto principal.

O objetivo do e-mail é: {{{topic}}}
O tom deve ser: {{{tone}}}
O idioma deve ser: {{{language}}}
O template escolhido é: '{{{template}}}'.

Com base nisso, gere o seguinte conteúdo:
1.  **subject**: Um assunto (título) de e-mail curto, impactante e que incentive a abertura.
2.  **bodyHtml**: O corpo completo do e-mail em formato HTML. O HTML deve ser bem estruturado e pronto a usar.
    - Inclua um placeholder para o logótipo da empresa como 'https://logospore.com/wp-content/uploads/2023/11/nexus-talent-logo.png'.
    - Se o template for 'withImage', inclua um placeholder para a imagem de cabeçalho: '[IMAGE_URL]'.
    - Se o template for 'promotional', crie uma secção com 2 colunas, cada uma com placeholder de imagem '[IMAGE_URL]' e uma pequena descrição e título.
    - Inclua um placeholder como '[Link]' para o URL do botão principal no corpo do texto que possa ser substituído.
    - Crie um rodapé profissional que inclua o nome da empresa 'NexusTalent', o endereço 'Luanda, Angola', links para redes sociais (placeholders) e, o mais importante, um link claro para 'Cancelar Subscrição'.
3.  **buttonText**: O texto para o botão de call-to-action, que deve ser claro e direto.
4.  **buttonLink**: Um URL de exemplo para o botão, que seja relevante para o tópico.
`,
});

const generateEmailCampaignFlow = ai.defineFlow(
  {
    name: 'generateEmailCampaignFlow',
    inputSchema: GenerateEmailCampaignInputSchema,
    outputSchema: EmailCampaignContentSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error('AI failed to generate email content.');
    }

    let finalBodyHtml = output.bodyHtml;

    // Replace the placeholder with the user-provided URL if it exists
    if ((input.template === 'withImage' || input.template === 'promotional') && input.imageUrl) {
      finalBodyHtml = finalBodyHtml.replace(/\[IMAGE_URL\]/g, input.imageUrl);
    }
    
    return {
        ...output,
        bodyHtml: finalBodyHtml,
    };
  }
);
