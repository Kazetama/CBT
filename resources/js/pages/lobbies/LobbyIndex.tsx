import { Head, Link } from '@inertiajs/react';
import { LayoutGrid, Plus, Users } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import lobbies from '@/routes/lobbies';
import type { BreadcrumbItem } from '@/types';

interface Quiz {
    id: number;
    title: string;
}

interface Lobby {
    id: number;
    name: string;
    pin: string;
    status: string;
    quiz: Quiz;
    created_at: string;
}

interface Props {
    lobbies: {
        data: Lobby[];
    };
}

export default function LobbyIndex({ lobbies: paginatedLobbies }: Props) {
    const lobbyList = paginatedLobbies.data;

    return (
        <>
            <Head title="Manajemen Live Lobi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <Heading
                        title="Manajemen Live Lobi"
                        description="Kelola dan buat lobi live kuis untuk peserta"
                    />
                    <Link href={lobbies.create().url}>
                        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all duration-200">
                            <Plus className="h-4 w-4" />
                            Buat Lobi
                        </Button>
                    </Link>
                </div>

                {lobbyList.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
                        <CardHeader className="items-center pb-2">
                            <div className="rounded-full bg-indigo-50 p-4 dark:bg-indigo-950/40">
                                <LayoutGrid className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <CardTitle className="mt-4 text-xl">Belum ada Lobi Live</CardTitle>
                            <CardDescription className="max-w-sm">
                                Buat lobi pertamamu untuk mulai menyelenggarakan kuis secara real-time.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href={lobbies.create().url}>
                                <Button className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Mulai Buat Lobi
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {lobbyList.map((lobby) => (
                            <Card key={lobby.id} className="flex flex-col border border-border/60 bg-card/65 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/5">
                                <CardHeader className="flex-1 pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <CardTitle className="line-clamp-1 text-lg font-bold text-foreground">
                                                {lobby.name}
                                            </CardTitle>
                                            <CardDescription className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
                                                <BookOpenIcon className="h-3.5 w-3.5" /> {lobby.quiz.title}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pb-4">
                                    <div className="flex items-center gap-2 rounded-lg bg-indigo-50/50 px-3 py-2 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-300">
                                        <span className="font-mono text-sm font-bold tracking-wider">PIN: {lobby.pin}</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-3 border-t bg-muted/20 p-4">
                                    <Link href={lobbies.host(lobby.pin).url} className="w-full">
                                        <Button 
                                            className="w-full gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs font-semibold"
                                        >
                                            <Users className="h-3.5 w-3.5" />
                                            Masuk ke Lobi
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Live Lobi',
        href: '/lobbies',
    },
];

LobbyIndex.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={breadcrumbs}>
        {page}
    </AppLayout>
);
