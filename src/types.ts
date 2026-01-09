export type Difficulty = "Easy" | "Medium" | "Hard";

export interface User {
    nickname: string;
    points: number;
    difficulty: Difficulty;
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
}

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    result: "win" | "lose";
    points: number;
    onPlayAgain: () => void;
}