import type { Course } from './types';

export const courses: Course[] = [
  { 
    id: 'TA-001', 
    name: 'Técnicas de Apresentação', 
    category: 'dev-pessoal', 
    imageId: 'course-presentation',
    duration: '24 horas',
    format: 'Presencial',
    generalObjective: 'Desenvolver as competências de comunicação e apresentação em público, permitindo realizar apresentações eficazes e de alto impacto.',
    whatYouWillLearn: [
      'Estruturar uma apresentação de forma lógica e cativante.',
      'Utilizar a comunicação verbal e não-verbal de forma eficaz.',
      'Gerir o nervosismo e a ansiedade ao falar em público.',
      'Criar suportes visuais (slides) claros e apelativos.',
      'Adaptar a apresentação a diferentes tipos de audiência.'
    ],
    modules: [
      { title: 'Módulo 1: Planeamento e Estrutura', topics: [{title: 'Definição de objetivos'}, {title: 'Análise da audiência'}, {title: 'Estruturas de discurso (Storytelling)'}, {title: 'Organização do conteúdo'}] },
      { title: 'Módulo 2: Comunicação e Expressão', topics: [{title: 'Linguagem verbal: clareza, tom e ritmo'}, {title: 'Linguagem não-verbal: postura, gestos e contacto visual'}, {title: 'Técnicas de dicção e projecção de voz'}] },
      { title: 'Módulo 3: O Apresentador', topics: [{title: 'Gestão da ansiedade e autoconfiança'}, {title: 'Interação com a audiência'}, {title: 'Gestão de perguntas e respostas'}] },
      { title: 'Módulo 4: Suportes Visuais', topics: [{title: 'Design de slides (PowerPoint/Google Slides)'}, {title: 'Princípios de design gráfico para apresentações'}, {title: 'Uso de imagens, gráficos e multimédia'}] }
    ]
  },
  { 
    id: 'GC-002', 
    name: 'Gestão de Conflitos', 
    category: 'dev-pessoal', 
    imageId: 'course-conflict',
    duration: '20 horas',
    format: 'Online',
    generalObjective: 'Capacitar os participantes com ferramentas e técnicas para identificar, gerir e resolver conflitos de forma construtiva no ambiente de trabalho.',
    whatYouWillLearn: [
      'Compreender a natureza e as causas dos conflitos.',
      'Identificar os diferentes estilos de gestão de conflitos.',
      'Aplicar técnicas de negociação e mediação.',
      'Desenvolver a comunicação assertiva para prevenção de conflitos.',
      'Transformar situações de conflito em oportunidades de crescimento.'
    ],
    modules: [
      { title: 'Módulo 1: Introdução ao Conflito', topics: [{title: 'Tipos e níveis de conflito'}, {title: 'Causas comuns de conflitos'}, {title: 'O ciclo de vida do conflito', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}] },
      { title: 'Módulo 2: Estilos de Gestão de Conflitos', topics: [{title: 'Diagnóstico de estilos pessoais'}, {title: 'Vantagens e desvantagens de cada estilo'}] },
      { title: 'Módulo 3: Comunicação e Negociação', topics: [{title: 'Escuta ativa e empatia'}, {title: 'Comunicação assertiva vs. agressiva'}, {title: 'Princípios da negociação de Harvard'}] },
      { title: 'Módulo 4: Mediação e Resolução', topics: [{title: 'O papel do mediador'}, {title: 'Passos para a resolução de conflitos'}, {title: 'Criação de acordos ganha-ganha'}] }
    ]
  },
  { 
    id: 'LMP-006', 
    name: 'Liderança e Motivação de Pessoas', 
    category: 'rh-gestao', 
    imageId: 'course-leadership', 
    duration: '30 horas', 
    format: 'Híbrido',
    generalObjective: 'Capacitar os participantes com as competências essenciais para liderar e motivar equipas, promovendo um ambiente de trabalho produtivo e positivo.', 
    whatYouWillLearn: [
      'Compreender os diferentes estilos de liderança e quando aplicá-los.', 
      'Desenvolver a inteligência emocional para liderar com empatia.', 
      'Aprender técnicas eficazes de comunicação e feedback.', 
      'Aplicar estratégias de motivação e reconhecimento.', 
      'Gerir o desempenho da equipa e promover o desenvolvimento individual.'
    ], 
    modules: [
      { title: 'Módulo 1: Fundamentos da Liderança', topics: [{title: 'Teorias de liderança'}, {title: 'Líder vs. Chefe'}] }, 
      { title: 'Módulo 2: Inteligência Emocional', topics: [{title: 'Autoconhecimento e autogestão'}, {title: 'Empatia e gestão de relacionamentos'}] }, 
      { title: 'Módulo 3: Comunicação e Feedback', topics: [{title: 'Comunicação assertiva'}, {title: 'Técnicas de feedback construtivo'}] }, 
      { title: 'Módulo 4: Motivação e Gestão', topics: [{title: 'Teorias da motivação'}, {title: 'Definição de metas SMART'}] }] 
  },
  { 
    id: 'EN-427', 
    name: 'Gestão de Projectos', 
    category: 'rh-gestao', 
    imageId: 'course-project-management', 
    duration: '40 horas', 
    format: 'Online',
    generalObjective: 'Fornecer aos participantes os conhecimentos, ferramentas e técnicas fundamentais para gerir projectos de forma eficaz, desde o início até à conclusão.', 
    whatYouWillLearn: [
      'Compreender o ciclo de vida de um projecto.', 
      'Definir o escopo, cronograma, custos e qualidade do projecto.', 
      'Identificar e gerir riscos.', 
      'Gerir a comunicação e as partes interessadas (stakeholders).', 
      'Utilizar metodologias de gestão de projectos (PMBOK, Agile).'
    ], 
    modules: [
      { title: 'Módulo 1: Introdução à Gestão de Projectos', topics: [{title: 'O que é um projecto?'}, {title: 'O papel do Gestor de Projectos'}] }, 
      { title: 'Módulo 2: Iniciação e Planeamento', topics: [{title: 'Elaboração do Project Charter'}, {title: 'Definição do escopo (WBS)'}, {title: 'Criação do cronograma e orçamento'}] }, 
      { title: 'Módulo 3: Execução e Controlo', topics: [{title: 'Gestão da equipa do projecto'}, {title: 'Monitorização do progresso (KPIs)'}] }, 
      { title: 'Módulo 4: Encerramento e Metodologias', topics: [{title: 'Entrega do projecto'}, {title: 'Lições aprendidas'}, {title: 'Introdução ao Scrum e Kanban'}] }] 
  },
  { 
    id: 'NE-74', 
    name: 'Power BI Microsoft', 
    category: 'informatica-it', 
    imageId: 'course-power-bi', 
    duration: '35 horas', 
    format: 'Online',
    generalObjective: 'Capacitar os participantes a transformar dados brutos em dashboards e relatórios interactivos e visualmente apelativos, utilizando o Microsoft Power BI.', 
    whatYouWillLearn: [
      'Conectar e transformar dados de diversas fontes (Excel, SQL, etc.).', 
      'Modelar dados para criar relações e hierarquias.', 
      'Criar visualizações de dados (gráficos, tabelas, mapas).', 
      'Utilizar a linguagem DAX para criar medidas e colunas calculadas.', 
      'Publicar e partilhar relatórios no serviço Power BI.'
    ], 
    modules: [
      { title: 'Módulo 1: Introdução ao Power BI', topics: [{title: 'O que é o Power BI'}, {title: 'Instalação e interface'}] }, 
      { title: 'Módulo 2: Obter e Transformar Dados', topics: [{title: 'Conectar a diferentes fontes'}, {title: 'Limpeza e transformação de dados'}] }, 
      { title: 'Módulo 3: Modelação de Dados e DAX', topics: [{title: 'Criação de relacionamentos'}, {title: 'Introdução às funções DAX'}] }, 
      { title: 'Módulo 4: Visualização e Publicação', topics: [{title: 'Criação de relatórios'}, {title: 'Publicação no Power BI Service'}] }] 
  },
  { 
    id: 'GE-003', 
    name: 'Gestão Emocional', 
    category: 'dev-pessoal', 
    imageId: 'course-emotional', 
    duration: '16 horas', 
    format: 'Presencial',
    generalObjective: 'Desenvolver a inteligência emocional dos participantes para melhorarem o autoconhecimento, a autogestão, a empatia e os relacionamentos interpessoais.', 
    whatYouWillLearn: [
      'Reconhecer e compreender as próprias emoções.', 
      'Gerir emoções e impulsos de forma saudável.', 
      'Desenvolver a empatia para compreender os outros.', 
      'Construir relacionamentos mais fortes e positivos.', 
      'Aplicar a inteligência emocional na resolução de problemas.'
    ], 
    modules: [
      { title: 'Módulo 1: Pilares da Inteligência Emocional', topics: [{title: 'Definição e importância'}, {title: 'Autoconsciência emocional'}] }, 
      { title: 'Módulo 2: Autogestão', topics: [{title: 'Controlo de impulsos'}, {title: 'Gestão do stress'}, {title: 'Automotivação'}] }, 
      { title: 'Módulo 3: Consciência Social', topics: [{title: 'Empatia'}, {title: 'Consciência organizacional'}] }, 
      { title: 'Módulo 4: Gestão de Relacionamentos', topics: [{title: 'Comunicação eficaz'}, {title: 'Influência e liderança'}] }] 
  }
];
