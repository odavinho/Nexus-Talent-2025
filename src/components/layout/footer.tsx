import { Logo } from '@/components/shared/logo';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1 space-y-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Capacitando talentos e conectando oportunidades para um futuro brilhante.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter size={20} /></Link>
              <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin size={20} /></Link>
            </div>
          </div>

          <div>
            <h3 className="font-headline text-lg font-medium">Empregos</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/recruitment" className="text-muted-foreground hover:text-primary">Todos os empregos</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Empregos em destaque</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Candidatura espontânea</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg font-medium">Para Talentos</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/courses" className="text-muted-foreground hover:text-primary">Cursos de Formação</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Dicas de carreira</Link></li>
               <li><Link href="/dashboard/student/profile" className="text-muted-foreground hover:text-primary">Perfil de Candidato</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-headline text-lg font-medium">Para Empresas</h3>
            <ul className="mt-4 space-y-2 text-sm">
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Trabalho temporário</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Recrutamento e seleção</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Outsourcing</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Assessment & development</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary">Pedido de proposta</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline text-lg font-medium">Sobre Nós</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">Quem somos</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Sustentabilidade</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-primary">Notícias</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Onde estamos</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary">Contactos</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} NexusTalent. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
