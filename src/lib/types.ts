import type { Timestamp } from 'firebase/firestore';

export interface ModuleQuestion {
  question: string;
  type: 'multiple-choice' | 'short-answer';
  options?: { value: string }[];
  correctAnswerIndex?: number;
  shortAnswer?: string;
}

export interface ModuleAssessment {
  questions: ModuleQuestion[];
}

export interface CourseModule {
  title: string;
  topics: string[];
  videoUrl?: string;
  assessment?: ModuleAssessment;
}

export interface Course {
    id: string;
    name: string;
    category: string;
    imageId: string;
    imageDataUri?: string; // New field for the generated image
    duration: string;
    format: 'Online' | 'Presencial' | 'Híbrido';
    generalObjective: string;
    whatYouWillLearn: string[];
    modules: CourseModule[];
  }
  
  export interface CourseCategory {
    id: string;
    name: string;
  }

  export interface ScreeningQuestion {
    question: string;
    requiredAnswer: 'sim' | 'nao';
  }

  export interface Vacancy {
    id: string;
    title: string;
    location: string;
    type: 'Full-time' | 'Part-time' | 'Remote';
    category: string;
    description: string;
    recruiterId: string;
    postedDate: Timestamp | Date; // Allow Date for mock data
    closingDate?: Timestamp | Date;
    responsibilities: string[];
    requirements: string[];
    aiScreeningQuestions?: string[];
    screeningQuestions?: ScreeningQuestion[];
    industry?: string;
    minExperience?: string;
    numberOfVacancies?: number;
    requiredNationality?: string;
    languages?: string[];
    salaryRange?: string;
    showSalary?: boolean;
    employerName?: string;
    aboutEmployer?: string;
    hideEmployerData?: boolean;
    minEducationLevel?: EducationLevel;
  }
  
  export type ApplicationStatus = 'Recebida' | 'Triagem' | 'Teste' | 'Entrevista' | 'Oferta' | 'Contratado' | 'Rejeitada';

  export interface Application {
    id: string;
    userId: string;
    jobPostingId: string;
    applicationDate: Timestamp | Date; // Allow Date for mock data
    status: ApplicationStatus;
    notes?: string;
  }

  export interface AcademicHistory {
    institution: string;
    degree: string;
    year: string;
  }

  export interface WorkExperience {
    company: string;
    role: string;
    period: string;
    description?: string;
  }

  export interface Certification {
    name: string;
    issuingOrganization: string;
    year: string;
  }

  export type EducationLevel = 'Ensino Primário' | 'Ensino Médio' | 'Frequência Universitária' | 'Licenciatura' | 'Mestrado' | 'Doutoramento';

  export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    userType: 'student' | 'instructor' | 'admin' | 'recruiter';
    profilePictureUrl?: string;
    summary?: string;
    resumeUrl?: string;
    academicTitle?: string;
    nationality?: string;
    cidade?: string;
    dateOfBirth?: string; // Format "YYYY-MM-DD"
    gender?: 'Masculino' | 'Feminino';
    languages?: string[];
    educationLevel?: EducationLevel;
    yearsOfExperience?: number;
    functionalArea?: string;
    subFunctionalArea?: string;
    skills?: string[];
    professionalLevel?: 'Estagiário / Júnior' | 'Pleno' | 'Sénior' | 'Especialista / Liderança';
    academicHistory?: AcademicHistory[];
    workExperience?: WorkExperience[];
    certifications?: Certification[];
    // Notification preferences
    receivesNotifications?: boolean;
    receivesJobAlerts?: boolean;
  }
  
  export interface AssessmentQuestion {
    id: string;
    question: string;
    type: 'multiple-choice' | 'short-answer' | 'psychometric';
    options?: string[];
  }
  
  export interface AssessmentTest {
    id?: string;
    title: string;
    questions: AssessmentQuestion[];
  }

  // Types for generate-course-content flow
  export interface GenerateCourseContentInput {
    courseName: string;
    courseCategory: string;
    courseLevel: string;
  }

  export interface GenerateCourseContentOutput {
      courseId: string;
      generalObjective: string;
      whatYouWillLearn: string[];
      modules: Array<{
          title: string;
          topics: string[];
      }>;
      duration: string;
      imageHint: string;
      imageDataUri?: string;
  }

  export interface EmailCampaign {
    id: string;
    subject: string;
    body: string;
    targetAudience: string;
    sentDate: Date;
  }
