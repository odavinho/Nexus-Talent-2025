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
2.  **bodyHtml**: O corpo completo do e-mail em formato HTML. O HTML deve ser bem estruturado.
    - Inclua um placeholder para o logótipo da empresa como 'https://logospore.com/wp-content/uploads/2023/11/nexus-talent-logo.png'.
    - Se o template for 'withImage', inclua um placeholder para a imagem de cabeçalho: '[IMAGE_URL]'.
    - Se o template for 'promotional', crie uma secção com 2 colunas, cada uma com placeholder de imagem '[IMAGE_URL_1]' e '[IMAGE_URL_2]', título e pequena descrição.
    - Inclua um placeholder como '[Link]' para o URL do botão principal no corpo do texto que possa ser substituído.
    - Crie um rodapé profissional que inclua o nome da empresa 'NexusTalent', o endereço 'Luanda, Angola', links para redes sociais (placeholders) e, o mais importante, um link claro para 'Cancelar Subscrição'.
3.  **buttonText**: O texto para o botão de call-to-action, que deve ser claro e direto.
4.  **buttonLink**: Um URL de exemplo para o botão, que seja relevante para o tópico.
5.  **imageHint**: Se o template for 'withImage' ou 'promotional', gere um prompt de duas a três palavras para um gerador de imagens IA criar uma imagem de cabeçalho relevante (ex: "tecnologia abstrata", "reunião profissional"). Caso contrário, retorne uma string vazia.
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

    let finalBodyHtml = textOutput.bodyHtml;

    if (input.template === 'withImage') {
      let imageDataUri = input.imageUrl || "";
      if (!imageDataUri && textOutput.imageHint) {
        imageDataUri = await generateImageFlow(textOutput.imageHint);
      }
      finalBodyHtml = finalBodyHtml.replace('[IMAGE_URL]', imageDataUri);
      textOutput.imageDataUri = imageDataUri; // Pass it back to the client
    }

    if (input.template === 'promotional' && textOutput.imageHint) {
        const hint1 = textOutput.imageHint + " item 1";
        const hint2 = textOutput.imageHint + " item 2";
        
        // Generate images in parallel
        const [img1, img2] = await Promise.all([
            generateImageFlow(hint1),
            generateImageFlow(hint2)
        ]);

        finalBodyHtml = finalBodyHtml.replace('[IMAGE_URL_1]', img1 || '');
        finalBodyHtml = finalBodyHtml.replace('[IMAGE_URL_2]', img2 || '');
    }
    
    return {
        ...textOutput,
        bodyHtml: finalBodyHtml,
    };
  }
);
