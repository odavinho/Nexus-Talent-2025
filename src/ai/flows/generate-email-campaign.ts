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

Com base nisso, gere o seguinte conteúdo:
1.  **subject**: Um assunto (título) de e-mail curto, impactante e que incentive a abertura.
2.  **bodyHtml**: O corpo completo do e-mail em formato HTML. O HTML deve ser bem estruturado. 
    - Inclua um placeholder para o logótipo da empresa como 'https://logospore.com/wp-content/uploads/2023/11/nexus-talent-logo.png'.
    - {{#if (eq template 'withImage')}} Se o template for 'withImage', inclua um placeholder para a imagem de cabeçalho: '[IMAGE_URL]'. {{/if}}
    - Inclua um placeholder como '[Link]' para o URL do botão principal no corpo do texto que possa ser substituído.
    - Crie um rodapé profissional que inclua o nome da empresa 'NexusTalent', o endereço 'Luanda, Angola', links para redes sociais (placeholders) e, o mais importante, um link claro para 'Cancelar Subscrição'.
3.  **buttonText**: O texto para o botão de call-to-action, que deve ser claro e direto.
4.  **buttonLink**: Um URL de exemplo para o botão, que seja relevante para o tópico.
5.  **imageHint**: {{#if (eq template 'withImage')}} Gere um prompt de duas a três palavras para um gerador de imagens IA criar uma imagem de cabeçalho relevante (ex: "tecnologia abstrata", "reunião profissional"). {{else}} Retorne uma string vazia. {{/if}}
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
    // Pass the entire input to the prompt, including the 'template' field.
    const { output: textOutput } = await prompt(input);
    
    if (!textOutput) {
      throw new Error('AI failed to generate email content.');
    }

    let finalBodyHtml = textOutput.bodyHtml;
    let imageDataUri = "";

    // Image logic is now cleaner and respects the provided template and URL
    if (input.template === 'withImage') {
      // Prioritize user-provided URL
      if (input.imageUrl) {
        imageDataUri = input.imageUrl;
      } else if (textOutput.imageHint) {
        // Only generate with AI if URL is not provided AND hint exists
        imageDataUri = await generateImageFlow(textOutput.imageHint);
      }
    }
    
    // Always run the replace, even if imageDataUri is empty.
    // This will replace the placeholder with the image or remove it if none is available.
    finalBodyHtml = finalBodyHtml.replace('[IMAGE_URL]', imageDataUri || '');
    
    return {
        ...textOutput,
        bodyHtml: finalBodyHtml,
        imageDataUri: imageDataUri
    };
  }
);
