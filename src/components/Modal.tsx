import { Dialog, DialogContent, IconButton } from '@mui/material';
import { IoCloseOutline } from "react-icons/io5";
import type { ModalProps } from '../types';


const Modal = ({ open, onClose, result, points, onPlayAgain, onCancel } : ModalProps) => {
    const resultText = result === "win" ? "You Win!" : "You Lose!";

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
                    <p className="text-lg">Your Points: {points}</p>
                    <div>
                        <button
                            onClick={onPlayAgain}
                            className="mt-4 w-full py-2 border-2 text-black rounded-full hover:bg-black/70 hover:text-white cursor-pointer transition"
                        >
                            Play Again
                        </button>
                        <button 
                            onClick={onCancel}
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