'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Percent, MousePointerClick, Eye, BarChart } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

// Mock data
const mockCampaigns = [
    {
        id: 'camp1',
        subject: '🚀 Novo Curso de Liderança Disponível!',
        sentDate: new Date(2024, 6, 28),
        recipients: 1250,
        openRate: 28.5,
        clickRate: 4.2
    },
    {
        id: 'camp2',
        subject: 'Vaga Urgente: Desenvolvedor Frontend Sênior',
        sentDate: new Date(2024, 7, 1),
        recipients: 320,
        openRate: 45.2,
        clickRate: 12.8
    },
    {
        id: 'camp3',
        subject: 'Não perca as nossas promoções de Verão!',
        sentDate: new Date(2024, 7, 5),
        recipients: 2500,
        openRate: 19.8,
        clickRate: 2.1
    }
];

export default function CampaignsPage() {
    const router = useRouter();
    const [campaigns] = useState(mockCampaigns);

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
                            <CardTitle className="font-headline text-3xl flex items-center gap-2">
                                <Mail /> Campanhas de E-mail
                            </CardTitle>
                            <CardDescription>Visualize o desempenho das suas campanhas de e-mail marketing.</CardDescription>
                        </div>
                        <Button asChild>
                           <Link href="/dashboard/admin/email-marketing">
                             Criar Nova Campanha
                           </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Assunto</TableHead>
                                <TableHead>Data de Envio</TableHead>
                                <TableHead>Destinatários</TableHead>
                                <TableHead className='flex items-center gap-1'><Eye size={14}/> Aberturas</TableHead>
                                <TableHead className='flex items-center gap-1'><MousePointerClick size={14}/> Cliques</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaigns.map((campaign) => (
                                <TableRow key={campaign.id}>
                                    <TableCell className="font-medium">{campaign.subject}</TableCell>
                                    <TableCell>{format(campaign.sentDate, "d MMM, yyyy", { locale: pt })}</TableCell>
                                    <TableCell>{campaign.recipients}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{campaign.openRate}%</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{campaign.clickRate}%</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                         <Button variant="ghost" size="sm" disabled>
                                            <BarChart className="mr-2 h-4 w-4" /> Ver Relatório
                                         </Button>
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
