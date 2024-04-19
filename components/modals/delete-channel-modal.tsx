"use client";

import qs from "query-string"
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

export const DeleteChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {

        try {
            setIsLoading(true);
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id
                }
            });

            await axios.delete(url);

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
                        Deletar o Canal
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Tem certeza que deseja deletar o canal? <br />
                        <span className="font-semibold text-rose-500 text-indigo-">#{channel?.name} </span> será deletado permanentemente!
                        
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            aria-disabled={isLoading}
                            onClick={onClose}
                            variant="ghost"
                        >
                            Cancelar
                        </Button>
                        <Button 
                            disabled={isLoading}
                            aria-disabled={isLoading}
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