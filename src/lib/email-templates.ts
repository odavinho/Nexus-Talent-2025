export interface EmailTemplate {
    id: string;
    name: string;
    html: string;
    imageCount: 0 | 1 | 2;
}

const templateMinimalist: EmailTemplate = {
    id: 'minimalist',
    name: 'Minimalista',
    imageCount: 0,
    html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; }
  .header { padding: 20px; text-align: center; }
  .content { padding: 20px; }
  .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; }
  .button { background-color: #1d71b8; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
</style>
</head>
<body>
  <div class="header"><img src="[LOGO_URL]" alt="Logo" width="150"></div>
  <div class="content">
    <h1>Assunto do E-mail</h1>
    <p>Corpo do e-mail aqui...</p>
    <p><a href="[BUTTON_LINK]" class="button">Texto do Botão</a></p>
  </div>
  <div class="footer">
    <p>[COMPANY_NAME] | [COMPANY_ADDRESS]</p>
    <p><a href="[UNSUBSCRIBE_LINK]">Cancelar Subscrição</a></p>
  </div>
</body>
</html>
`
};

const templateNewsletter: EmailTemplate = {
    id: 'newsletter',
    name: 'Newsletter',
    imageCount: 1,
    html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: auto; background-color: white; }
  .header { padding: 20px; text-align: center; background-color: #f8f9fa; }
  .hero-image { width: 100%; height: auto; }
  .content { padding: 30px; }
  .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; }
  .button { display: inline-block; background-color: #1d71b8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
</style>
</head>
<body>
  <div class="container">
    <div class="header"><img src="[LOGO_URL]" alt="Logo" width="150"></div>
    <div><img src="[IMAGE_URL_1]" alt="Header Image" class="hero-image"></div>
    <div class="content">
      <h1>Assunto Principal</h1>
      <p>Este é o parágrafo principal da sua newsletter. Fale sobre as novidades, promoções ou o que for mais importante.</p>
      <p>Pode adicionar mais detalhes e informações relevantes aqui para envolver o seu leitor.</p>
      <p style="text-align: center; margin-top: 30px;"><a href="[BUTTON_LINK]" class="button">Texto do Botão</a></p>
    </div>
    <div class="footer">
      <p>[COMPANY_NAME] | [COMPANY_ADDRESS]</p>
      <p><a href="[UNSUBSCRIBE_LINK]">Cancelar Subscrição</a></p>
    </div>
  </div>
</body>
</html>
`
};

const templateProductShowcase: EmailTemplate = {
    id: 'product_showcase',
    name: 'Vitrine de Produtos',
    imageCount: 2,
    html: `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: auto; background-color: white; }
  .header { padding: 20px; text-align: center; background-color: #f8f9fa; }
  .content { padding: 30px; }
  .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .product-item img { width: 100%; height: auto; border-radius: 5px; }
  .product-item h3 { margin: 10px 0 5px 0; font-size: 16px; }
  .product-item p { font-size: 14px; color: #555; margin: 0; }
  .footer { padding: 20px; text-align: center; font-size: 12px; color: #888; }
  .main-button { display: inline-block; background-color: #1d71b8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; }
</style>
</head>
<body>
  <div class="container">
    <div class="header"><img src="[LOGO_URL]" alt="Logo" width="150"></div>
    <div class="content">
      <h1>Título da Campanha</h1>
      <p>Introdução sobre os produtos ou cursos em destaque.</p>
      <div class="product-grid">
        <div class="product-item">
          <img src="[IMAGE_URL_1]" alt="Produto 1">
          <h3>Produto/Curso 1</h3>
          <p>Breve descrição do primeiro item.</p>
        </div>
        <div class="product-item">
          <img src="[IMAGE_URL_2]" alt="Produto 2">
          <h3>Produto/Curso 2</h3>
          <p>Breve descrição do segundo item.</p>
        </div>
      </div>
      <p style="text-align: center; margin-top: 30px;"><a href="[BUTTON_LINK]" class="main-button">Texto do Botão Principal</a></p>
    </div>
    <div class="footer">
      <p>[COMPANY_NAME] | [COMPANY_ADDRESS]</p>
      <p><a href="[UNSUBSCRIBE_LINK]">Cancelar Subscrição</a></p>
    </div>
  </div>
</body>
</html>
`
};


const allTemplates: EmailTemplate[] = [templateNewsletter, templateProductShowcase, templateMinimalist];

export const getTemplates = (): EmailTemplate[] => {
    return allTemplates;
}

export const getTemplateHtmlById = (id: string): string | null => {
    return allTemplates.find(t => t.id === id)?.html || null;
}
