import { useEffect, useRef, useState } from "react";
import Balloon from "./Balloon";
import Settings from "./Settings";
import Leaderboard from "./Leaderboard";
import { loadUsers, saveUsers, saveCurrentUser } from "../storage";
import type { BalloonType, User } from "../types";
import Modal from "./Modal";
import backgroundMusic from "../assets/sounds/bg-music.mp3";
type GameState = "idle" | "running" | "paused" | "ended";


const MainPage = () => {
    const [balloons, setBalloons] = useState<BalloonType[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [timeLeft, setTimeLeft] = useState(30);
    const [missed, setMissed] = useState(0);
    const [users, setUsers] = useState<User[]>(loadUsers());
    const [startTrim, setStartTrim] = useState(false)
    const spawnRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalResult, setModalResult] = useState<"win" | "lose">("win");
    const bgAudioRef = useRef(new Audio(backgroundMusic));

    const getSpeed = () => {
        switch (currentUser?.difficulty) {
            case "Hard": return 3;
            case "Medium": return 5;
            default: return 7;
        }
    };

    const clearIntervals = () => {
        if (spawnRef.current) clearInterval(spawnRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
        spawnRef.current = null;
        timerRef.current = null;
    };

    const startIntervals = () => {
        spawnRef.current = window.setInterval(() => {
            setBalloons(prev => [
                ...prev,
                { id: Math.random(), left: Math.random() * 75 }
            ]);
        }, 800);

        timerRef.current = window.setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) {
                    endGame();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    };

    const startGame = () => {
        if (!currentUser || !currentUser.nickname.trim()) {
            setStartTrim(true)
            setGameState("idle")
            return
        }
        setStartTrim(false)
        clearIntervals();
        setBalloons([]);
        setTimeLeft(30);
        setMissed(0);
        setGameState("running");

        if (currentUser) {
            const resetUser = { ...currentUser, points: 0 };
            setCurrentUser(resetUser);
            saveCurrentUser(resetUser);

            const updatedUsers = users.map(u =>
                u.nickname === resetUser.nickname ? resetUser : u
            );
            setUsers(updatedUsers);
            saveUsers(updatedUsers);
        }
        startIntervals();
    };

    const pauseGame = () => {
        clearIntervals();
        setGameState("paused");
    };

    const continueGame = () => {
        setGameState("running");
        startIntervals();
    };

    const endGame = () => {
        clearIntervals();
        setGameState("ended");
    };

    const handlePop = () => {
        if (!currentUser) return;

        const updatedUser = { ...currentUser, points: currentUser.points + 1 };
        setCurrentUser(updatedUser);
        saveCurrentUser(updatedUser);

        const updatedUsers = users.map(u =>
            u.nickname === updatedUser.nickname ? updatedUser : u
        );
        setUsers(updatedUsers);
        saveUsers(updatedUsers);
    };

    const handleMiss = () => setMissed(m => m + 1);

    useEffect(() => {
        if (gameState === "running" && missed >= 5) {
            endGame();
        }
    }, [missed, gameState]);

    useEffect(() => {
        if (gameState === "ended") {
            if (missed >= 5) setModalResult("lose");
            else setModalResult("win");
            setModalOpen(true);
        }
    }, [gameState, missed]);

    const cancelGame = () => {
        if (currentUser) {
            const updatedUsers = users.filter(
                u => u.nickname !== currentUser.nickname
            );
            setUsers(updatedUsers);
            saveUsers(updatedUsers);
        }

        clearIntervals();
        setGameState("idle");
        setBalloons([]);
        setTimeLeft(30);
        setMissed(0);
        setModalOpen(false);
        setCurrentUser(null);
        localStorage.removeItem("current_user");
    };

    useEffect(() => {
        const bgAudio = bgAudioRef.current;
        bgAudio.loop = true;

        if (currentUser?.music && gameState === "running") {
            bgAudio.play().catch(() => {}); 
        } else {
            bgAudio.pause();
        }
    }, [currentUser?.music, gameState]);


    useEffect(() => {
        const bgAudio = bgAudioRef.current;
        if (currentUser?.music) {
            bgAudio.play().catch(() => {});
        } else {
            bgAudio.pause();
        }
    }, [currentUser?.music]);


    return (
        <div className="w-full h-screen bg-[url('src/assets/images/sky.jpg')] bg-cover relative overflow-hidden">
            <div className="w-65 p-5 pr-0">
                {currentUser?.nickname && <p className="text-[18px]">Player: {currentUser?.nickname}</p>}
                <p className="text-[28px] text-red-600">Time: {timeLeft}s</p>
            </div>

            {balloons.map(b => (
                <Balloon
                    key={b.id} 
                    left={b.left} 
                    speed={getSpeed()} 
                    gameState={gameState} 
                    onPop={handlePop}
                    onMiss={handleMiss} 
                    onEnd={() => setBalloons(prev => prev.filter(x => x.id !== b.id))}
                    soundEffects={currentUser?.soundEffects || false}
                />
            ))}

            <div className="absolute right-0 top-0 w-80 bg-black/80 p-6 text-white z-20">
                <Settings
                    startTrim={startTrim}
                    setStartTrim={setStartTrim}
                    gameState={gameState}
                    onCancel={cancelGame}
                    startGame={startGame}
                    pauseGame={pauseGame}
                    continueGame={continueGame}
                    currentUser={currentUser}
                    onUserChange={(user, updatedUsers) => {
                        setCurrentUser(user);
                        setUsers(updatedUsers);
                    }}
                />
                <Leaderboard
                    usersList={users} 
                    setUsers={setUsers}
                    gameState={gameState}
                    currentUser={currentUser}
                    onUserChange={(user, updatedUsers) => { 
                        setCurrentUser(user), 
                        setUsers(updatedUsers) 
                    }}
                />
                <Modal
                    open={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    result={modalResult} 
                    points={currentUser?.points || 0}
                    onPlayAgain={() => { 
                        setModalOpen(false), 
                        startGame() 
                    }}
                />
            </div>
        </div>
    );
};

export default MainPage;