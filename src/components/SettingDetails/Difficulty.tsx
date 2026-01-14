import type { DifficultyProps, GameDifficulty } from "../../types"

const Difficulty = ({ gameState, difficulty, setDifficulty }: DifficultyProps) => {
    return (
        <div>
            <p className="mb-2 text-[14px]">Difficulty</p>
            <div className={`flex gap-1 ${gameState === "running" || gameState === "paused" ? "pointer-events-none filter grayscale-50" : ""}`}>
                {(["Easy", "Medium", "Hard"] as GameDifficulty[]).map((d) => (
                    <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={
                            `w-full h-8 text-[14px] border-2 border-blue-400 cursor-pointer rounded-full
                            ${difficulty === d ? "bg-blue-400 text-white" : "bg-transparent text-blue-400 transition-all"}`
                        }>
                        {d}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Difficulty