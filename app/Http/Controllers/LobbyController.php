<?php

namespace App\Http\Controllers;

use App\Models\Lobby;
use App\Models\LobbyPlayer;
use App\Models\Quiz;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class LobbyController extends Controller
{
    /**
     * Display a listing of lobbies hosted by the user.
     */
    public function index(): Response
    {
        $lobbies = Lobby::query()->with('quiz')
            ->where('host_id', Auth::id())
            ->latest()
            ->paginate(10);

        return Inertia::render('lobbies/LobbyIndex', [
            'lobbies' => $lobbies,
        ]);
    }

    /**
     * Show the form for creating a new lobby.
     */
    public function create(): Response
    {
        $quizzes = Quiz::query()->latest()->get(['id', 'title']);

        return Inertia::render('lobbies/LobbyCreate', [
            'quizzes' => $quizzes,
        ]);
    }

    /**
     * Start a new lobby.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'quiz_id' => 'required|exists:quizzes,id',
        ]);

        // Security check: ensure the quiz exists
        $quiz = Quiz::query()->where('id', $validated['quiz_id'])->firstOrFail();

        // Generate a unique 6-digit PIN
        do {
            $pin = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (Lobby::wherePin($pin)->whereIn('status', ['waiting', 'active'], 'and', false)->exists());

        $lobby = Lobby::query()->create([
            'name' => $validated['name'],
            'quiz_id' => $quiz->id,
            'pin' => $pin,
            'status' => 'waiting',
            'host_id' => Auth::id(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Lobby berhasil dibuat.'
        ]);

        return redirect()->route('lobbies.host', $lobby->pin);
    }

    /**
     * Show the host control panel for the lobby.
     */
    public function host(string $pin): Response
    {
        $lobby = Lobby::wherePin($pin)
            ->with(['quiz', 'players'])
            ->firstOrFail();

        // Security check: Only the host can access the host page
        if ($lobby->host_id !== Auth::id()) {
            abort(403, 'Akses ditolak. Anda bukan host dari kuis ini.');
        }

        return Inertia::render('lobbies/HostLobby', [
            'lobby' => [
                'id' => $lobby->id,
                'name' => $lobby->name,
                'pin' => $lobby->pin,
                'status' => $lobby->status,
                'quiz' => [
                    'id' => $lobby->quiz->id,
                    'title' => $lobby->quiz->title,
                ],
                'players' => $lobby->players->map(fn(LobbyPlayer $p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'status' => $p->status,
                    'score' => $p->score,
                ])
            ],
        ]);
    }
}
