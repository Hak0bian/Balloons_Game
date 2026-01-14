import { IoCloseOutline, } from "react-icons/io5";
import type { NicknameProps } from "../../types";
import { loadUsers } from "../../storage";
import { useEffect } from "react";

const Nickname = ({ 
    nickname, setNickname,
    nickTrim, setNickTrim,
    startTrim, setStartTrim, 
    duplicate, setDuplicate,
    gameState, currentUser, editingUser,
}: NicknameProps) => {

    useEffect(() => {
        if (editingUser) {
            setNickname(editingUser.nickname);
        } else if (currentUser) {
            setNickname(currentUser.nickname);
        }
        setStartTrim(false);
        setNickTrim(false);
        setDuplicate(false);
    }, [editingUser?.id, currentUser?.id]);


    const handleNicknameChange = (e: any) => {
        const value = e.target.value;
        setNickname(/^\s*$/.test(value) ? "" : value);

        if (nickTrim && value.trim()) setNickTrim(false);
        if (startTrim && value.trim()) setStartTrim(false);

        const users = loadUsers();
        const isDuplicate = users.some(u => u.nickname === value.trim());
        setDuplicate(isDuplicate);
    };

    return (
        <div>
            <p className="mb-1 text-[14px]">Create New Player</p>
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
                    maxLength={14}
                    autoFocus
                />
                <button onClick={() => setNickname("")} className="absolute right-0 top-2 cursor-pointer">
                    <IoCloseOutline className="w-5 h-5 text-gray-400" />
                </button>
            </div>
            {(nickTrim || startTrim || duplicate) && (
                <p className="text-[12px] text-red-500 mt-1 tracking-wider">
                    {nickTrim || startTrim
                        ? nickTrim
                            ? "Nickname Required!"
                            : "Please create or select nickname"
                        : "This nickname is already taken!"}
                </p>
            )}
        </div>
    )
}

export default Nickname