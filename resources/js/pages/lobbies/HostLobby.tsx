import { Head, Link } from '@inertiajs/react';
import { Copy, Check, Shield, ArrowLeft, Users, UserCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import lobbies from '@/routes/lobbies';
import type { BreadcrumbItem } from '@/types';

interface QuizInfo {
    id: number;
    title: string;
}

interface Player {
    id: number;
    name: string;
    status: string;
    score: number;
}

interface LobbyInfo {
    id: number;
    name: string;
    pin: string;
    status: string;
    quiz: QuizInfo;
    players: Player[];
}

interface Props {
    lobby: LobbyInfo;
}

export default function HostLobby({ lobby }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopyLink = () => {
        const joinUrl = `${window.location.origin}/join?pin=${lobby.pin}`;
        navigator.clipboard.writeText(joinUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <>
            <Head title={`Lobby - ${lobby.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                        <Link href={lobbies.index().url}>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                                <Shield className="h-3 w-3" /> Host Control Panel
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">{lobby.name}</h1>
                            <p className="text-sm text-muted-foreground line-clamp-1">Kuis: {lobby.quiz.title}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-12 items-start">
                    
                    {/* Left/Main Column: PIN Info Card (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* PIN Card */}
                        <Card className="border-2 border-indigo-500/20 bg-indigo-50/5 dark:bg-indigo-950/5 overflow-hidden">
                            <CardHeader className="text-center pb-2 bg-indigo-50/20 dark:bg-indigo-950/20 border-b border-indigo-500/10">
                                <CardTitle className="text-sm font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">Kode PIN Masuk</CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                                <div className="text-6xl font-black tracking-widest text-indigo-600 dark:text-indigo-400 select-all font-mono">
                                    {lobby.pin}
                                </div>
                                <p className="text-sm text-muted-foreground max-w-sm">
                                    Minta peserta untuk memasukkan PIN 6-digit di atas untuk bergabung ke lobi live.
                                </p>
                                <div className="flex items-center gap-2 rounded-lg border bg-background p-2.5 w-full max-w-md shadow-sm">
                                    <span className="flex-1 text-left text-xs font-mono truncate select-all">
                                        PIN: {lobby.pin}
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50"
                                        onClick={handleCopyLink}
                                        title="Salin Link Bergabung"
                                    >
                                        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Players Waiting (7 cols) */}
                    <div className="lg:col-span-7 space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <Heading
                                variant="small"
                                title={`Daftar Peserta (${lobby.players.length})`}
                                description="Peserta yang telah bergabung ke lobi akan muncul di sini."
                            />
                            <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                                <Users className="h-3.5 w-3.5" />
                                {lobby.players.length} Menunggu
                            </div>
                        </div>

                        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
                            {lobby.players.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-muted/10">
                                    <div className="rounded-full bg-muted p-3">
                                        <UserCircle2 className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="mt-4 text-sm font-semibold">Belum ada peserta</h3>
                                    <p className="mt-1 text-xs text-muted-foreground max-w-[200px]">
                                        Menunggu peserta untuk bergabung menggunakan PIN di atas...
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {lobby.players.map((p) => (
                                        <div key={p.id} className="flex items-center gap-3 rounded-lg border bg-card p-3 shadow-sm transition-all hover:border-indigo-200 dark:hover:border-indigo-800">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-bold uppercase">
                                                {p.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">{p.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
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
        title: 'Host Control Panel',
        href: '#',
    },
];

HostLobby.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        {page}
    </AppLayout>
);
