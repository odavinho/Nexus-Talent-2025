'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';
import { Menu, X, LogOut, Globe } from 'lucide-react';
import { useState, useTransition, type FC } from 'react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, useAuth } from '@/firebase/provider';
import { signOut } from 'firebase/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useLocale, useTranslations } from 'next-intl';


const LocaleSwitcher: FC = () => {
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    function onLocaleChange(newLocale: string) {
        const newPath = pathname.startsWith('/' + locale) ? `/${newLocale}${pathname.substring(3)}` : `/${newLocale}${pathname}`;
        startTransition(() => {
            router.replace(newPath);
        });
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Globe />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onLocaleChange('pt')} disabled={isPending || locale === 'pt'}>Português</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLocaleChange('en')} disabled={isPending || locale === 'en'}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onLocaleChange('fr')} disabled={isPending || locale === 'fr'}>Français</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

const NavLinks = ({ closeMenu }: { closeMenu?: () => void }) => {
    const t = useTranslations('Header');
    const pathname = usePathname();
    const navLinks = [
        { href: '/courses', label: t('courses') },
        { href: '/recruitment', label: t('vacancies') },
        { href: '/pricing', label: 'Planos' },
        { href: '/about', label: t('about') },
        { href: '/blog', label: t('blog') },
    ];
    
    return (
        <>
            {navLinks.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "font-medium transition-colors",
                        "block px-3 py-2 rounded-md text-base md:text-sm md:inline-block md:px-0 md:py-0 md:rounded-none md:bg-transparent",
                        pathname.endsWith(link.href) ? "text-primary font-semibold bg-secondary md:bg-transparent" : "text-foreground/80 hover:text-foreground hover:bg-secondary md:hover:bg-transparent"
                    )}
                    onClick={closeMenu}
                >
                    {link.label}
                </Link>
            ))}
        </>
    );
}


export function Header() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '';
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.slice(0, 2).toUpperCase();
  }

  return (
    <header className="bg-card shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <Logo />
            </Link>
          </div>

          <nav className="hidden md:flex md:items-center md:space-x-8">
              <NavLinks />
          </nav>

          <div className="flex items-center space-x-2">
            <LocaleSwitcher />

            {isUserLoading ? (
              <Skeleton className="h-9 w-24 hidden md:block" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 hidden md:flex">
                     <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} />
                      <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                    </Avatar>
                    <span className='hidden sm:inline'>{user.displayName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Painel</Link>
                  </DropdownMenuItem>
                   <DropdownMenuItem asChild>
                    <Link href="/dashboard/student/profile">Meu Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">Configurações</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="mr-2"/>
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className='hidden md:flex'>
                <Button variant="ghost" asChild>
                  <Link href="/login">Entrar</Link>
                </Button>
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                  <Link href="/signup">Cadastre-se</Link>
                </Button>
              </div>
            )}
            
             <div className="md:hidden flex items-center">
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </div>
            
          </div>
        </div>
         <div
            className={cn(
            'md:hidden transition-all duration-300 ease-in-out absolute top-full left-0 w-full bg-card',
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            )}
        >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                <NavLinks closeMenu={() => setIsMenuOpen(false)} />
               <div className="pt-4 border-t">
                {isUserLoading ? <div className='px-3'><Skeleton className='h-10 w-full'/></div> : user ? (
                   <div className="space-y-2 px-3">
                     <p className="font-medium">{user.displayName || user.email}</p>
                     <Button variant="outline" className="w-full" asChild onClick={() => setIsMenuOpen(false)}><Link href="/dashboard">Painel</Link></Button>
                     <Button variant="destructive" className="w-full" onClick={handleLogout}>Sair</Button>
                   </div>
                ) : (
                  <div className="flex items-center px-3 space-x-2">
                     <Button variant="ghost" className="w-full" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link href="/login">Entrar</Link>
                    </Button>
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild onClick={() => setIsMenuOpen(false)}>
                      <Link href="/signup">Cadastre-se</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>
    </header>
  );
}