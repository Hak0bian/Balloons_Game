import Balloon from "./Balloon";
import Settings from "./Settings";
import Leaderboard from "./Leaderboard";
import Modal from "./Modal";
import { useUsers } from "../hooks/useUsers";
import { useGame } from "../hooks/useGame";
import { useMusic } from "../hooks/useMusic";
import { useState, useEffect } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { GiTrophyCup } from "react-icons/gi";
import { BsBalloonHeartFill } from "react-icons/bs";

const MainPage = () => {
    const { users, currentUser, editingUser, setUsers, setCurrentUser, addOrUpdateUser, removeCurrentUser, startEditingUser } = useUsers();
    const { balloons, gameState, timeLeft, startTrim, modalOpen, modalResult, missed, isDesktop, setStartTrim, getSpeed, setIsDesktop,
        startGame, pauseGame, continueGame, handlePop, handleMiss, cancelGame, setBalloons, setModalOpen
    } = useGame({ currentUser, users, setUsers, setCurrentUser, removeCurrentUser });
    useMusic(currentUser, gameState);
    const heartsLeft = 5 - missed;
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        const handler = () => setIsDesktop(media.matches);
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, []);

    useEffect(() => {
        if (isDesktop) {
            setOpenIndexes([0, 1]);
        } else {
            setOpenIndexes([]);
        }
    }, [isDesktop]);

    useEffect(() => {
        if (gameState === "running" && !isDesktop) {
            setOpenIndexes([]);
        }
    }, [gameState, isDesktop]);

    const toggle = (index: number) => {
        if (isDesktop) return;

        setOpenIndexes(prev => {
            const isOpening = !prev.includes(index);

            if (isOpening && gameState === "running") {
                pauseGame();
            }
            return prev.includes(index) ? [] : [index];
        });
    };

    const closePanelsIfMobile = () => {
        if (!isDesktop) setOpenIndexes([]);
    };

    const panels = [
        {
            title: (
                <div
                    className={`flex items-center gap-1 ${isDesktop ? "pointer-events-none opacity-80" : "cursor-pointer"}`}
                    onClick={() => toggle(0)}
                >
                    <IoSettingsOutline className="w-5 h-5 text-blue-400 mt-0.5 lg:w-6 lg:h-6" />
                    <h2 className="text-[14px] lg:text-[20px]">Settings</h2>
                </div>
            ),
            content: (
                <Settings
                    startTrim={startTrim}
                    setStartTrim={setStartTrim}
                    gameState={gameState}
                    onCancel={cancelGame}
                    startGame={() => {
                        startGame();
                        closePanelsIfMobile();
                    }}
                    pauseGame={pauseGame}
                    continueGame={() => {
                        continueGame();
                        closePanelsIfMobile();
                    }}
                    currentUser={currentUser}
                    editingUser={editingUser}
                    onUserChange={addOrUpdateUser}
                />
            )
        },
        {
            title: (
                <div
                    className={`flex items-center gap-1 ${isDesktop ? "pointer-events-none opacity-80" : "cursor-pointer"}`}
                    onClick={() => toggle(1)}
                >
                    <GiTrophyCup className="w-5 h-5 text-blue-400 mt-0.5 lg:w-6 lg:h-6" />
                    <h3 className="text-[14px] lg:text-[20px]">Leaderboard</h3>
                </div>
            ),
            content: (
                <Leaderboard
                    usersList={users}
                    setUsers={setUsers}
                    gameState={gameState}
                    currentUser={currentUser}
                    onUserChange={addOrUpdateUser}
                    onUserDelete={removeCurrentUser}
                    startEditingUser={startEditingUser}
                    setCurrentUser={setCurrentUser}
                />
            )
        }
    ];

    return (
        <div className="w-full h-screen min-w-[360px] relative overflow-hidden select-none
            bg-[url('src/assets/images/bg-small.jpg')] md:bg-[url('src/assets/images/bg.jpg')] bg-cover bg-bottom md:bg-bottom-left">
            {balloons.map(b => (
                <Balloon
                    key={b.id}
                    left={b.left}
                    speed={getSpeed()}
                    gameState={gameState}
                    onPop={handlePop}
                    onMiss={handleMiss}
                    onEnd={() => setBalloons(prev => prev.filter(x => x.id !== b.id))}
                    soundEffects={currentUser?.soundEffects || false}
                    color={b.color}
                    bonus={b.bonus}
                />
            ))}

            <div className="absolute right-0 top-0 w-60 lg:w-65 bg-black/85 p-2 text-white z-10 flex flex-col gap-1">
                <div>
                    <div className="flex gap-5 lg:flex-col lg:gap-0">
                        <p className="lg:text-[24px] text-red-500 mt-0.5">Time: {timeLeft}s</p>
                        <div className="flex gap-1 mt-2">
                            {Array.from({ length: heartsLeft }).map((_, i) => (
                                <BsBalloonHeartFill key={i} className="text-red-500 w-4 h-4 lg:w-5 lg:h-5" />
                            ))}
                        </div>
                    </div>
                </div>

                {panels.map((panel, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        {panel.title}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out
                            ${openIndexes.includes(index) ? 'max-h-[600px] opacity-100 mt-2' : 'max-h-0 opacity-0'}
                        `}>
                            {panel.content}
                        </div>
                    </div>
                ))}

                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    result={modalResult}
                    points={currentUser?.points || 0}
                    missed={missed}
                    onPlayAgain={() => {
                        setModalOpen(false);
                        startGame();
                        closePanelsIfMobile();
                    }}
                />
            </div>
        </div>
    );
};

export default MainPage;