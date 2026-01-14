import { useRef, useState } from "react";
import type { BalloonProps } from "../types";
import popSound from "../assets/sounds/pop.mp3";
import { BsBalloonFill } from "react-icons/bs";
import { classes } from "../tailwindClasses";


const Balloon = ({ left, speed, gameState, onPop, onMiss, onEnd, soundEffects, color, bonus }: BalloonProps) => {
    const colors = [ "#ef4444", "#ec4899", "#8b5cf6", "#f97316", "#ff4d6d", "#ff6ec7", "#80ed99", "#ff9f1c"];
    const [colorState] = useState(() => color ?? colors[Math.floor(Math.random() * colors.length)]);
    const [popped, setPopped] = useState(false);
    const popAudioRef = useRef(new Audio(popSound));

    const handleClick = () => {
        if (popped || gameState !== "running") return;
        setPopped(true);

        if (soundEffects) {
            popAudioRef.current.currentTime = 0;
            popAudioRef.current.play();
        }
        onPop(bonus ?? 0);
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
            <BsBalloonFill className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18" style={{ color: colorState }} />
            {colorState === "#FACC15" && <span className={classes.bonus}>+3s</span>}
        </button>
    );
};


export default Balloon;