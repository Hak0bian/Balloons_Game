import { IoCloseOutline, } from "react-icons/io5";
import type { NicknameProps } from "../../types";

const Nickname = ({ nickname, setNickname, nickTrim, setNickTrim, startTrim, setStartTrim, gameState } : NicknameProps) => {

    const handleNicknameChange = (e: any) => {
        const value = e.target.value;
        setNickname(/^\s*$/.test(value) ? "" : value);
        if (nickTrim && value.trim()) setNickTrim(false);
        if (startTrim && value.trim()) setStartTrim(false);
    };

    return (
        <div>
            <p className="mb-1">Create New Player</p>
            <div className={`border relative pr-5 
                    ${nickTrim || startTrim ? "border-red-500" : "border-blue-400"}
                    ${gameState === "running" || gameState === "paused" ? "pointer-events-none filter grayscale-50" : ""}
                `}>
                <input
                    value={nickname}
                    className="w-full h-9 text-[14px] pl-3 outline-0"
                    placeholder="Nickname"
                    onChange={handleNicknameChange}
                    disabled={gameState === "running" || gameState === "paused"}
                    maxLength={15}
                    autoFocus
                />
                <button
                    className="absolute right-0 top-2 cursor-pointer"
                    onClick={() => setNickname("")}
                >
                    <IoCloseOutline className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            {(nickTrim || startTrim) && (
                <p className="text-[12px] text-red-500 mt-1 tracking-wider">
                    {nickTrim ? "Nickname Required!" : "Please create or select nickname"}
                </p>
            )}
        </div>
    )
}

export default Nickname