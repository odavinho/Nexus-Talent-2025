'use client';

import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const pathname = usePathname();
  const [isDashboard, setIsDashboard] = useState(false);

  useEffect(() => {
    setIsDashboard(pathname.startsWith('/dashboard'));
  }, [pathname]);

  return (
    <>
      {!isDashboard && <Header />}
      <main className="flex-grow flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl font-headline">Página não encontrada</h1>
          <p className="mt-6 text-base leading-7 text-muted-foreground">Lamentamos, não conseguimos encontrar a página que procura.</p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild>
              <Link href={isDashboard ? "/dashboard" : "/"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à página inicial
              </Link>
            </Button>
          </div>
        </div>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
}
