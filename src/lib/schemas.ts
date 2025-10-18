import { z } from "zod";

// Schema for AI Resume Analysis
export const AIResumeAnalysisInputSchema = z.object({
  jobDescription: z.string().describe("The full job description for which the resume is being analyzed."),
  resumeDataUri: z.string().describe("The resume file content as a data URI."),
});

export const AIResumeAnalysisOutputSchema = z.object({
  candidateRanking: z.number().describe("The candidate's ranking on a scale of 1-100 based on the job description."),
  candidateSummary: z.string().describe("A summary of the candidate's profile and qualifications."),
  keySkillsMatch: z.string().describe("A list or description of key skills that match the job requirements."),
  areasForImprovement: z.string().describe("Areas where the candidate could improve to better fit the role."),
});

export type AIResumeAnalysisInput = z.infer<typeof AIResumeAnalysisInputSchema>;
export type AIResumeAnalysisOutput = z.infer<typeof AIResumeAnalysisOutputSchema>;


// Schema for Personalized Course Recommendations
export const PersonalizedCourseRecommendationsInputSchema = z.object({
  userProfile: z.string().describe("A description of the user's interests, career goals, and current skills."),
  courseCatalog: z.string().describe("A list of available courses."),
});

export const PersonalizedCourseRecommendationsOutputSchema = z.object({
  recommendedCourses: z.string().describe("A detailed recommendation of courses, learning tracks, and potential improvements for the user."),
});

export type PersonalizedCourseRecommendationsInput = z.infer<typeof PersonalizedCourseRecommendationsInputSchema>;
export type PersonalizedCourseRecommendationsOutput = z.infer<typeof PersonalizedCourseRecommendationsOutputSchema>;

// Schema for Course Content Generation
export const GenerateCourseContentInputSchema = z.object({
    courseName: z.string().describe("The name of the course."),
    courseCategory: z.string().describe("The category of the course."),
    courseLevel: z.string().describe("The level of the course (e.g., beginner, intermediate, advanced)."),
});

export const GenerateCourseContentOutputSchema = z.object({
    courseId: z.string().describe("A unique ID for the course (e.g., 'XY-123')."),
    generalObjective: z.string().describe("The general objective of the course."),
    whatYouWillLearn: z.array(z.string()).describe("A list of specific learning outcomes."),
    modules: z.array(z.object({
        title: z.string(),
        topics: z.array(z.string()),
    })).describe("A list of modules, each with a title and a list of topics."),
    duration: z.string().describe("The total duration of the course in hours."),
    imageHint: z.string().describe("A short hint (1-2 words) for an AI image generator."),
    imageDataUri: z.string().describe("A data URI for the generated course image.").optional(),
});

export type GenerateCourseContentInput = z.infer<typeof GenerateCourseContentInputSchema>;
export type GenerateCourseContentOutput = z.infer<typeof GenerateCourseContentOutputSchema>;


// Schema for Vacancy Content Generation
export const GenerateVacancyContentInputSchema = z.object({
    title: z.string().describe("The title of the job vacancy."),
    category: z.string().describe("The category of the job."),
    industry: z.string().describe("The industry for the job."),
    minExperience: z.string().describe("The minimum experience required for the job (e.g., 0-1 ano, 3-5 anos)."),
    demandLevel: z.string().describe("The seniority or demand level for the job (e.g., Júnior, Pleno, Sénior)."),
});

export const GenerateVacancyContentOutputSchema = z.object({
    description: z.string().describe("A general summary of the job vacancy."),
    responsibilities: z.array(z.string()).describe("A list of key responsibilities."),
    requirements: z.array(z.string()).describe("A list of required qualifications and skills."),
    aiScreeningQuestions: z.array(z.string()).describe("A list of 3-5 open-ended screening questions for the candidate, suggested by AI."),
});

export type GenerateVacancyContentInput = z.infer<typeof GenerateVacancyContentInputSchema>;
export type GenerateVacancyContentOutput = z.infer<typeof GenerateVacancyContentOutputSchema>;


// Schema for Extracting Profile from Resume
export const ExtractProfileFromResumeInputSchema = z.object({
  resumeDataUri: z.string().describe("The resume file content as a data URI."),
});

export const ExtractProfileFromResumeOutputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  academicTitle: z.string().optional(),
  nationality: z.string().optional(),
  yearsOfExperience: z.coerce.number().optional(),
  functionalArea: z.string().optional(),
  skills: z.array(z.string()).optional(),
  academicHistory: z.array(z.object({
      institution: z.string(),
      degree: z.string(),
      year: z.string(),
  })).optional(),
  workExperience: z.array(z.object({
      company: z.string(),
      role: z.string(),
      period: z.string(),
      description: z.string().optional(),
  })).optional(),
});

