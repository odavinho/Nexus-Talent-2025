
import { getJobById, getJobs } from "@/lib/vacancy-service";
import { notFound } from "next/navigation";
import type { JobPosting } from "@/lib/types";
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
  const job = getJobById(params.id);

  if (!job) {
    return {
      title: 'Emprego não encontrado',
      description: 'O emprego que você está procurando não existe.',
    };
  }

  return {
    title: `${job.title} | Empregos NexusTalent`,
    description: job.description.substring(0, 160),
  };
}

export function generateStaticParams() {
    const jobs = getJobs();
    return jobs.map((job) => ({
      id: job.id,
    }));
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const job = getJobById(id);

  if (!job) {
    notFound();
  }

  // Create a serializable version of the job object
  const serializableJob = {
    ...job,
    postedDate: toSerializableDate(job.postedDate),
    closingDate: toSerializableDate(job.closingDate),
  };

  return <VacancyClientPage vacancy={serializableJob as any} />;
}
