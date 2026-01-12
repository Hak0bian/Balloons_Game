import { classes } from "../../tailwindClasses"
import type { ButtonsProps } from "../../types"

const Buttons = ({ gameState, saveSettings, onCancel, startGame, pauseGame, continueGame} : ButtonsProps) => {
    return (
        <div>
            {
                gameState === "idle" || gameState === "ended"
                    ? (<button onClick={saveSettings} className={`${classes.transparentBtn} mb-3`}>Save</button>)
                    : (<button onClick={onCancel} className={classes.cancelBtn}>New Player</button>)
            }

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
    )
}

export default Buttons