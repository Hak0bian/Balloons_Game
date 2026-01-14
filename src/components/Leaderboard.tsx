import { handleClear, saveUsers } from "../storage";
import type { LeaderboardProps, User } from "../types";
import { FaMedal } from "react-icons/fa";
import { BiSolidEditAlt } from "react-icons/bi";
import { RiDeleteBinLine } from "react-icons/ri";

const Leaderboard = ({ 
    usersList, gameState, currentUser,
    setUsers, setCurrentUser, onUserChange, 
    onUserDelete, startEditingUser 
}: LeaderboardProps) => {
    const sorted = [...usersList].sort((a, b) => b.points - a.points);
    const medalColors = ["#FACC15", "#C0C0C0", "#CD7F32"];

    const handleDeleteUser = (user: User) => {
        const updatedUsers = usersList.filter(u => u.id !== user.id);
        setUsers(updatedUsers);
        saveUsers(updatedUsers);

        if (currentUser?.id === user.id) {
            onUserDelete(user);
        }
    };

    const handleClearList = () => {
        handleClear();
        setUsers([]);
        setCurrentUser(null)
    };

    const handleNicknameClick = (user: User) => {
        onUserChange(user, usersList);
    };

    return (
        <div className={`${gameState === "running" || gameState === "paused" ? "pointer-events-none filter grayscale-50" : ""}`}>
            <div className="border-t mt-2 pr-2 py-5 max-h-100 overflow-y-auto">
                {
                    usersList.length > 0 ? (
                        <div>
                            {sorted.map((u, i) => (
                                <div key={u.id} className="flex justify-between items-center my-1">
                                    <div className="flex items-center gap-1 text-[12px] lg:text-[14px]">
                                        {i < 3 && <FaMedal style={{ color: medalColors[i] }} />}
                                        <p
                                            onClick={() => handleNicknameClick(u)}
                                            className="cursor-pointer hover:underline"
                                        >
                                            {(i >= 3 ? `${i + 1}. ` : '')}
                                            {u.nickname}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1 lg:gap-2">
                                        <span>{u.points}</span>
                                        <button onClick={() => startEditingUser(u)}>
                                            <BiSolidEditAlt className="w-4 h-4 text-blue-400 cursor-pointer" />
                                        </button>
                                        <button onClick={() => handleDeleteUser(u)}>
                                            <RiDeleteBinLine className="w-4 h-4 text-red-400 cursor-pointer" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={handleClearList}
                                className={`w-full h-8 text-[14px] border-2 border-blue-400 text-blue-400 cursor-pointer mt-5 rounded-full
                                ${gameState === "running" || gameState === "paused" ? "pointer-events-none filter grayscale-50" : ""}
                            `}>
                                Clear List
                            </button>
                        </div>
                    ) : (
                        <p className="text-center text-[12px]">
                            No players yet!
                            <br />
                            Create a new player to get started
                        </p>
                    )
                }
            </div>
        </div>
    );
};

export default Leaderboard;