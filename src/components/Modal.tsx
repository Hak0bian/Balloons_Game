import { Dialog, DialogContent, IconButton } from '@mui/material';
import { IoCloseOutline } from "react-icons/io5";
import type { ModalProps } from '../types';
import { useEffect } from 'react';
import winSound from "../assets/sounds/win.mp3"
import loseSound from "../assets/sounds/lose.mp3"


const Modal = ({ open, onClose, result, points, missed, onPlayAgain } : ModalProps) => {
    const resultText = result === "win" ? "You Win!" : "You Lose!";

    useEffect(() => {
        if (!open) return;
        const audio = new Audio(result === "win" ? winSound : loseSound);
        audio.play().catch(err => console.log("Audio play failed:", err));
    }, [open, result]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogContent sx={{ position: "relative", p: 0 }}>
                <IconButton
                    onClick={onClose}
                    sx={{ position: "absolute", top: 4, right: 4, color: "black" }}
                >
                    <IoCloseOutline size={24} />
                </IconButton>

                <div className="bg-blue-400 p-10 flex flex-col items-center gap-4">
                    <h2 className="text-[28px] font-bold">{resultText}</h2>
                    <div className='text-center text-lg'>
                        <p>Your Points: {points}</p>
                        <p>Missed: {missed}</p>
                    </div>
                    <div>
                        <button
                            onClick={onPlayAgain}
                            className="mt-4 w-full py-2 border-2 text-black rounded-full hover:bg-black/70 hover:text-white cursor-pointer transition"
                        >
                            Play Again
                        </button>
                        <button 
                            onClick={onClose}
                            className="mt-4 w-full py-2 border-2 text-black rounded-full hover:bg-black/70 hover:text-white cursor-pointer transition">
                            New Player
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;