"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getCourseRecommendationsAction } from "@/app/actions";
import { PersonalizedCourseRecommendationsOutputSchema, type PersonalizedCourseRecommendationsOutput } from "@/lib/schemas";


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  userProfile: z.string().min(30, { message: "Descreva seus interesses com pelo menos 30 caracteres." }),
});

type FormValues = z.infer<typeof formSchema>;

export function CourseRecommendations() {
  const [recommendations, setRecommendations] = useState<PersonalizedCourseRecommendationsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userProfile: "Sou um gerente de projetos júnior buscando aprimorar minhas habilidades de liderança e finanças para avançar para uma posição sênior.",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setRecommendations(null);

    try {
      const result = await getCourseRecommendationsAction({
        userProfile: data.userProfile,
      });
      setRecommendations(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao Gerar Recomendações",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Lightbulb className="text-primary" />
          Recomendações de Cursos
        </CardTitle>
        <CardDescription>
          Descreva seus interesses e objetivos de carreira para receber recomendações de cursos personalizadas pela nossa IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userProfile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meus Interesses e Objetivos</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Sou um desenvolvedor júnior e quero me tornar um especialista em cloud..."
                      className="min-h-[100px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                'Obter Recomendações'
              )}
            </Button>
          </form>
        </Form>

        {recommendations && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="font-headline text-xl font-bold mb-4">Seu Plano de Aprendizagem Personalizado</h3>
            <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap">
              {recommendations.recommendedCourses}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
