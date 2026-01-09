import { handleClear, saveUsers } from "../storage";
import type { LeaderboardProps, User } from "../types";
import { GiTrophyCup } from "react-icons/gi";
import { FaMedal } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { AiOutlineCheck } from "react-icons/ai";
import { useState } from "react";


const Leaderboard = ({ usersList, setUsers, gameState, currentUser, onUserChange }: LeaderboardProps) => {
    const sorted = [...usersList].sort((a, b) => b.points - a.points);
    const medalColors = ["#FACC15", "#C0C0C0", "#CD7F32"];
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");

    const handleClearList = () => {
        handleClear();
        setUsers([]);
    };

    const handleEditClick = (i: number, nickname: string) => {
        setEditingIndex(i);
        setEditValue(nickname);
    };

    const handleNicknameClick = (user: User) => {
        onUserChange(user, usersList);
    };

    const handleSaveClick = (i: number) => {
        if (editingIndex === null) return;
        const oldUser = sorted[i];
        const trimmed = editValue.trim();
        if (!trimmed) return alert("Nickname cannot be empty!");

        if (trimmed !== oldUser.nickname) {
            const updatedUser: User = { ...oldUser, nickname: trimmed };
            const updatedUsers = usersList.map(u =>
                u.nickname === oldUser.nickname ? updatedUser : u
            );
            setUsers(updatedUsers);
            saveUsers(updatedUsers);
            if (currentUser?.nickname === oldUser.nickname) {
            onUserChange(updatedUser, updatedUsers);
        }
        }
        setEditingIndex(null);
    };

    return (
        <div>
            <div className="border-t mt-10 pr-2 py-5 text-sm max-h-100 overflow-y-auto">
                <div className="flex items-center gap-2 mb-5">
                    <GiTrophyCup className="w-6 h-6 text-blue-400" />
                    <h3 className="text-[24px] mb-0.5">Leaderboard</h3>
                </div>

                {sorted.map((u, i) => (
                    <div key={u.nickname} className="flex justify-between items-center my-1">
                        <div className="flex items-center gap-2">
                            {i < 3 && <FaMedal style={{ color: medalColors[i] }} />}
                            {editingIndex === i ? (
                                <input
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className="border-b border-gray-400 outline-none px-1"
                                    maxLength={15}
                                    autoFocus
                                />
                            ) : (
                                <p onClick={() => handleNicknameClick(u)} className="cursor-pointer hover:underline">
                                    {i + 1}. {u.nickname}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <span>{u.points}</span>
                            {editingIndex === i ? (
                                <button onClick={() => handleSaveClick(i)}>
                                    <AiOutlineCheck className="w-5 h-5 text-green-500 cursor-pointer" />
                                </button>
                            ) : (
                                <button onClick={() => handleEditClick(i, u.nickname)}>
                                    <CiEdit className="w-4 h-4 text-blue-400 cursor-pointer" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {usersList.length > 0 && (
                <button
                    onClick={handleClearList}
                    className={`w-full h-9 border-2 border-blue-400 text-blue-400 cursor-pointer mt-5 rounded-full
                        ${gameState === "running" || gameState === "paused" ? "pointer-events-none filter grayscale-50" : ""}
                    `}>
                    Clear List
                </button>
            )}
        </div>
    );
};

export default Leaderboard;