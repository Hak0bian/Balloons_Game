import { useEffect, useState } from "react";
import type { GameDifficulty, SettingsProps, User } from "../types";
import { loadUsers, saveUsers, saveCurrentUser } from "../storage";
import { Nickname, Difficulty, Sound, Buttons } from "./SettingDetails";


const Settings = ({ startTrim, gameState, currentUser, editingUser,
    onUserChange, setStartTrim, onCancel, startGame, pauseGame, continueGame }: SettingsProps) => {
    const [nickname, setNickname] = useState("");
    const [difficulty, setDifficulty] = useState<GameDifficulty>("Easy");
    const [music, setMusic] = useState(true);
    const [soundEffects, setSoundEffects] = useState(true);
    const [nickTrim, setNickTrim] = useState(false)
    const [duplicate, setDuplicate] = useState(false);

    useEffect(() => {
        if (editingUser) {
            setNickname(editingUser.nickname);
            setDifficulty(editingUser.difficulty);
            setMusic(editingUser.music);
            setSoundEffects(editingUser.soundEffects);
            setStartTrim(false);
        }
    }, [editingUser]);

    useEffect(() => {
        if (!currentUser || editingUser) return;
        setDifficulty(currentUser.difficulty);
        setMusic(currentUser.music);
        setSoundEffects(currentUser.soundEffects);
    }, [currentUser?.id]);

    const saveSettings = () => {
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            setNickTrim(true);
            return;
        }
        const users = loadUsers();

        // duplicate
        const isDuplicate = users.some(u => u.nickname === trimmedNickname && (!editingUser || u.id !== editingUser.id));
        if (isDuplicate) {
            setDuplicate(true);
            return;
        }

        // Save/Save Edits
        setDuplicate(false);

        let user: User;
        if (editingUser) {
            user = {
                ...editingUser,
                nickname: trimmedNickname,
                difficulty,
                music,
                soundEffects,
            };
        } else {
            user = {
                id: Date.now().toString(),
                nickname: trimmedNickname,
                points: 0,
                difficulty,
                music,
                soundEffects,
            };
        }

        // Save users/currentUser
        const updatedUsers = users.map(u => u.id === user.id ? user : u);
        if (!updatedUsers.some(u => u.id === user.id)) updatedUsers.push(user);

        saveUsers(updatedUsers);
        saveCurrentUser(user);
        onUserChange(user, updatedUsers);
        setNickname("");
        setNickTrim(false);
        setStartTrim(false);

        if (!editingUser) {
            setNickname("");
            setDifficulty("Easy");
            setMusic(true);
            setSoundEffects(true);
        }
    };


    const handleUserSettings = (key: "music" | "soundEffects", value: boolean) => {
        if (key === "music") setMusic(value);
        if (key === "soundEffects") setSoundEffects(value);
        if (!currentUser) return;
        const updatedUser = { ...currentUser, [key]: value };
        const allUsers = loadUsers();
        const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);

        saveCurrentUser(updatedUser);
        saveUsers(updatedUsers);
        onUserChange(updatedUser, updatedUsers);
    };

    return (
        <div className="flex flex-col gap-3 mb-4">
            <Nickname
                nickname={nickname}
                setNickname={setNickname}
                nickTrim={nickTrim}
                setNickTrim={setNickTrim}
                startTrim={startTrim}
                setStartTrim={setStartTrim}
                duplicate={duplicate}
                setDuplicate={setDuplicate}
                currentUser={currentUser}
                editingUser={editingUser}
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
                isEditing={!!editingUser}
            />
        </div>
    );
};

export default Settings;