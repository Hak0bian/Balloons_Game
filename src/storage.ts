import type { User } from "./types";

const USERS_KEY = "game_users";
const CURRENT_USER_KEY = "current_user";

export const loadUsers = (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loadCurrentUser = (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
};

export const saveCurrentUser = (user: User) => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const handleClear = () => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
};