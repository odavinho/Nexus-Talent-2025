
import type { Course, CourseCategory } from './types';

export const courseCategories: CourseCategory[] = [
    { id: 'dev-pessoal', name: 'Desenvolvimento Pessoal e Profissional' },
    { id: 'rh-gestao', name: 'Recursos Humanos e Gestão' },
    { id: 'minerios-petroleo', name: 'Recursos Minerais e Petróleos' },
    { id: 'financas-admin', name: 'Finanças e Administração' },
    { id: 'informatica-it', name: 'Informática, IT & Software' },
    { id: 'industrial', name: 'Industrial' },
    { id: 'seguranca-trabalho', name: 'Higiene & Segurança no Trabalho' },
    { id: 'marketing-comercial', name: 'Gestão Comercial & Marketing' },
    { id: 'ingles', name: 'Curso de Inglês' },
    { id: 'certificacao', name: 'Cursos de Certificação'}
];

// This file now acts as the initial data source if localStorage is empty.
export const courses: Course[] = [
  { 
    id: 'TA-001', 
    name: 'Técnicas de Apresentação', 
    category: 'dev-pessoal', 
    imageId: 'course-presentation',
    status: 'Ativo',
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
      { 
        title: 'Módulo 1: Planeamento e Estrutura', 
        duration: '6 h.', 
        topics: [
            {title: 'Definição de objetivos', videoUrl: 'https://www.youtube.com/watch?v=JVI31cP8pe8'}, 
            {title: 'Análise da audiência', powerpointUrl: 'https://file-examples.com/storage/fe52cb0c4862dc676a1b341/2017/08/file_example_PPT_250kB.ppt'}, 
            {title: 'Estruturas de discurso (Storytelling)', pdfUrl: '#'}, 
            {title: 'Organização do conteúdo', pdfUrl: '#'}
        ],
        assessment: {
            questions: [
                {
                    question: "Qual é o primeiro passo crucial no planeamento de uma apresentação?",
                    type: "multiple-choice",
                    options: [
                        { value: "Criar os slides" },
                        { value: "Definir o objetivo claro" },
                        { value: "Praticar a fala" },
                        { value: "Escolher a roupa" }
                    ],
                    correctAnswerIndex: 1
                },
                {
                    question: "Explique brevemente a importância da análise da audiência.",
                    type: "short-answer",
                    shortAnswer: "Adaptar a linguagem, o conteúdo e o estilo da apresentação às necessidades e expectativas do público para garantir maior impacto e compreensão."
                }
            ]
        } 
      },
      { 
        title: 'Módulo 2: Comunicação e Expressão', 
        duration: '8 h.', 
        topics: [
          {title: 'Linguagem verbal: clareza, tom e ritmo', videoUrl: 'https://www.youtube.com/watch?v=JVI31cP8pe8'}, 
          {title: 'Linguagem não-verbal: postura e gestos', pdfUrl: '#'}, 
          {title: 'Contacto visual e movimentação', videoUrl: 'https://www.youtube.com/watch?v=JVI31cP8pe8'},
          {title: 'Técnicas de dicção e projecção de voz', pdfUrl: '#'}
        ] 
      },
      { 
        title: 'Módulo 3: O Apresentador', 
        duration: '6 h.', 
        topics: [
          {title: 'Gestão da ansiedade e autoconfiança', powerpointUrl: 'https://file-examples.com/storage/fe52cb0c4862dc676a1b341/2017/08/file_example_PPT_250kB.ppt'}, 
          {title: 'Interação com a audiência'}, 
          {title: 'Gestão de perguntas e respostas', pdfUrl: '#'}
        ] 
      },
      { 
        title: 'Módulo 4: Suportes Visuais', 
        duration: '4 h.', 
        topics: [
          {title: 'Design de slides (PowerPoint/Google Slides)', pdfUrl: '#'}, 
          {title: 'Princípios de design gráfico para apresentações'}, 
          {title: 'Uso de imagens, gráficos e multimédia', videoUrl: 'https://www.youtube.com/watch?v=JVI31cP8pe8'}
        ] 
      }
    ]
  },
  { 
    id: 'GC-002', 
    name: 'Gestão de Conflitos', 
    category: 'dev-pessoal', 
    imageId: 'course-conflict',
    status: 'Ativo',
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
      { title: 'Módulo 1: Introdução ao Conflito', duration: '4 h.', topics: [{title: 'Tipos e níveis de conflito'}, {title: 'Causas comuns de conflitos'}, {title: 'O ciclo de vida do conflito', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}] },
      { title: 'Módulo 2: Estilos de Gestão de Conflitos', duration: '6 h.', topics: [{title: 'Diagnóstico de estilos pessoais'}, {title: 'Vantagens e desvantagens de cada estilo'}] },
      { title: 'Módulo 3: Comunicação e Negociação', duration: '6 h.', topics: [{title: 'Escuta ativa e empatia'}, {title: 'Comunicação assertiva vs. agressiva'}, {title: 'Princípios da negociação de Harvard'}] },
      { title: 'Módulo 4: Mediação e Resolução', duration: '4 h.', topics: [{title: 'O papel do mediador'}, {title: 'Passos para a resolução de conflitos'}, {title: 'Criação de acordos ganha-ganha'}] }
    ]
  },
  { 
    id: 'GP-MSP-01', 
    name: 'Gestão de Projectos com MS Project', 
    category: 'rh-gestao', 
    imageId: 'course-project-management', 
    status: 'Ativo',
    duration: '40 horas', 
    format: 'Online',
    generalObjective: 'Capacitar os formandos para o planeamento, execução e controlo de projetos utilizando a ferramenta Microsoft Project, alinhado com as boas práticas do PMBOK.', 
    whatYouWillLearn: [
      'Estruturar um projecto do início ao fim no MS Project.', 
      'Criar e gerir tarefas, durações, dependências e recursos.', 
      'Analisar o caminho crítico e nivelar recursos para otimizar o cronograma.', 
      'Controlar custos e orçamentos do projeto.', 
      'Gerar relatórios de progresso e dashboards visuais.'
    ], 
    modules: [
      { 
        title: 'Módulo 1: Introdução e Configuração de Projetos', 
        duration: '8h', 
        topics: [
          { title: 'Visão geral do MS Project e conceitos PMBOK', powerpointUrl: 'https://file-examples.com/storage/fe52cb0c4862dc676a1b341/2017/08/file_example_PPT_250kB.ppt' }, 
          { title: 'Criação e configuração de um novo projeto (calendários, moeda)' }, 
          { title: 'Inserção de informações básicas do projeto', pdfUrl: '#' }
        ],
        assessment: {
          questions: [
            { question: 'Qual é a primeira etapa ao criar um novo projeto no MS Project?', type: 'multiple-choice', options: [{ value: 'Adicionar recursos' }, { value: 'Definir o calendário do projeto' }, { value: 'Listar as tarefas' }], correctAnswerIndex: 1 },
            { question: 'O que representa o PMBOK?', type: 'short-answer', shortAnswer: 'Um guia de boas práticas para a gestão de projetos.' }
          ]
        }
      }, 
      { 
        title: 'Módulo 2: Planeamento de Tarefas', 
        duration: '12h', 
        topics: [
          { title: 'Criação da Estrutura Analítica do Projeto (WBS)', videoUrl: 'https://www.youtube.com/watch?v=JVI31cP8pe8' }, 
          { title: 'Estimar durações e definir dependências ( predecessoras)' }, 
          { title: 'Trabalhar com tarefas recorrentes e marcos (milestones)', pdfUrl: '#' }, 
          { title: 'Identificação do Caminho Crítico' }
        ] 
      }, 
      { 
        title: 'Módulo 3: Gestão de Recursos e Custos', 
        duration: '12h', 
        topics: [
          { title: 'Criação da pool de recursos (trabalho, material, custo)' }, 
          { title: 'Atribuição de recursos às tarefas', videoUrl: 'https://www.youtube.com/watch?v=JVI31cP8pe8' }, 
          { title: 'Análise de superalocação e nivelamento de recursos' }, 
          { title: 'Inserção de custos e análise do orçamento', pdfUrl: '#' }
        ] 
      }, 
      { 
        title: 'Módulo 4: Controlo e Relatórios', 
        duration: '8h', 
        topics: [
          { title: 'Criação da Linha de Base (Baseline)' }, 
          { title: 'Atualização do progresso das tarefas (real vs. planeado)' }, 
          { title: 'Análise de valor agregado (Earned Value Analysis)', powerpointUrl: 'https://file-examples.com/storage/fe52cb0c4862dc676a1b341/2017/08/file_example_PPT_250kB.ppt' }, 
          { title: 'Criação de Relatórios e Dashboards personalizados' }
        ] 
      }
    ] 
  },
  { 
    id: 'EN-427', 
    name: 'Gestão de Projectos', 
    category: 'rh-gestao', 
    imageId: 'course-project-management', 
    status: 'Ativo',
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
      { title: 'Módulo 1: Introdução à Gestão de Projectos', duration: '10 h.', topics: [{title: 'O que é um projecto?'}, {title: 'O papel do Gestor de Projectos'}] }, 
      { title: 'Módulo 2: Iniciação e Planeamento', duration: '10 h.', topics: [{title: 'Elaboração do Project Charter'}, {title: 'Definição do escopo (WBS)'}, {title: 'Criação do cronograma e orçamento'}] }, 
      { title: 'Módulo 3: Execução e Controlo', duration: '10 h.', topics: [{title: 'Gestão da equipa do projecto'}, {title: 'Monitorização do progresso (KPIs)'}] }, 
      { title: 'Módulo 4: Encerramento e Metodologias', duration: '10 h.', topics: [{title: 'Entrega do projecto'}, {title: 'Lições aprendidas'}, {title: 'Introdução ao Scrum e Kanban'}] }] 
  },
  { 
    id: 'NE-74', 
    name: 'Power BI Microsoft', 
    category: 'informatica-it', 
    imageId: 'course-power-bi', 
    status: 'Ativo',
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
      { title: 'Módulo 1: Introdução ao Power BI', duration: '5 h.', topics: [{title: 'O que é o Power BI'}, {title: 'Instalação e interface'}] }, 
      { title: 'Módulo 2: Obter e Transformar Dados', duration: '10 h.', topics: [{title: 'Conectar a diferentes fontes'}, {title: 'Limpeza e transformação de dados'}] }, 
      { title: 'Módulo 3: Modelação de Dados e DAX', duration: '10 h.', topics: [{title: 'Criação de relacionamentos'}, {title: 'Introdução às funções DAX'}] }, 
      { title: 'Módulo 4: Visualização e Publicação', duration: '10 h.', topics: [{title: 'Criação de relatórios'}, {title: 'Publicação no Power BI Service'}] }] 
  },
  { 
    id: 'GE-003', 
    name: 'Gestão Emocional', 
    category: 'dev-pessoal', 
    imageId: 'course-emotional', 
    status: 'Ativo',
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
      { title: 'Módulo 1: Pilares da Inteligência Emocional', duration: '4 h.', topics: [{title: 'Definição e importância'}, {title: 'Autoconsciência emocional'}] }, 
      { title: 'Módulo 2: Autogestão', duration: '4 h.', topics: [{title: 'Controlo de impulsos'}, {title: 'Gestão do stress'}, {title: 'Automotivação'}] }, 
      { title: 'Módulo 3: Consciência Social', duration: '4 h.', topics: [{title: 'Empatia'}, {title: 'Consciência organizacional'}] }, 
      { title: 'Módulo 4: Gestão de Relacionamentos', duration: '4 h.', topics: [{title: 'Comunicação eficaz'}, {title: 'Influência e liderança'}] }] 
  }
];
