export type GameDifficulty = "Easy" | "Medium" | "Hard";
export type GameState = "idle" | "running" | "paused" | "ended";

export interface User {
    id: string; 
    nickname: string;
    points: number;
    difficulty: GameDifficulty;
    soundEffects: boolean;
    music: boolean;
}

export interface BalloonType {
    id: number;
    left: number;
}

export interface SettingsProps {
    onUserChange: (user: User, users: User[]) => void;
    startTrim: boolean;
    setStartTrim: (v: boolean) => void;
    gameState: "idle" | "running" | "paused" | "ended";
    onCancel: () => void;
    startGame: () => void;
    pauseGame: () => void;
    continueGame: () => void;
    currentUser: User | null;
}

export interface BalloonProps {
    left: number;
    speed: number;
    gameState: "idle" | "running" | "paused" | "ended";
    onPop: () => void;
    onMiss: () => void;
    onEnd: () => void;
    soundEffects: boolean
}

export interface LeaderboardProps {
    usersList: User[];
    setUsers: (users: User[]) => void;
    gameState: "idle" | "running" | "paused" | "ended";
    currentUser: User | null;
    onUserChange: (user: User, users: User[]) => void;
    onUserDelete: (nickname: string) => void;
}

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    result: "win" | "lose";
    points: number;
    onPlayAgain: () => void;
    onCancel: () => void;
}

export interface UseGameProps {
    currentUser: User | null;
    users: User[];
    setUsers: (users: User[]) => void;
    setCurrentUser: (user: User | null) => void;
    removeCurrentUser: () => void
}

export interface NicknameProps {
    nickname: string;
    setNickname: (value: string) => void;
    nickTrim: boolean;
    setNickTrim: (value: boolean) => void;
    startTrim: boolean;
    setStartTrim: (value: boolean) => void;
    gameState: "idle" | "running" | "paused" | "ended";
}

export interface DifficultyProps {
    gameState: "idle" | "running" | "paused" | "ended";
    difficulty: "Easy" | "Medium" | "Hard";
    setDifficulty: (value: "Easy" | "Medium" | "Hard") => void;
}

export interface SoundProps {
    music: boolean;
    soundEffects: boolean;
    handleUserSettings: (key: "music" | "soundEffects", value: boolean) => void;
}

export interface ButtonsProps {
    gameState: "idle" | "running" | "paused" | "ended";
    saveSettings: () => void;
    onCancel: () => void;
    startGame: () => void;
    pauseGame: () => void;
    continueGame: () => void;
}

