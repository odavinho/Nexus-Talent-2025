'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, notFound } from 'next/navigation';
import { getCourseById } from '@/lib/course-service';
import type { Course } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Tag, Lock } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { getImages } from '@/lib/site-data';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [voucher, setVoucher] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (id) {
      const foundCourse = getCourseById(id);
      setCourse(foundCourse || null);
    }
    setIsLoading(false);
  }, [id]);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!course) {
    return notFound();
  }

  const image = getImages().find(p => p.id === course.imageId);
  const imageSrc = course.imageDataUri || image?.imageUrl;
  
  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
        toast({
            title: "Matrícula Efetuada!",
            description: `A sua inscrição no curso "${course.name}" foi concluída.`,
        });
        router.push('/dashboard/student');
    }, 2000);
  }

  return (
    <>
      <Header />
      <main className="py-12 bg-secondary">
        <div className="container mx-auto max-w-4xl">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Button>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-3xl">Finalizar Matrícula</CardTitle>
              <CardDescription>Confirme os detalhes e prossiga para o pagamento.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="font-semibold text-lg">Resumo do Pedido</h3>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                    {imageSrc && (
                        <div className="relative w-24 h-16 rounded-md overflow-hidden">
                             <Image src={imageSrc} alt={course.name} fill className="object-cover" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold">{course.name}</h4>
                        <p className="text-sm text-muted-foreground">{course.format}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="voucher">Código Promocional</Label>
                    <div className="flex gap-2">
                        <Input id="voucher" placeholder="VOUCHER2024" value={voucher} onChange={e => setVoucher(e.target.value)} />
                        <Button variant="outline"><Tag className="mr-2 h-4 w-4" /> Aplicar</Button>
                    </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span>Subtotal:</span> <span className="font-medium">AOA 25.000</span></div>
                    <div className="flex justify-between text-green-600"><span>Desconto:</span> <span className="font-medium">- AOA 0</span></div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2"><span>Total:</span> <span>AOA 25.000</span></div>
                </div>
              </div>
              <div className="space-y-6 bg-secondary/50 p-6 rounded-lg">
                 <h3 className="font-semibold text-lg">Procedimentos de Pagamento</h3>
                 <p className="text-sm text-muted-foreground">
                    Para cursos presenciais e outras modalidades que exijam pagamento, siga as instruções abaixo após confirmar a sua inscrição.
                 </p>
                 <div className="text-sm space-y-1">
                    <p><strong>IBAN:</strong> AO06 0000 0000 0000 0000 0000 0</p>
                    <p><strong>Beneficiário:</strong> NexusTalent Formação & Consultoria</p>
                    <p><strong>Referência:</strong> {course.id}-{new Date().getTime()}</p>
                 </div>
                 <p className="text-xs text-muted-foreground">Por favor, envie o comprovativo de pagamento para o nosso e-mail de suporte para acelerar a confirmação.</p>
                 <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                    Confirmar e Pagar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
