'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CVBuilderPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl sm:text-5xl font-bold">Construtor de CV da NexusTalent</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Crie um currículo profissional e apelativo em minutos.
          </p>
        </div>
        
        <div className="text-center p-16 border-2 border-dashed rounded-lg">
            <p className="text-xl font-semibold">Funcionalidade em Desenvolvimento</p>
            <p className="text-muted-foreground mt-2">
                O nosso construtor de CV inteligente estará disponível em breve para o ajudar a criar o currículo perfeito.
            </p>
             <Button asChild className="mt-6">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Página Inicial
              </Link>
            </Button>
        </div>

      </main>
      <Footer />
    </>
  );
}