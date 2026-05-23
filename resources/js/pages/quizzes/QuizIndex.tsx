import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Plus, Trash2, Edit3, HelpCircle, Layers } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import quizzes from '@/routes/quizzes';
import type { BreadcrumbItem } from '@/types';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
    questions_count: number;
    created_at: string;
}

interface Props {
    quizzes: Quiz[];
}

export default function QuizIndex({ quizzes: quizList }: Props) {
    const handleDelete = (quizId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus paket kuis ini? Semua soal di dalamnya juga akan dihapus.')) {
            router.delete(quizzes.destroy(quizId).url);
        }
    };



    return (
        <>
            <Head title="Bank Soal - Kuis" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Bank Soal & Kuis"
                        description="Kelola paket kuis dan buat soal kuis real-time"
                    />
                    <Link href={quizzes.create().url}>
                        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200">
                            <Plus className="h-4 w-4" />
                            Tambah Kuis
                        </Button>
                    </Link>
                </div>

                {quizList.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
                        <CardHeader className="items-center pb-2">
                            <div className="rounded-full bg-indigo-50 p-4 dark:bg-indigo-950/40">
                                <BookOpen className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <CardTitle className="mt-4 text-xl">Belum ada Paket Kuis</CardTitle>
                            <CardDescription className="max-w-sm">
                                Buat paket kuis pertamamu untuk mulai menyusun soal pilihan ganda, esai singkat, atau jawab cepat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={quizzes.create().url}>
                                <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Mulai Membuat Kuis
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {quizList.map((quiz) => (
                            <Card key={quiz.id} className="flex flex-col border border-border/60 bg-card/65 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5">
                                <CardHeader className="flex-1 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="line-clamp-1 text-lg font-bold text-foreground">
                                                {quiz.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
                                                {quiz.description || 'Tidak ada deskripsi.'}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50/50 px-3 py-2 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300">
                                        <HelpCircle className="h-4 w-4" />
                                        <span className="text-xs font-semibold">
                                            {quiz.questions_count} Soal Tersedia
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 p-4">
                                    <div className="flex w-full gap-2">
                                        <Link href={quizzes.questions.manage(quiz).url} className="flex-1">
                                            <Button variant="outline" className="w-full gap-1.5 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-semibold">
                                                <Layers className="h-3.5 w-3.5" />
                                                Kelola Soal
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="flex w-full justify-end gap-2 border-t pt-2 border-border/40">
                                        <Link href={quizzes.edit(quiz).url}>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs text-muted-foreground hover:text-foreground">
                                                <Edit3 className="h-3.5 w-3.5" />
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 gap-1 text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                            onClick={() => handleDelete(quiz.id)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            Hapus
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kuis & Bank Soal',
        href: '/quizzes',
    },
];

QuizIndex.layout = {
    breadcrumbs,
};
