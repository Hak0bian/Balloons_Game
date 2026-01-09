import { useEffect, useState } from "react";
import type { Difficulty, SettingsProps, User } from "../types";
import { loadUsers, saveUsers, saveCurrentUser } from "../storage";
import { IoSettingsOutline, IoCloseOutline, } from "react-icons/io5";

const Settings = ({ onUserChange, startTrim, setStartTrim, gameState, onCancel, startGame, pauseGame, continueGame, currentUser }: SettingsProps) => {
    const [nickname, setNickname] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
    const [music, setMusic] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [nickTrim, setNickTrim] = useState(false)

    useEffect(() => {
        if (currentUser) {
            setNickTrim(false);
            setStartTrim(false);
        }
    }, [currentUser, setStartTrim]);

    useEffect(() => {
        if (!currentUser) return;

        setMusic(currentUser.music);
        setSoundEffects(currentUser.soundEffects);
        setDifficulty(currentUser.difficulty);
    }, [currentUser]);


    const saveSettings = () => {
        if (!nickname.trim()) {
            setNickTrim(true);
            return;
        }

        const users = loadUsers();
        const existing = users.find(u => u.nickname === nickname);
        const user: User = {
            nickname,
            points: existing?.points || 0,
            difficulty,
            music: music,
            soundEffects: soundEffects,
        };

        const updatedUsers = existing
            ? users.map(u => (u.nickname === nickname ? user : u))
            : [...users, user];

        saveUsers(updatedUsers);
        saveCurrentUser(user);
        onUserChange(user, updatedUsers);
        setNickname("");
    };

    const handleNicknameChange = (e: any) => {
        const value = e.target.value;
        setNickname(/^\s*$/.test(value) ? "" : value);
        if (nickTrim && value.trim()) setNickTrim(false);
        if (startTrim && value.trim()) setStartTrim(false);
    };


    const handleUserSettings = (key: "music" | "soundEffects", value: boolean) => {
        if (key === "music") setMusic(value);
        if (key === "soundEffects") setSoundEffects(value);

        if (!currentUser) return;
        const updatedUser = { ...currentUser, [key]: value };
        const allUsers = loadUsers();
        const updatedUsers = allUsers.map(u => u.nickname === updatedUser.nickname ? updatedUser : u);

        saveCurrentUser(updatedUser);
        saveUsers(updatedUsers);
        onUserChange(updatedUser, updatedUsers);
    };


    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <IoSettingsOutline className="w-6 h-6 text-blue-400" />
                <h2 className="text-[24px] mb-1">Settings</h2>
            </div>

            {/* Nickname */}
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

            {/* Difficulty */}
            <div>
                <p className="mb-2">Difficulty</p>
                <div className={`flex gap-3 ${gameState === "running" || gameState === "paused" ? "pointer-events-none filter grayscale-50" : ""}`}>
                    {(["Easy", "Medium", "Hard"] as Difficulty[]).map((d) => (
                        <button
                            key={d}
                            onClick={() => setDifficulty(d)}
                            className={`w-full h-9 border-2 border-blue-400 cursor-pointer rounded-full
                                ${difficulty === d
                                    ? "bg-blue-400 text-white"
                                    : "bg-transparent text-blue-400"
                                }`}
                        >
                            {d}
                        </button>
                    ))}
                </div>
            </div>

            {/* Sound settings */}
            <div>
                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        checked={music}
                        onChange={(e) => handleUserSettings("music", e.target.checked)}
                        className="w-4"
                    />
                    <span>Music</span>
                </div>

                <div className="flex gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={soundEffects}
                        className="w-4"
                        onChange={(e) => handleUserSettings("soundEffects", e.target.checked)}
                    />
                    <span>Sound Effects</span>
                </div>
            </div>

            {/* Save or New Player */}
            {gameState === "idle" || gameState === "ended" ? (
                <button
                    onClick={saveSettings}
                    className="w-full h-9 border-2 border-blue-400 text-blue-400 cursor-pointer rounded-full hover:bg-blue-400 hover:text-white transition-all"
                >
                    Save
                </button>
            ) : (
                <button
                    onClick={onCancel}
                    className="w-full h-9 border-2 border-red-500 text-red-500 cursor-pointer rounded-full
                        hover:bg-red-500 hover:text-white transition-all"
                >
                    New Player
                </button>
            )}

            {/* Start | Restart | Stop | Continue */}
            <div className="flex gap-3">
                {gameState !== "running" && gameState !== "paused" && (
                    <button onClick={startGame} className="w-full h-9 border-2 border-blue-400 rounded-full bg-blue-400 cursor-pointer hover:bg-transparent transition-all transition-300">Start</button>
                )}
                {gameState === "running" && (
                    <>
                        <button onClick={startGame} className="w-full h-9 border-2 border-blue-400 rounded-full bg-blue-400 cursor-pointer hover:bg-transparent transition-all transition-300">Restart</button>
                        <button onClick={pauseGame} className="w-full h-9 border-2 border-blue-400 rounded-full cursor-pointer hover:bg-blue-400 transition-all transition-300">Stop</button>
                    </>
                )}
                {gameState === "paused" && (
                    <button onClick={continueGame} className="w-full h-9 border-2 border-blue-400 rounded-full cursor-pointer hover:bg-blue-400 transition-all transition-300">Continue</button>
                )}
            </div>

        </div>
    );
};

export default Settings;