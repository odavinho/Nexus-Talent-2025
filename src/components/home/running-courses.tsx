'use client';
import React, { useEffect, useState } from 'react';
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel"
import { getImages } from "@/lib/site-data";
import { getCourses } from '@/lib/course-service';
import Image from 'next/image';
import { Card } from '../ui/card';
import Link from 'next/link';
import type { Course } from '@/lib/types';


export function RunningCourses() {
    const plugin = React.useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    )
    const [runningCourses, setRunningCourses] = useState<Course[]>([]);

    useEffect(() => {
        const allCourses = getCourses();
        const runningCourseIds = ['TA-001', 'LMP-006', 'EN-427', 'NE-74', 'GC-002', 'GE-003'];
        setRunningCourses(allCourses.filter(course => runningCourseIds.includes(course.id)));
    }, []);

    const images = getImages();

    return (
        <section className="py-16 sm:py-24 bg-card">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">
                        Cursos a decorrer
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                        Junte-se aos nossos cursos atualmente a decorrer e comece a aprender hoje mesmo.
                    </p>
                </div>
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                >
                    <CarouselContent>
                        {runningCourses.map((course, index) => {
                             const image = images.find(p => p.id === course.imageId);
                             return (
                                <CarouselItem key={index} className="md:basis-1/3">
                                    <div className="p-1">
                                    <Link href={`/courses/${course.id}`} className="group">
                                        <Card className="overflow-hidden relative">
                                            {image && (
                                                <div className="relative h-48 w-full">
                                                    <Image 
                                                        src={image.imageUrl} 
                                                        alt={image.description} 
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105" 
                                                    />
                                                     <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
                                                     <div className="absolute bottom-0 left-0 p-4">
                                                        <h3 className="font-headline text-lg font-bold text-white">{course.name}</h3>
                                                     </div>
                                                </div>
                                            )}
                                        </Card>
                                     </Link>
                                    </div>
                                </CarouselItem>
                             )
                        })}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    )
}
