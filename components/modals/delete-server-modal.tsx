"use client";

import { useState } from "react";
import { useModal } from "@/hooks/use-modal-store";
import axios from "axios";
import { useRouter } from "next/navigation";

//Components

import { 
    Dialog,

    DialogHeader,
    
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

export const DeleteServerModal = () => {
    const router = useRouter();
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "deleteServer";
    const { server } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);

            onClose();
            router.refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className=" text 2xl text-center font-bold">
                        Deletar o Servidor
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Tem certeza que deseja deletar o servidor? <br/>
                        <span className="font-semibold text-rose-500 text-indigo-">{server?.name} </span> será deletado permanentemente!
                        
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            disabled={isLoading}
                            onClick={onClick}
                            variant="destructive"
                        >
                            Deletar
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}