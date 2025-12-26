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
    startTrim: boolean
    setStartTrim: (value: boolean) => void;
}

export interface BalloonProps {
    left: number;
    speed: number;
    gameState: "idle" | "running" | "paused" | "ended";
    onPop: () => void;
    onMiss: () => void;
    onEnd: () => void;
}

export interface LeaderboardProps {
    usersList: User[];
    setUsers: (users: User[]) => void;
    onUserChange: (user: User, users: User[]) => void;
}

export interface ModalProps {
    open: boolean;
    onClose: () => void;
    result: "win" | "lose";
    points: number;
    onPlayAgain: () => void;
}