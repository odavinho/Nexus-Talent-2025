"use server";

import { aiResumeAnalysis, AIResumeAnalysisInput, AIResumeAnalysisOutput } from "@/ai/flows/ai-resume-analysis";
import { personalizedCourseRecommendations, PersonalizedCourseRecommendationsInput, PersonalizedCourseRecommendationsOutput } from "@/ai/flows/personalized-course-recommendations";
import { generateCourseContent, GenerateCourseContentInput, GenerateCourseContentOutput } from "@/ai/flows/generate-course-content";
import { generateVacancyContent, GenerateVacancyContentInput, GenerateVacancyContentOutput } from "@/ai/flows/generate-vacancy-content";
import { extractProfileFromResume, ExtractProfileFromResumeInput, ExtractProfileFromResumeOutput } from "@/ai/flows/extract-profile-from-resume";
import { generateAssessmentTest, GenerateAssessmentTestInput, GenerateAssessmentTestOutput } from "@/ai/flows/generate-assessment-test";
import { generateModuleAssessment, GenerateModuleAssessmentInput, GenerateModuleAssessmentOutput } from "@/ai/flows/generate-module-assessment";
import type { Course } from "@/lib/types";
import type { SiteData, ImagePlaceholder } from "@/lib/site-data";

import { revalidatePath } from "next/cache";
import { promises as fs } from 'fs';
import path from 'path';
import { addCourse } from "@/lib/course-service";

// AI Actions
export async function analyzeResumeAction(input: AIResumeAnalysisInput): Promise<AIResumeAnalysisOutput> {
    // The try-catch block is moved to the client component
    // to handle errors on a per-file basis during bulk analysis.
    const output = await aiResumeAnalysis(input);
    return output;
}

export async function extractProfileFromResumeAction(input: ExtractProfileFromResumeInput): Promise<ExtractProfileFromResumeOutput> {
    try {
      const output = await extractProfileFromResume(input);
      return output;
    } catch (error) {
      console.error("Error in extractProfileFromResumeAction:", error);
      throw new Error("Failed to extract profile from resume. Please try again.");
    }
  }

export async function getCourseRecommendationsAction(input: { userProfile: string }): Promise<PersonalizedCourseRecommendationsOutput> {
    // This action might need to be updated to fetch courses from Firestore in the future
    const courseCatalog: string[] = []; // Mocked for now
    
    const flowInput: PersonalizedCourseRecommendationsInput = {
        userProfile: input.userProfile,
        courseCatalog: courseCatalog.join('\n'),
    }

    try {
        const output = await personalizedCourseRecommendations(flowInput);
        return output;
    } catch (error) {
        console.error("Error in getCourseRecommendationsAction:", error);
        throw new Error("Failed to get course recommendations. Please try again.");
    }
}

export async function generateCourseContentAction(input: GenerateCourseContentInput): Promise<GenerateCourseContentOutput | null> {
    try {
        const output = await generateCourseContent(input);
        return output;
    } catch (error) {
        console.error("Error in generateCourseContentAction:", error);
        throw new Error("Failed to generate course content. Please try again.");
    }
}

export async function addCourseAction(course: Course): Promise<{ success: boolean; message: string; course?: Course }> {
    try {
        const newCourse = addCourse(course);
        // Revalidate paths where courses are listed to reflect the change
        revalidatePath('/courses');
        revalidatePath('/dashboard/admin/courses');
        return { success: true, message: 'Curso adicionado com sucesso!', course: newCourse };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao adicionar o curso.';
        console.error("Error in addCourseAction:", error);
        return { success: false, message };
    }
}


export async function generateVacancyContentAction(input: GenerateVacancyContentInput): Promise<GenerateVacancyContentOutput> {
    try {
        const output = await generateVacancyContent(input);
        return output!;
    } catch (error) {
        console.error("Error in generateVacancyContentAction:", error);
        throw new Error("Failed to generate vacancy content. Please try again.");
    }
}

export async function generateAssessmentTestAction(input: GenerateAssessmentTestInput): Promise<GenerateAssessmentTestOutput> {
    try {
      const output = await generateAssessmentTest(input);
      return output;
    } catch (error) {
      console.error("Error in generateAssessmentTestAction:", error);
      throw new Error("Failed to generate assessment test. Please try again.");
    }
  }

  export async function generateModuleAssessmentAction(input: GenerateModuleAssessmentInput): Promise<GenerateModuleAssessmentOutput> {
    try {
      const output = await generateModuleAssessment(input);
      return output;
    } catch (error) {
      console.error("Error in generateModuleAssessmentAction:", error);
      throw new Error("Failed to generate module assessment. Please try again.");
    }
  }


// JSON file actions
const getSiteDataFilePath = () => path.join(process.cwd(), 'src', 'lib', 'site-data.json');

export async function getSiteData(): Promise<SiteData> {
    try {
        const filePath = getSiteDataFilePath();
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading site data file:', error);
        // Return a default structure on error
        return { stats: [], images: [] };
    }
}

export async function updateSiteData(newData: SiteData): Promise<{ success: boolean; message: string }> {
    try {
        const filePath = getSiteDataFilePath();
        await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');
        revalidatePath('/dashboard/settings');
        revalidatePath('/'); // Revalidate home page as well
        return { success: true, message: 'Dados do site atualizados com sucesso!' };
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Falha ao atualizar dados do site.';
        return { success: false, message };
    }
}


export async function addImageAction(image: ImagePlaceholder): Promise<{ success: boolean; message: string }> {
    try {
        const data = await getSiteData();
        if (data.images.some(p => p.id === image.id)) {
            return { success: false, message: 'Já existe um item com este ID.' };
        }
        data.images.push(image);
        await updateSiteData(data);
        return { success: true, message: 'Item adicionado com sucesso!' };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Falha ao adicionar item.' };
    }
}

export async function updateImageAction(image: ImagePlaceholder): Promise<{ success: boolean; message: string }> {
    try {
        const data = await getSiteData();
        const index = data.images.findIndex(p => p.id === image.id);
        if (index === -1) {
            return { success: false, message: 'Item não encontrado.' };
        }
        data.images[index] = image;
        await updateSiteData(data);
        return { success: true, message: 'Item atualizado com sucesso!' };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Falha ao atualizar item.' };
    }
}

export async function deleteImageAction(id: string): Promise<{ success: boolean; message: string }> {
    try {
        const data = await getSiteData();
        const initialLength = data.images.length;
        data.images = data.images.filter(p => p.id !== id);
        if (data.images.length === initialLength) {
            return { success: false, message: 'Item não encontrado para exclusão.' };
        }
        await updateSiteData(data);
        return { success: true, message: 'Item excluído com sucesso!' };
    } catch (error) {
        return { success: false, message: error instanceof Error ? error.message : 'Falha ao excluir item.' };
    }
}