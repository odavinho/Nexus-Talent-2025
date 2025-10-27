'use client';

import { useEffect, useState } from 'react';
import { useJobWishlist } from '@/hooks/use-job-wishlist';
import { getJobs } from '@/lib/vacancy-service';
import type { JobPosting } from '@/lib/types';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';

export function WishlistJobs() {
  const { wishlist, isLoading: isWishlistLoading } = useJobWishlist();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get all jobs to be able to find any job by id, regardless of its status
    const allJobs = getJobs(true);
    const wishlistJobs = allJobs.filter(job => wishlist.includes(job.id));
    setJobs(wishlistJobs);
    setIsLoading(false);
  }, [wishlist]);

  const renderContent = () => {
    if (isWishlistLoading || isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <p className="text-sm text-muted-foreground p-4 text-center">
          A sua lista de empregos guardados está vazia. Clique no ícone de coração (♡) nos anúncios para os adicionar aqui.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {jobs.map(job => (
           <Link href={`/recruitment/${job.id}`} key={job.id} className="block p-3 border rounded-md hover:bg-secondary">
                <p className="font-semibold text-sm">{job.title}</p>
                <p className="text-xs text-muted-foreground">{job.location}</p>
            </Link>
        ))}
      </div>
    );
  };

  return (
    <>
      {renderContent()}
    </>
  );
}
