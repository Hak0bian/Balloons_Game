import { useEffect, useState } from "react";
import type { GameDifficulty, SettingsProps, User } from "../types";
import { loadUsers, saveUsers, saveCurrentUser } from "../storage";
import { IoSettingsOutline, } from "react-icons/io5";
import { Nickname, Difficulty, Sound, Buttons } from "./SettingDetails";

const Settings = ({ onUserChange, startTrim, setStartTrim, gameState, onCancel, startGame, pauseGame, continueGame, currentUser }: SettingsProps) => {
    const [nickname, setNickname] = useState("");
    const [difficulty, setDifficulty] = useState<GameDifficulty>("Easy");
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
            id: crypto.randomUUID(),
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

            <Nickname
                nickname={nickname}
                setNickname={setNickname}
                nickTrim={nickTrim}
                setNickTrim={setNickTrim}
                startTrim={startTrim}
                setStartTrim={setStartTrim}
                gameState={gameState}
            />
            <Difficulty
                gameState={gameState}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
            />
            <Sound
                music={music}
                soundEffects={soundEffects}
                handleUserSettings={handleUserSettings}
            />
            <Buttons
                gameState={gameState}
                saveSettings={saveSettings}
                onCancel={onCancel}
                startGame={startGame}
                pauseGame={pauseGame}
                continueGame={continueGame}
            />
        </div>
    );
};

export default Settings;