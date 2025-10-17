import { z } from "zod";

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
    