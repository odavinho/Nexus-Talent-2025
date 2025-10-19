
import { getCourseById, getCourses } from "@/lib/course-service";
import { notFound } from "next/navigation";
import type { Metadata } from 'next';
import { CourseDetailClientPage } from "@/components/courses/course-detail-client-page";

// This function now runs on the server
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const course = getCourseById(params.id);

  if (!course) {
    return {
      title: 'Curso não encontrado',
      description: 'O curso que você está procurando não existe.',
    };
  }

  return {
    title: `${course.name} | Cursos NexusTalent`,
    description: course.generalObjective,
  };
}

export function generateStaticParams() {
  const courses = getCourses();
  return courses.map((course) => ({
    id: course.id,
  }));
}

export default function CourseDetailPage({ params }: { params: { id: string }}) {
  const course = getCourseById(params.id);

  if (!course) {
    notFound();
  }
  
  return <CourseDetailClientPage course={course} />;
}
