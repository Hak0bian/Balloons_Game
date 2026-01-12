import { useState, useEffect } from "react";
import type { User } from "../types";
import { loadUsers, saveUsers, loadCurrentUser, saveCurrentUser } from "../storage";

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>(loadUsers());
    const [currentUser, setCurrentUser] = useState<User | null>(loadCurrentUser());

    useEffect(() => {
        if (currentUser) saveCurrentUser(currentUser);
    }, [currentUser]);

    const addOrUpdateUser = (user: User) => {
        const exists = users.some(u => u.id === user.id);
        const updatedUsers = exists
            ? users.map(u => u.id === user.id ? user : u)
            : [...users, user];

        setUsers(updatedUsers);
        setCurrentUser(user);
        saveUsers(updatedUsers);
    };

    const removeCurrentUser = () => {
        if (!currentUser) return;
        const updatedUsers = users.filter(u => u.nickname !== currentUser.nickname);
        setUsers(updatedUsers);
        localStorage.setItem("game_users", JSON.stringify(updatedUsers));

        setCurrentUser(null);
        localStorage.removeItem("current_user");
    };

    return {
        users,
        currentUser,
        setCurrentUser,
        setUsers,
        addOrUpdateUser,
        removeCurrentUser
    };
};