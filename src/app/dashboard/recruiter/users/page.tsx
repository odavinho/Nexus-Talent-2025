'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, MoreHorizontal, FileDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const teamMembers = [
    {
        id: 'rec1',
        name: 'Ana Silva',
        email: 'ana.silva@empresa.com',
        role: 'Admin',
        status: 'Ativo'
    },
    {
        id: 'rec2',
        name: 'Carlos Martins',
        email: 'carlos.martins@empresa.com',
        role: 'Recrutador',
        status: 'Ativo'
    },
     {
        id: 'rec3',
        name: 'Beatriz Costa',
        email: 'beatriz.costa@empresa.com',
        role: 'Gestor de Contratação',
        status: 'Convidado'
    }
]

export default function ManageTeamPage() {
    const router = useRouter();

    return (
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="outline" onClick={() => router.back()} className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <CardTitle className="font-headline text-3xl">Gerir Equipa de Recrutamento</CardTitle>
                            <CardDescription>Adicione, edite e gira as permissões dos membros da sua equipa.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="outline">
                                <FileDown className="mr-2 h-4 w-4"/>
                                Exportar
                            </Button>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4"/>
                                Convidar Membro
                            </Button>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Input
                            placeholder="Filtrar por nome ou email..."
                            className="max-w-sm"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Papel</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {teamMembers.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">{member.name}</TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={member.role === 'Admin' ? 'destructive' : 'secondary'}>
                                            {member.role}
                                        </Badge>
                                    </TableCell>
                                     <TableCell>
                                        <Badge variant={member.status === 'Ativo' ? 'default' : 'outline'}>
                                            {member.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Abrir menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                            <DropdownMenuItem>Reenviar Convite</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">
                                                Remover
                                            </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}