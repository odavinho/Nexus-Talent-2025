import { courses as initialCourses } from './courses';
import { courseCategories as allCourseCategories } from './courses';
import type { Course, CourseCategory } from './types';

// In-memory store for courses, acting as a cache for localStorage
let courses: Course[] | null = null;
const COURSES_STORAGE_KEY = 'nexus-talent-courses';

const loadCourses = (): Course[] => {
    // If cache is populated, return it
    if (courses) {
        return courses;
    }

    // If running on server, return initial data
    if (typeof window === 'undefined') {
        return initialCourses;
    }
    
    try {
        const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
        if (storedCourses) {
            // Parse stored data and populate cache
            courses = JSON.parse(storedCourses);
            return courses!;
        } else {
            // No stored data, use initial data and populate cache
            courses = [...initialCourses];
            localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
            return courses;
        }
    } catch (error) {
        console.error("Failed to load courses from localStorage, using initial data:", error);
        // On error, fallback to initial data
        courses = [...initialCourses];
        return courses;
    }
};

const saveCourses = (newCourses: Course[]): void => {
    courses = newCourses;
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(newCourses));
        } catch (error) {
            console.error("Failed to save courses to localStorage:", error);
        }
    }
};


// Function to get all courses
export const getCourses = (): Course[] => {
    const allCourses = loadCourses();
    return [...allCourses].sort((a, b) => a.name.localeCompare(b.name));
};

// Function to get all course categories
export const getCourseCategories = (): CourseCategory[] => {
    return [...allCourseCategories];
};

// Function to find a single course by ID
export const getCourseById = (id: string): Course | undefined => {
    const allCourses = loadCourses();
    return allCourses.find(c => c.id === id);
};

// Function to add a new course
export const addCourse = (courseData: Course): Course => {
    const currentCourses = getCourses();
    
    // Ensure no duplicate IDs
    if (currentCourses.some(c => c.id === courseData.id)) {
        // If ID exists, update it instead of adding a duplicate
        return updateCourse(courseData.id, courseData) || courseData;
    } else {
       const newCourses = [courseData, ...currentCourses];
       saveCourses(newCourses);
    }
    return courseData;
};

// Function to update an existing course
export const updateCourse = (id: string, updatedData: Partial<Course>): Course | null => {
    const currentCourses = getCourses();
    const courseIndex = currentCourses.findIndex(c => c.id === id);
    if (courseIndex === -1) {
        return null; // Course not found
    }

    const updatedCourse: Course = {
        ...currentCourses[courseIndex],
        ...updatedData,
        id: id // ensure id is not lost
    };
    
    currentCourses[courseIndex] = updatedCourse;
    saveCourses(currentCourses);
    
    return updatedCourse;
}

// Function to delete a course
export const deleteCourse = (id: string): void => {
    const currentCourses = getCourses();
    const newCourses = currentCourses.filter(c => c.id !== id);
    saveCourses(newCourses);
};
