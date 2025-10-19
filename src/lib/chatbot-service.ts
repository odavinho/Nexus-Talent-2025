import { getCourses } from './course-service';
import { getVacancies } from './vacancy-service';

export function searchCourses(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    const allCourses = getCourses();
    
    const filtered = allCourses.filter(course => 
        course.name.toLowerCase().includes(lowerCaseQuery) ||
        course.generalObjective.toLowerCase().includes(lowerCaseQuery) ||
        course.category.toLowerCase().includes(lowerCaseQuery)
    );

    return filtered.slice(0, 5).map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        format: c.format,
        generalObjective: c.generalObjective.substring(0, 100) + '...',
    }));
}

export function searchVacancies(query: string) {
    const lowerCaseQuery = query.toLowerCase();
    const allVacancies = getVacancies(); // Get only active vacancies

    const filtered = allVacancies.filter(vacancy =>
        vacancy.title.toLowerCase().includes(lowerCaseQuery) ||
        vacancy.description.toLowerCase().includes(lowerCaseQuery) ||
        vacancy.location.toLowerCase().includes(lowerCaseQuery) ||
        vacancy.category.toLowerCase().includes(lowerCaseQuery)
    );
    
    return filtered.slice(0, 5).map(v => ({
        id: v.id,
        title: v.title,
        location: v.location,
        type: v.type,
        description: v.description.substring(0, 100) + '...',
    }));
}
