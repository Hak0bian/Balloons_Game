import { useState } from "react";
import type { Difficulty, SettingsProps, User } from "../types";
import { loadUsers, saveUsers, saveCurrentUser } from "../storage";
import { IoSettingsOutline, IoCloseOutline, } from "react-icons/io5";

const Settings = ({ onUserChange, startTrim, setStartTrim }: SettingsProps) => {
    const [nickname, setNickname] = useState("");
    const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
    const [soundEffects, setSoundEffects] = useState(true);
    const [music, setMusic] = useState(true);
    const [nickTrim, setNickTrim] = useState(false)

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
            soundEffects: existing ? soundEffects : true,
            music: existing ? music : true,
        };

        const updatedUsers = existing
            ? users.map(u => (u.nickname === nickname ? user : u))
            : [...users, user];

        saveUsers(updatedUsers);
        saveCurrentUser(user);
        onUserChange(user, updatedUsers);
        setNickname("");

        if (!existing) {
            setSoundEffects(true);
            setMusic(true);
        }
    };

    const handleNicknameChange = (e: any) => {
        const value = e.target.value;
        setNickname(/^\s*$/.test(value) ? "" : value);
        if (nickTrim && value.trim()) setNickTrim(false);
        if (startTrim && value.trim()) setStartTrim(false);
    };


    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
                <IoSettingsOutline className="w-6 h-6 text-blue-400" />
                <h2 className="text-[24px] mb-1">Settings</h2>
            </div>

            {/* Nickname */}
            <div>
                <p className="mb-1">Create New User</p>
                <div className="border border-blue-400 relative pr-5">
                    <input
                        value={nickname}
                        className="w-full h-9 text-[14px] pl-3 outline-0"
                        placeholder="Nickname"
                        maxLength={15}
                        onChange={handleNicknameChange}
                    />
                    <button
                        className="absolute right-0 top-2 cursor-pointer"
                        onClick={() => setNickname("")}
                    >
                        <IoCloseOutline className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                {nickTrim && <p className="text-[12px] text-red-500 mt-1 tracking-wider">Nickname Required!</p>}
                {startTrim && <p className="text-[12px] text-red-500 mt-1 tracking-wider">Please write nickname and save</p>}
            </div>

            {/* Difficulty */}
            <div>
                <p className="mb-2">Difficulty</p>
                <div className="flex gap-3">
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
                <div className="flex gap-2 mb-2">
                    <input
                        type="checkbox"
                        checked={soundEffects}
                        onChange={() => setSoundEffects(!soundEffects)}
                        className="w-4"
                    />
                    <span>Sound Effects</span>
                </div>

                <div className="flex gap-2">
                    <input
                        type="checkbox"
                        checked={music}
                        onChange={() => setMusic(!music)}
                        className="w-4"
                    />
                    <span>Music</span>
                </div>
            </div>

            <button
                onClick={saveSettings}
                className="w-full h-9 border-2 border-blue-400 text-blue-400 cursor-pointer rounded-full hover:bg-blue-400 hover:text-white transition-all transition-300"
            >
                Save
            </button>
        </div>
    );
};

export default Settings;