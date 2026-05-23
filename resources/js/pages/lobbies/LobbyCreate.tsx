import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import lobbies from '@/routes/lobbies';
import type { BreadcrumbItem } from '@/types';

interface Quiz {
    id: number;
    title: string;
}

interface Props {
    quizzes: Quiz[];
}

export default function LobbyCreate({ quizzes: quizList }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        quiz_id: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(lobbies.store().url);
    };

    return (
        <>
            <Head title="Buat Lobi Baru" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center gap-4">
                    <Link href={lobbies.index().url}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Heading
                        title="Buat Lobi Kuis Baru"
                        description="Tentukan nama lobi dan pilih kuis dari bank soal"
                    />
                </div>

                <div className="mx-auto w-full max-w-2xl">
                    <Card className="border border-border/60 shadow-sm">
                        <CardHeader className="bg-muted/20 pb-4 border-b">
                            <CardTitle className="text-lg">Informasi Lobi</CardTitle>
                            <CardDescription>
                                Lobi live akan membuat ruang interaktif di mana peserta dapat bergabung dan berkompetisi secara real-time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold">Nama Lobi</Label>
                                    <Input
                                        id="name"
                                        placeholder="Contoh: Kuis Akhir Semester Kelas 12A"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quiz_id" className="text-sm font-semibold flex items-center gap-1.5">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        Pilih Kuis dari Bank Soal
                                    </Label>
                                    {quizList.length === 0 ? (
                                        <div className="rounded-md bg-amber-50 p-3 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-sm">
                                            Anda belum memiliki kuis. Harap buat kuis di menu Bank Soal terlebih dahulu.
                                        </div>
                                    ) : (
                                        <Select
                                            value={data.quiz_id}
                                            onValueChange={(value) => setData('quiz_id', value)}
                                        >
                                            <SelectTrigger id="quiz_id" className="w-full">
                                                <SelectValue placeholder="Pilih kuis yang ingin dimainkan..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {quizList.map((quiz) => (
                                                    <SelectItem key={quiz.id} value={quiz.id.toString()}>
                                                        {quiz.title}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    <InputError message={errors.quiz_id} />
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                                    <Link href={lobbies.index().url}>
                                        <Button type="button" variant="ghost">Batal</Button>
                                    </Link>
                                    <Button 
                                        type="submit" 
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        disabled={processing || quizList.length === 0}
                                    >
                                        Buat Lobi & Dapatkan PIN
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Live Lobi',
        href: '/lobbies',
    },
    {
        title: 'Buat Lobi',
        href: '#',
    },
];

LobbyCreate.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        {page}
    </AppLayout>
);
