import type { SoundProps } from "../../types"

const Sound = ({ music, soundEffects, handleUserSettings } : SoundProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={music}
                    onChange={(e) => handleUserSettings("music", e.target.checked)}
                    className="w-4 h-4"
                />
                <span>Music</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
                <input
                    type="checkbox"
                    checked={soundEffects}
                    onChange={(e) => handleUserSettings("soundEffects", e.target.checked)}
                    className="w-4 h-4"
                />
                <span>Sound Effects</span>
            </label>
        </div>
    )
}

export default Sound