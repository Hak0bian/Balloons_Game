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
    color?: string;
    bonus?: number;
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
    editingUser?: User | null;
}

export interface BalloonProps {
    left: number;
    speed: number;
    gameState: GameState;
    onPop: (bonusSeconds?: number) => void;
    onMiss: () => void;
    onEnd: () => void;
    soundEffects?: boolean;
    color?: string;
    bonus?: number;
};

export interface LeaderboardProps {
    usersList: User[];
    setUsers: (users: User[]) => void;
    gameState: "idle" | "running" | "paused" | "ended";
    currentUser: User | null;
    onUserChange: (user: User, users: User[]) => void;
    onUserDelete: (user: User) => void;
    startEditingUser: (user: User) => void
    setCurrentUser: (user: User | null) => void;
}

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    result: "win" | "lose";
    points: number;
    onPlayAgain: () => void;
    missed: number
}



export interface NicknameProps {
    gameState: "idle" | "running" | "paused" | "ended";
    currentUser?: User | null;
    editingUser?: User | null;
    nickname: string;
    nickTrim: boolean;
    startTrim: boolean;
    duplicate: boolean;
    setNickname: (value: string) => void;
    setNickTrim: (value: boolean) => void;
    setStartTrim: (value: boolean) => void;
    setDuplicate: (value: boolean) => void;
};


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
    isEditing: boolean
}

export interface UseGameProps {
    currentUser: User | null;
    users: User[];
    setUsers: (users: User[]) => void;
    setCurrentUser: (user: User | null) => void;
    removeCurrentUser: () => void
}

export interface useSettingsProps {
    currentUser: User | null,
    editingUser: User | null,
    setStartTrim: (v: boolean) => void
    onUserChange: (user: User, users: User[]) => void
}