export type ExtractProfileFromResumeInput = z.infer<typeof ExtractProfileFromResumeInputSchema>;
export type ExtractProfileFromResumeOutput = z.infer<typeof ExtractProfileFromResumeOutputSchema>;


// Schemas for Assessment Test Generation
const QuestionSchema = z.object({
    id: z.string().describe("A unique ID for the question (e.g., 'q1')."),
    question: z.string().describe('The text of the question.'),
    type: z.enum(['multiple-choice', 'short-answer', 'psychometric']).describe('The type of the question.'),
    options: z.array(z.string()).optional().describe('A list of 4 options for multiple-choice questions.'),
});
  
export const GenerateAssessmentTestInputSchema = z.object({
    jobDescription: z.string().describe('The full job description for the vacancy.'),
    testType: z.enum(['knowledge', 'psychometric']).describe('The type of test to generate.'),
    numMultipleChoice: z.coerce.number().describe('The number of multiple-choice questions.'),
    numShortAnswer: z.coerce.number().describe('The number of short-answer questions.'),
});

export const GenerateAssessmentTestOutputSchema = z.object({
    id: z.string().describe("A unique ID for the test (e.g., 'test-123')."),
    title: z.string().describe('A concise and relevant title for the generated test.'),
    questions: z.array(QuestionSchema).describe('The list of generated questions.'),
});

export type GenerateAssessmentTestInput = z.infer<typeof GenerateAssessmentTestInputSchema>;
export type GenerateAssessmentTestOutput = z.infer<typeof GenerateAssessmentTestOutputSchema>;


// Schemas for Module Assessment Generation
export const GenerateModuleAssessmentInputSchema = z.object({
    moduleTitle: z.string().describe('The title of the course module.'),
    topics: z.array(z.string()).describe('A list of topics covered in the module.'),
    numMultipleChoice: z.coerce.number().int().describe('The number of multiple-choice questions.'),
    numShortAnswer: z.coerce.number().int().describe('The number of short-answer questions.'),
    level: z.enum(['Fácil', 'Médio', 'Difícil']).describe('The difficulty level of the test.'),
});

const ModuleQuestionSchema = z.object({
    question: z.string().min(1, "A pergunta não pode estar em branco."),
    type: z.enum(['multiple-choice', 'short-answer']),
    options: z.array(z.string()).optional(),
    correctAnswerIndex: z.coerce.number().optional(),
    shortAnswer: z.string().optional(),
});
  
export const GenerateModuleAssessmentOutputSchema = z.object({
    questions: z.array(ModuleQuestionSchema).describe('The list of generated questions for the module quiz.'),
});

export type GenerateModuleAssessmentInput = z.infer<typeof GenerateModuleAssessmentInputSchema>;
export type GenerateModuleAssessmentOutput = z.infer<typeof GenerateModuleAssessmentOutputSchema>;


// Zod schema for the form in the UI, which uses a different structure for options
export const ModuleAssessmentFormSchema = z.object({
    questions: z.array(z.object({
        question: z.string().min(1, "A pergunta não pode estar em branco."),
        type: z.enum(['multiple-choice', 'short-answer']),
        options: z.array(z.object({ value: z.string().min(1, "A opção não pode estar em branco.") })).optional(),
        correctAnswerIndex: z.coerce.number().optional(),
        shortAnswer: z.string().optional(),
    })),
});

export type ModuleAssessmentFormValues = z.infer<typeof ModuleAssessmentFormSchema>;

// Schemas for Email Campaign Generation
export const GenerateEmailCampaignInputSchema = z.object({
  targetAudience: z.string().describe("The target audience for the email (e.g., 'Todos os candidatos', 'Engenheiros de Software')."),
  emailGoal: z.string().min(10, "O objetivo do e-mail deve ter pelo menos 10 caracteres.").describe("The primary goal of the email campaign (e.g., 'Anunciar novo curso de liderança')."),
  tone: z.enum(['Profissional', 'Amigável', 'Urgente']).describe("The desired tone for the email content."),
  layoutType: z.enum(['Texto com Botão', 'Imagem, Título e Botão']).describe("The visual layout of the email."),
  ctaLink: z.string().url("Por favor, insira um URL válido.").describe("The link for the main call-to-action button."),
  imageUrl: z.string().url("Por favor, insira um URL de imagem válido.").optional().describe("The URL for the main image in the email, if applicable."),
});

export const GenerateEmailCampaignOutputSchema = z.object({
  subject: z.string().describe("The generated subject line for the email."),
  body: z.string().describe("The generated HTML body content for the email."),
});

export type GenerateEmailCampaignInput = z.infer<typeof GenerateEmailCampaignInputSchema>;
export type GenerateEmailCampaignOutput = z.infer<typeof GenerateEmailCampaignOutputSchema>;
