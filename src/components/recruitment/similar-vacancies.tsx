'use client';
import React, { useEffect, useState } from 'react';
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import type { JobPosting } from '@/lib/types';
import { getJobs } from '@/lib/vacancy-service';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import Link from 'next/link';
import { MapPin, Briefcase } from 'lucide-react';
import { Badge } from '../ui/badge';


interface SimilarJobsProps {
    currentJob: JobPosting;
}

export function SimilarVacancies({ currentJob }: SimilarJobsProps) {
    const [similarJobs, setSimilarJobs] = useState<JobPosting[]>([]);
    
    useEffect(() => {
        const allJobs = getJobs(); // Get active jobs
        const related = allJobs.filter(v => v.category === currentJob.category && v.id !== currentJob.id).slice(0, 8);
        setSimilarJobs(related);
    }, [currentJob]);

    if (similarJobs.length === 0) {
        return null;
    }

    return (
        <div className="py-16 bg-secondary">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-headline text-3xl font-bold text-center mb-10">Empregos Semelhantes</h2>
                 <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent>
                        {similarJobs.map((job) => (
                        <CarouselItem key={job.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <Card className="h-full">
                                    <CardHeader>
                                        <CardTitle className="font-headline text-lg line-clamp-2 hover:text-primary">
                                            <Link href={`/recruitment/${job.id}`}>{job.title}</Link>
                                        </CardTitle>
                                        <CardDescription className='flex flex-wrap items-center gap-x-3 gap-y-1 pt-1'>
                                            <span className='flex items-center gap-1.5'><MapPin size={14}/> {job.location}</span>
                                            <span className='flex items-center gap-1.5'><Briefcase size={14}/> {job.type}</span>
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </div>
    );
}
