import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import quizzes from '@/routes/quizzes';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
}

interface Props {
    quiz: Quiz | null;
}

export default function QuizForm({ quiz }: Props) {
    const isEdit = !!quiz;

    const { data, setData, post, put, processing, errors } = useForm({
        title: quiz?.title || '',
        description: quiz?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(quizzes.update(quiz.id).url, {
                preserveScroll: true,
            });
        } else {
            post(quizzes.store().url, {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Paket Kuis' : 'Buat Paket Kuis'} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6 max-w-2xl mx-auto w-full">
                <div className="flex items-center gap-4">
                    <Link href={quizzes.index().url}>
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Heading
                        title={isEdit ? 'Edit Paket Kuis' : 'Buat Paket Kuis'}
                        description={isEdit ? 'Ubah detail judul dan deskripsi kuis' : 'Buat paket kuis baru untuk mengelompokkan soal'}
                    />
                </div>

                <Card className="border border-border/60 bg-card/65">
                    <CardHeader>
                        <CardTitle>{isEdit ? 'Form Edit Kuis' : 'Form Kuis Baru'}</CardTitle>
                        <CardDescription>
                            Isi detail kuis di bawah ini. Judul kuis akan ditampilkan kepada peserta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Judul Kuis</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                    placeholder="Masukkan judul kuis (misal: Kuis Dasar Kubernetes)"
                                    className="w-full"
                                    autoFocus
                                    disabled={processing}
                                />
                                <InputError message={errors.title} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Deskripsi Kuis</Label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Masukkan deskripsi singkat tentang kuis ini..."
                                    rows={4}
                                    disabled={processing}
                                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                                <InputError message={errors.description} />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-4 border-t">
                                <Link href={quizzes.index().url}>
                                    <Button type="button" variant="outline" disabled={processing}>
                                        Batal
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Kuis'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

QuizForm.layout = {
    breadcrumbs: [
        {
            title: 'Kuis & Bank Soal',
            href: '/quizzes',
        },
        {
            title: 'Form Kuis',
            href: '/quizzes/create',
        },
    ],
};

