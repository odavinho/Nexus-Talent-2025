'use client';

import { useState, useMemo, useEffect } from 'react';
import { getVacancies } from '@/lib/vacancy-service';
import { getCourseCategories } from '@/lib/course-service';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, List, LayoutGrid } from 'lucide-react';
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

type ViewMode = 'list' | 'grid';

export function VacancyList() {
  const [allVacancies, setAllVacancies] = useState<Vacancy[]>([]);
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');


  useEffect(() => {
    // Fetch all vacancies, including expired ones, to display them with a badge.
    setAllVacancies(getVacancies(true)); 
    setCourseCategories(getCourseCategories());
    const storedView = localStorage.getItem('vacancy-view-mode') as ViewMode;
    if (storedView) {
        setViewMode(storedView);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('vacancy-view-mode', viewMode);
  }, [viewMode]);

  const locations = useMemo(() => ['all', ...new Set(allVacancies.map(v => v.location))], [allVacancies]);
  const contractTypes = useMemo(() => ['all', 'Full-time', 'Part-time', 'Remote'], []);


  const filteredVacancies = useMemo(() => {
    return allVacancies.filter(vacancy => {
      const matchesCategory = selectedCategory === 'all' || vacancy.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || vacancy.location === selectedLocation;
      const matchesType = selectedType === 'all' || vacancy.type === selectedType;
      const matchesSearch = vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) || vacancy.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch && matchesLocation && matchesType;
    });
  }, [allVacancies, searchTerm, selectedCategory, selectedLocation, selectedType]);

  const VacancyCard = ({ vacancy }: { vacancy: Vacancy }) => {
    const category = courseCategories.find(c => c.name === vacancy.category);
    const closingDate = toDate(vacancy.closingDate);
    const isExpired = closingDate ? closingDate < new Date() : false;

    if (viewMode === 'grid') {
      return (
        <Card className={cn("transition-shadow hover:shadow-md h-full flex flex-col", isExpired && "bg-muted/50")}>
            <CardHeader>
                {category && <Badge variant="secondary" className='mb-2 self-start'>{category.name}</Badge>}
                <CardTitle className="font-headline text-xl flex-grow"><Link href={`/recruitment/${vacancy.id}`} className="hover:text-primary">{vacancy.title}</Link></CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between flex-grow">
                <div className='space-y-2 mb-4'>
                    <span className='flex items-center gap-2 text-sm'><MapPin size={14}/> {vacancy.location}</span>
                    <span className='flex items-center gap-2 text-sm'><Briefcase size={14}/> {vacancy.type}</span>
                </div>
                <div className="flex items-center gap-2">
                    {isExpired && <Badge variant="destructive">Expirado</Badge>}
                    <Button asChild disabled={isExpired} className="w-full">
                        <Link href={`/recruitment/${vacancy.id}`}>Ver Detalhes</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
      );
    }
    
    // List view card
    return (
      <Card className={cn("transition-shadow hover:shadow-md", isExpired && "bg-muted/50")}>
          <div className="p-6 grid md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2">
                  {category && <Badge variant="secondary" className='mb-2'>{category.name}</Badge>}
                  <h3 className="font-headline text-xl font-semibold"><Link href={`/recruitment/${vacancy.id}`} className="hover:text-primary">{vacancy.title}</Link></h3>
                  <div className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-sm text-muted-foreground'>
                      <span className='flex items-center gap-2'><MapPin size={14}/> {vacancy.location}</span>
                      <span className='flex items-center gap-2'><Briefcase size={14}/> {vacancy.type}</span>
                  </div>
              </div>
              <div className="flex md:flex-col md:items-end md:justify-center gap-2">
                   {isExpired && <Badge variant="destructive">Expirado</Badge>}
                   <Button asChild disabled={isExpired}>
                      <Link href={`/recruitment/${vacancy.id}`}>Ver Detalhes</Link>
                   </Button>
              </div>
          </div>
      </Card>
    )
  };


  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-16 bg-background/95 py-4 z-10 backdrop-blur-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cargo, palavra-chave..."
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
         <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Tipo de contrato" />
            </SelectTrigger>
            <SelectContent>
                {contractTypes.map(type => (
                <SelectItem key={type} value={type}>
                    {type === 'all' ? 'Todos os Contratos' : type}
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
      
       <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-muted-foreground">{filteredVacancies.length} empregos encontrados</p>
            <div className="flex items-center gap-2">
                <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                    <List className="h-5 w-5" />
                </Button>
                 <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                    <LayoutGrid className="h-5 w-5" />
                </Button>
            </div>
        </div>


      {filteredVacancies.length > 0 ? (
        <div className={cn(viewMode === 'list' ? "space-y-4" : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6")}>
          {filteredVacancies.map(vacancy => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold">Nenhum emprego encontrado.</p>
          <p className="text-muted-foreground mt-2">Tente ajustar a sua busca ou filtros.</p>
        </div>
      )}
    </div>
  );
}
