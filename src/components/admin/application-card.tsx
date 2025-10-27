'use client';

import type { Application, JobPosting, UserProfile, ApplicationStatus } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Briefcase, User, Calendar, Download, ThumbsUp, ThumbsDown } from 'lucide-react';
import { vacancies } from '@/lib/vacancies';
import { formatDistanceToNow } from 'date-fns';
import { pt } from 'date-fns/locale';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { users } from '@/lib/users'; // Using mock users

interface ApplicationCardProps {
    application: Application;
    onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
}

const UserInfo = ({ userId, onUserLoad }: { userId: string, onUserLoad: (user: UserProfile) => void }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const foundUser = users.find(u => u.id === userId);
        setUser(foundUser || null);
        if (foundUser) {
            onUserLoad(foundUser);
        }
        setIsLoading(false);
    }, [userId, onUserLoad]);


    if (isLoading) {
        return <Skeleton className="h-5 w-3/4" />;
    }

    if (!user) {
        return <p className="text-sm text-destructive">Utilizador não encontrado</p>;
    }

    return (
        <CardTitle className="font-headline text-xl">{user.firstName} {user.lastName}</CardTitle>
    );
};

export function ApplicationCard({ application, onStatusChange }: ApplicationCardProps) {
    const job = vacancies.find(v => v.id === application.jobPostingId);
    const { toast } = useToast();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Mock application date if it's a Timestamp object for display
    const applicationDate = application.applicationDate instanceof Date 
        ? application.applicationDate 
        : new Date(); // Fallback for mock data

    const handleStatusChange = (newStatus: ApplicationStatus) => {
        onStatusChange(application.id, newStatus);
        toast({
            title: "Status Atualizado!",
            description: `A candidatura foi movida para '${newStatus}'.`
        });
    };


    return (
        <Card className="flex flex-col">
            <CardHeader>
                 {job && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Briefcase size={14} /> 
                        <span>{job.title}</span>
                    </div>
                )}
                <UserInfo userId={application.userId} onUserLoad={setUserProfile} />
                <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar size={14} /> 
                    {applicationDate ? 
                    `candidatou-se ${formatDistanceToNow(applicationDate, { addSuffix: true, locale: pt })}` 
                    : 'Data indisponível'}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
                <div className="mb-4">
                    <Badge>{application.status}</Badge>
                </div>
                <div className="flex gap-2 justify-between">
                    {userProfile?.resumeUrl ? (
                         <Button asChild variant="outline" size="sm" className="flex-1">
                            <a href={userProfile.resumeUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4"/>
                                Ver CV
                            </a>
                        </Button>
                    ) : (
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                            <Download className="mr-2 h-4 w-4"/>
                            Sem CV
                        </Button>
                    )}
                    <div className='flex gap-1'>
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange('Triagem')} title="Marcar como interessante">
                            <ThumbsUp className="h-5 w-5 text-green-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleStatusChange('Rejeitada')} title="Rejeitar">
                            <ThumbsDown className="h-5 w-5 text-red-500" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
