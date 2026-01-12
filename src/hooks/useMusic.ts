import { useEffect, useRef } from "react";
import bgMusic from "../assets/sounds/bg-music.mp3";
import type { User, GameState } from "../types";

export const useMusic = (user: User | null, gameState: GameState) => {
    const audioRef = useRef(new Audio(bgMusic));

    useEffect(() => {
        const audio = audioRef.current;
        audio.loop = true;

        if (user?.music && gameState === "running") {
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    }, [user?.music, gameState]);
};