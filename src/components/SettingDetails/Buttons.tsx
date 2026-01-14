import { classes } from "../../tailwindClasses";
import type { ButtonsProps } from "../../types";

const Buttons = ({ gameState, saveSettings, onCancel, startGame, pauseGame, continueGame, isEditing }: ButtonsProps) => {
    return (
        <div>
            {/* Save / Save Edits */}
            {(gameState === "idle" || gameState === "ended") && (
                <button onClick={saveSettings} className={`${classes.transparentBtn} mb-3`}>
                    {isEditing ? "Save Edits" : "Save"}
                </button>
            )}

            {/* Delete Player */}
            {!(gameState === "idle" || gameState === "ended") && (
                <button onClick={onCancel} className={classes.cancelBtn}>
                    Delete Player
                </button>
            )}

            {/* Start / Restart / Stop / Continue */}
            <div className="flex gap-3">
                {gameState !== "running" && gameState !== "paused" && (
                    <button onClick={startGame} className={classes.filledBtn}>Start</button>
                )}
                {gameState === "running" && (
                    <>
                        <button onClick={startGame} className={classes.filledBtn}>Restart</button>
                        <button onClick={pauseGame} className={classes.transparentBtn}>Stop</button>
                    </>
                )}
                {gameState === "paused" && (
                    <button onClick={continueGame} className={classes.transparentBtn}>Continue</button>
                )}
            </div>
        </div>
    );
};

export default Buttons;