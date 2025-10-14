'use client';

import { useState, useMemo, useEffect } from 'react';
import { getVacancies } from '@/lib/vacancy-service';
import { getCourseCategories } from '@/lib/course-service';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import Link from 'next/link';
import type { Vacancy, CourseCategory } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';


const toDate = (date: Timestamp | Date | undefined): Date | null => {
    if (!date) return null;
    if (date instanceof Timestamp) {
        return date.toDate();
    }
    return date;
}

export function VacancyList() {
  const [allVacancies, setAllVacancies] = useState<Vacancy[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  useEffect(() => {
    // Fetch all vacancies, including expired ones, to display them with a badge.
    setAllVacancies(getVacancies(true)); 
    setCourseCategories(getCourseCategories());
  }, []);

  const locations = useMemo(() => ['all', ...new Set(allVacancies.map(v => v.location))], [allVacancies]);

  const filteredVacancies = useMemo(() => {
    return allVacancies.filter(vacancy => {
      const matchesCategory = selectedCategory === 'all' || vacancy.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || vacancy.location === selectedLocation;
      const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) || vacancy.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && matchesLocation;
    });
  }, [allVacancies, searchTerm, selectedCategory, selectedLocation]);

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-16 bg-background/95 py-4 z-10 backdrop-blur-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por cargo ou palavra-chave..."
            className="pl-10 h-12"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className='md:w-1/4'>
         <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Selecionar categoria" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {courseCategories.map(category => (
                <SelectItem key={category.id} value={category.name}>
                    {category.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        <div className='md:w-1/4'>
         <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Selecionar localidade" />
            </SelectTrigger>
            <SelectContent>
                {locations.map(location => (
                <SelectItem key={location} value={location}>
                    {location === 'all' ? 'Todas as Localidades' : location}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>

      {filteredVacancies.length > 0 ? (
        <div className="space-y-6">
          {filteredVacancies.map(vacancy => {
              const category = courseCategories.find(c => c.name === vacancy.category);
              const closingDate = toDate(vacancy.closingDate);
              const isExpired = closingDate ? closingDate < new Date() : false;

              return (
                <Card key={vacancy.id} className={cn("transition-shadow hover:shadow-md", isExpired && "bg-muted/50")}>
                    <CardHeader>
                        <div className='flex justify-between items-start gap-4'>
                            <div>
                                {category && <Badge variant="secondary" className='mb-2'>{category.name}</Badge>}
                                <CardTitle className="font-headline text-xl">{vacancy.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-2">
                                {isExpired && <Badge variant="destructive">Expirado</Badge>}
                                <Button asChild disabled={isExpired}>
                                    <Link href={`/recruitment/${vacancy.id}`}>Ver Detalhes</Link>
                                </Button>
                             </div>
                        </div>
                        <CardDescription className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-2'>
                            <span className='flex items-center gap-2'><MapPin size={14}/> {vacancy.location}</span>
                            <span className='flex items-center gap-2'><Briefcase size={14}/> {vacancy.type}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className='text-muted-foreground line-clamp-2'>{vacancy.description}</p>
                    </CardContent>
                </Card>
              )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold">Nenhuma vaga encontrada.</p>
          <p className="text-muted-foreground mt-2">Tente ajustar sua busca ou filtros.</p>
        </div>
      )}
    </div>
  );
}
