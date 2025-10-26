
import { getVacancyById, getVacancies } from "@/lib/vacancy-service";
import { notFound } from "next/navigation";
import type { Vacancy } from "@/lib/types";
import { type Metadata } from 'next';
import { VacancyClientPage } from "@/app/recruitment/[id]/page";
import { Timestamp } from "firebase/firestore";

// Helper to convert Timestamp to a serializable format (string)
const toSerializableDate = (date: Timestamp | Date | undefined): string | null => {
    if (!date) return null;
    if (date instanceof Timestamp) {
      return date.toDate().toISOString();
    }
    return date.toISOString();
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const vacancy = getVacancyById(params.id);

  if (!vacancy) {
    return {
      title: 'Vaga não encontrada',
      description: 'A vaga de emprego que você está procurando não existe.',
    };
  }

  return {
    title: `${vacancy.title} | Vagas NexusTalent`,
    description: vacancy.description.substring(0, 160),
  };
}

export function generateStaticParams() {
    const vacancies = getVacancies();
    return vacancies.map((vacancy) => ({
      id: vacancy.id,
    }));
}

export default function VacancyDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const vacancy = getVacancyById(id);

  if (!vacancy) {
    notFound();
  }

  // Create a serializable version of the vacancy object
  const serializableVacancy = {
    ...vacancy,
    postedDate: toSerializableDate(vacancy.postedDate),
    closingDate: toSerializableDate(vacancy.closingDate),
  };

  return <VacancyClientPage vacancy={serializableVacancy as any} />;
}
