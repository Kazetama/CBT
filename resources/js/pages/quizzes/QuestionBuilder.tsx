import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import quizzes from '@/routes/quizzes';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit3, Trash2, HelpCircle, Clock, Award, Plus, Sparkles } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface Quiz {
    id: number;
    title: string;
    description: string | null;
}

interface Question {
    id: number;
    quiz_id: number;
    type: 'multiple_choice' | 'short_essay' | 'fast_click';
    question_text: string;
    options: { A: string; B: string; C: string; D: string } | null;
    correct_answer: string;
    duration: number;
    base_point: number;
    created_at: string;
}

interface Props {
    quiz: Quiz;
    questions: Question[];
}

export default function QuestionBuilder({ quiz, questions }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        type: 'multiple_choice' as 'multiple_choice' | 'short_essay' | 'fast_click',
        question_text: '',
        options: { A: '', B: '', C: '', D: '' },
        correct_answer: 'A',
        duration: 30,
        base_point: 100,
    });

    const handleEditClick = (question: Question) => {
        setEditingId(question.id);
        setData({
            type: question.type,
            question_text: question.question_text,
            options: question.options || { A: '', B: '', C: '', D: '' },
            correct_answer: question.correct_answer,
            duration: question.duration,
            base_point: question.base_point,
        });
        clearErrors();
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        reset();
        clearErrors();
    };

    const handleDeleteQuestion = (questionId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
            router.delete(quizzes.questions.destroy({ quiz: quiz.id, question: questionId }).url, {
                preserveScroll: true,
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Perform client-side formatting checks if needed
        if (editingId) {
            put(quizzes.questions.update({ quiz: quiz.id, question: editingId }).url, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    reset();
                },
            });
        } else {
            post(quizzes.questions.store({ quiz: quiz.id }).url, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                },
            });
        }
    };

    const handleOptionChange = (key: 'A' | 'B' | 'C' | 'D', value: string) => {
        setData('options', {
            ...data.options,
            [key]: value,
        });
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'multiple_choice':
                return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/50">Pilihan Ganda</Badge>;
            case 'short_essay':
                return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/50">Esai Singkat</Badge>;
            case 'fast_click':
                return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/50 flex items-center gap-1"><Sparkles className="h-3 w-3" /> Jawab Cepat</Badge>;
            default:
                return null;
        }
    };

    return (
        <>
            <Head title={`Kelola Soal - ${quiz.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Link href={quizzes.index().url}>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Kelola Soal Kuis</span>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">{quiz.title}</h1>
                            <p className="text-sm text-muted-foreground line-clamp-1">{quiz.description || 'Tidak ada deskripsi.'}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12 items-start">
                    {/* Left Column: Questions List (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <Heading
                            variant="small"
                            title={`Daftar Soal (${questions.length})`}
                            description="Klik tombol edit untuk memodifikasi soal yang sudah ada."
                        />

                        {questions.length === 0 ? (
                            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
                                <CardHeader className="items-center pb-2">
                                    <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-900">
                                        <HelpCircle className="h-8 w-8 text-slate-500" />
                                    </div>
                                    <CardTitle className="mt-4 text-base">Belum ada soal</CardTitle>
                                    <CardDescription className="max-w-xs">
                                        Gunakan form di sebelah kanan untuk menambahkan soal pertama Anda.
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) : (
                            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                                {questions.map((q, idx) => (
                                    <Card 
                                        key={q.id} 
                                        className={`border transition-all duration-200 ${
                                            editingId === q.id 
                                                ? 'border-indigo-500 bg-indigo-50/5 dark:bg-indigo-950/10 shadow-sm' 
                                                : 'border-border/60 hover:border-indigo-500/30'
                                        }`}
                                    >
                                        <CardHeader className="p-4 pb-2">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                                                        {questions.length - idx}
                                                    </span>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-foreground leading-relaxed">
                                                            {q.question_text}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2 pt-1">
                                                            {getTypeBadge(q.type)}
                                                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground">
                                                                <Clock className="h-3 w-3" /> {q.duration} detik
                                                            </span>
                                                            <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs text-muted-foreground">
                                                                <Award className="h-3 w-3" /> {q.base_point} poin
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                        onClick={() => handleEditClick(q)}
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                                                        onClick={() => handleDeleteQuestion(q.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        
                                        {/* Show details depending on question type */}
                                        <CardContent className="p-4 pt-0">
                                            {q.type !== 'short_essay' && q.options && (
                                                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                                                    {Object.entries(q.options).map(([key, val]) => (
                                                        <div 
                                                            key={key} 
                                                            className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 ${
                                                                q.correct_answer === key 
                                                                    ? 'border-emerald-500 bg-emerald-50/20 text-emerald-800 dark:text-emerald-300 font-semibold' 
                                                                    : 'border-border bg-muted/30 text-muted-foreground'
                                                            }`}
                                                        >
                                                            <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                                                                q.correct_answer === key 
                                                                    ? 'bg-emerald-500 text-white' 
                                                                    : 'bg-muted-foreground/20 text-muted-foreground'
                                                            }`}>
                                                                {key}
                                                            </span>
                                                            <span className="truncate">{val || '(opsi kosong)'}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {q.type === 'short_essay' && (
                                                <div className="mt-2 text-xs">
                                                    <div className="flex items-center gap-2 rounded-md border border-emerald-500 bg-emerald-50/20 px-2.5 py-1.5 text-emerald-800 dark:text-emerald-300">
                                                        <span className="font-semibold">Kunci Jawaban:</span>
                                                        <span className="font-mono">{q.correct_answer}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Question Builder Form (5 cols) */}
                    <div className="lg:col-span-5">
                        <Card className="border border-border/60 bg-card/65 sticky top-6">
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    {editingId ? <Edit3 className="h-5 w-5 text-indigo-500" /> : <Plus className="h-5 w-5 text-indigo-500" />}
                                    {editingId ? 'Edit Soal' : 'Tambah Soal Baru'}
                                </CardTitle>
                                <CardDescription>
                                    {editingId ? 'Ubah parameter dan perbarui isi soal di bawah ini.' : 'Tentukan tipe soal dan lengkapi detail form soal.'}
                                </CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    {/* Question Type */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="type">Tipe Soal</Label>
                                        <select
                                            id="type"
                                            value={data.type}
                                            onChange={(e) => {
                                                const newType = e.target.value as 'multiple_choice' | 'short_essay' | 'fast_click';
                                                setData(prev => ({
                                                    ...prev,
                                                    type: newType,
                                                    // Reset correct answer selection to default option key if switching to choice
                                                    correct_answer: newType === 'short_essay' ? '' : 'A'
                                                }));
                                            }}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-indigo-500 dark:bg-input/10"
                                        >
                                            <option value="multiple_choice">Pilihan Ganda</option>
                                            <option value="short_essay">Esai Singkat</option>
                                            <option value="fast_click">Jawab Cepat (Fast Click)</option>
                                        </select>
                                        <InputError message={errors.type} />
                                    </div>

                                    {/* Question Text */}
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="question_text">Teks Soal</Label>
                                        <textarea
                                            id="question_text"
                                            value={data.question_text}
                                            onChange={(e) => setData('question_text', e.target.value)}
                                            required
                                            placeholder="Masukkan pertanyaan soal di sini..."
                                            rows={3}
                                            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                        <InputError message={errors.question_text} />
                                    </div>

                                    {/* Conditional Form: Multiple Choice / Fast Click */}
                                    {data.type !== 'short_essay' && (
                                        <div className="space-y-4 border-y py-4 my-2">
                                            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Opsi Jawaban & Kunci</Label>
                                            <div className="grid gap-3">
                                                {/* Option A */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300 text-xs font-bold">A</span>
                                                        <Input
                                                            value={data.options.A}
                                                            onChange={(e) => handleOptionChange('A', e.target.value)}
                                                            placeholder="Jawaban A"
                                                            required
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                    <InputError message={errors['options.A']} className="ml-9" />
                                                </div>

                                                {/* Option B */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 text-xs font-bold">B</span>
                                                        <Input
                                                            value={data.options.B}
                                                            onChange={(e) => handleOptionChange('B', e.target.value)}
                                                            placeholder="Jawaban B"
                                                            required
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                    <InputError message={errors['options.B']} className="ml-9" />
                                                </div>

                                                {/* Option C */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold">C</span>
                                                        <Input
                                                            value={data.options.C}
                                                            onChange={(e) => handleOptionChange('C', e.target.value)}
                                                            placeholder="Jawaban C"
                                                            required
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                    <InputError message={errors['options.C']} className="ml-9" />
                                                </div>

                                                {/* Option D */}
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">D</span>
                                                        <Input
                                                            value={data.options.D}
                                                            onChange={(e) => handleOptionChange('D', e.target.value)}
                                                            placeholder="Jawaban D"
                                                            required
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                    <InputError message={errors['options.D']} className="ml-9" />
                                                </div>
                                            </div>

                                            {/* Correct Option Dropdown */}
                                            <div className="grid gap-1.5 pt-2">
                                                <Label htmlFor="correct_answer">Kunci Jawaban</Label>
                                                <select
                                                    id="correct_answer"
                                                    value={data.correct_answer}
                                                    onChange={(e) => setData('correct_answer', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-indigo-500 dark:bg-input/10"
                                                >
                                                    <option value="A">Opsi A</option>
                                                    <option value="B">Opsi B</option>
                                                    <option value="C">Opsi C</option>
                                                    <option value="D">Opsi D</option>
                                                </select>
                                                <InputError message={errors.correct_answer} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Conditional Form: Short Essay */}
                                    {data.type === 'short_essay' && (
                                        <div className="space-y-4 border-y py-4 my-2">
                                            <div className="grid gap-1.5">
                                                <Label htmlFor="correct_essay_answer">Kunci Jawaban Esai</Label>
                                                <Input
                                                    id="correct_essay_answer"
                                                    value={data.correct_answer}
                                                    onChange={(e) => setData('correct_answer', e.target.value)}
                                                    required
                                                    placeholder="Contoh: k8s, kubernetes"
                                                />
                                                <p className="text-xs text-muted-foreground">
                                                    Tuliskan kunci jawaban yang benar. Pisahkan dengan tanda koma (`,`) jika ada lebih dari satu alternatif kata kunci yang valid.
                                                </p>
                                                <InputError message={errors.correct_answer} />
                                            </div>
                                        </div>
                                    )}

                                    {/* Duration and Base Point */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="duration">Durasi (Detik)</Label>
                                            <Input
                                                id="duration"
                                                type="number"
                                                min={5}
                                                max={3600}
                                                value={data.duration}
                                                onChange={(e) => setData('duration', parseInt(e.target.value) || 0)}
                                                required
                                            />
                                            <InputError message={errors.duration} />
                                        </div>
                                        <div className="grid gap-1.5">
                                            <Label htmlFor="base_point">Poin Dasar</Label>
                                            <Input
                                                id="base_point"
                                                type="number"
                                                min={0}
                                                max={10000}
                                                value={data.base_point}
                                                onChange={(e) => setData('base_point', parseInt(e.target.value) || 0)}
                                                required
                                            />
                                            <InputError message={errors.base_point} />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex items-center justify-end gap-2 border-t bg-muted/10 p-4">
                                    {editingId && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={handleCancelEdit}
                                            disabled={processing}
                                        >
                                            Batal
                                        </Button>
                                    )}
                                    <Button 
                                        type="submit" 
                                        disabled={processing}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                    >
                                        {processing 
                                            ? 'Menyimpan...' 
                                            : editingId 
                                                ? 'Perbarui Soal' 
                                                : 'Simpan Soal'
                                        }
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

const breadcrumbs = (quiz: Quiz): BreadcrumbItem[] => [
    {
        title: 'Kuis & Bank Soal',
        href: '/quizzes',
    },
    {
        title: `Kelola Soal: ${quiz.title}`,
        href: `/quizzes/${quiz.id}/questions`,
    },
];

QuestionBuilder.layout = {
    breadcrumbs: [
        {
            title: 'Kuis & Bank Soal',
            href: '/quizzes',
        },
        {
            title: 'Kelola Soal',
            href: '/quizzes',
        },
    ],
};

