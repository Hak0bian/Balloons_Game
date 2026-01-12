import Balloon from "./Balloon";
import Settings from "./Settings";
import Leaderboard from "./Leaderboard";
import Modal from "./Modal";
import { useUsers } from "../hooks/useUsers";
import { useGame } from "../hooks/useGame";
import { useMusic } from "../hooks/useMusic";


const MainPage = () => {
    const { users, currentUser, setUsers, setCurrentUser, addOrUpdateUser, removeCurrentUser } = useUsers();
    const { balloons, gameState, timeLeft, startTrim, setStartTrim, getSpeed, startGame,pauseGame, continueGame, 
            handlePop, handleMiss, cancelGame, setBalloons, modalOpen, setModalOpen, modalResult, cancelAfterGame
        } = useGame({ currentUser, users, setUsers, setCurrentUser, removeCurrentUser });
    useMusic(currentUser, gameState);


    return (
        <div className="w-full h-screen bg-[url('src/assets/images/sky.jpg')] bg-cover relative overflow-hidden">
            <div className="w-65 p-5 pr-0">
                {currentUser?.nickname && <p className="text-[18px]">Player: {currentUser?.nickname}</p>}
                <p className="text-[28px] text-red-600">Time: {timeLeft}s</p>
            </div>

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
                />
            ))}

            <div className="absolute right-0 top-0 w-80 bg-black/80 p-6 text-white z-20">
                <Settings
                    startTrim={startTrim}
                    setStartTrim={setStartTrim}
                    gameState={gameState}
                    onCancel={cancelGame}
                    startGame={startGame}
                    pauseGame={pauseGame}
                    continueGame={continueGame}
                    currentUser={currentUser}
                    onUserChange={addOrUpdateUser}
                />

                <Leaderboard
                    usersList={users}
                    setUsers={setUsers}
                    gameState={gameState}
                    currentUser={currentUser}
                    onUserChange={addOrUpdateUser}
                    onUserDelete={removeCurrentUser}
                />
                <Modal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    result={modalResult}
                    points={currentUser?.points || 0}
                    onCancel={cancelAfterGame}
                    onPlayAgain={() => {
                        setModalOpen(false);
                        startGame();
                    }}
                />
            </div>
        </div>
    );
};

export default MainPage;