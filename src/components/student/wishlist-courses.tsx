'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '@/hooks/use-wishlist.tsx';
import { getCourses } from '@/lib/course-service';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Loader2 } from 'lucide-react';
import { CourseCard } from '../courses/course-card';

export function WishlistCourses() {
  const { wishlist, isLoading: isWishlistLoading } = useWishlist();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const allCourses = getCourses();
    const wishlistCourses = allCourses.filter(course => wishlist.includes(course.id));
    setCourses(wishlistCourses);
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

    if (courses.length === 0) {
      return (
        <p className="text-sm text-muted-foreground p-4 text-center">
          A sua lista de interesses está vazia. Clique no ícone de coração nos cursos para os adicionar aqui.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="text-red-500" />
          Meus Cursos de Interesse
        </CardTitle>
        <CardDescription>
          Os cursos que você marcou como favoritos.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
