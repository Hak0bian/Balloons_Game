import { useState, useRef, useEffect } from "react";
import type { BalloonType, UseGameProps } from "../types";
export type GameState = "idle" | "running" | "paused" | "ended";


export const useGame = ({ currentUser, users, setUsers, setCurrentUser, removeCurrentUser }: UseGameProps) => {
    const [balloons, setBalloons] = useState<BalloonType[]>([]);
    const [gameState, setGameState] = useState<GameState>("idle");
    const [timeLeft, setTimeLeft] = useState(30);
    const [missed, setMissed] = useState(0);
    const [startTrim, setStartTrim] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalResult, setModalResult] = useState<"win" | "lose">("win");
    const spawnRef = useRef<number | null>(null);
    const timerRef = useRef<number | null>(null);

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
            setBalloons(prev => [...prev, { id: Math.random(), left: Math.random() * 75 }]);
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
            setStartTrim(true);
            setGameState("idle");
            return;
        }
        setStartTrim(false);
        clearIntervals();
        setBalloons([]);
        setTimeLeft(30);
        setMissed(0);
        setGameState("running");

        if (currentUser) {
            const resetUser = { ...currentUser, points: 0 };
            setCurrentUser(resetUser);

            const updatedUsers = users.map(u =>
                u.nickname === resetUser.nickname ? resetUser : u
            );
            setUsers(updatedUsers);
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

        if (missed >= 5) setModalResult("lose");
        else setModalResult("win");
        setModalOpen(true);
    };

    const handlePop = () => {
        if (!currentUser) return;
        const updatedUser = { ...currentUser, points: currentUser.points + 1 };
        setCurrentUser(updatedUser);

        const updatedUsers = users.map(u =>
            u.nickname === updatedUser.nickname ? updatedUser : u
        );
        setUsers(updatedUsers);
    };

    const cancelGame = () => {
        clearIntervals();
        setGameState("idle");
        setBalloons([]);
        setTimeLeft(30);
        setMissed(0);
        setStartTrim(false);
        removeCurrentUser()
    };

    const cancelAfterGame = () => {
        cancelGame()
        setModalOpen(false)
    }
    
    const handleMiss = () => setMissed(m => m + 1);

    useEffect(() => {
        if (gameState === "running" && missed >= 5) {
            endGame();
        }
    }, [missed, gameState]);


    return { 
        balloons, gameState, timeLeft, startTrim, setStartTrim, getSpeed, startGame, 
        pauseGame, continueGame, endGame, handlePop, handleMiss, cancelGame, setBalloons, modalOpen, setModalOpen, modalResult, cancelAfterGame
    };
};