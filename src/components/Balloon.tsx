import { BsBalloonHeartFill } from "react-icons/bs";
import { useState } from "react";
import type { BalloonProps } from "../types";

const colors = ["#ef4444", "#ec4899", "#8b5cf6", "#3b82f6", "#22c55e", "#f97316"];

const Balloon = ({left, speed, gameState, onPop, onMiss, onEnd}: BalloonProps) => {
    const [popped, setPopped] = useState(false);
    const [color] = useState(() => colors[Math.floor(Math.random() * colors.length)])

    const handleClick = () => {
        if (popped || gameState !== "running") return;
        setPopped(true);
        onPop();
        setTimeout(onEnd, 300);
    };

    return (
        <button
            onClick={handleClick}
            onAnimationEnd={() => {
                if (!popped && gameState === "running") {
                    onMiss();
                    onEnd();
                }
            }}
            className={`absolute bottom-0 float-up transition-all duration-300 cursor-pointer ${popped ? "scale-150 opacity-0" : ""}`}
            style={{
                left: `${left}%`,
                animationDuration: `${speed}s`,
                animationPlayState: gameState === "paused" ? "paused" : "running",
                pointerEvents: gameState === "running" ? "auto" : "none",
            }}
        >
            <BsBalloonHeartFill className="w-15 h-15" style={{ color }} />
        </button>
    );
};

export default Balloon;