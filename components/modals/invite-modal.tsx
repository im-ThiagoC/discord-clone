"use client";

import axios from "axios";
import { useState } from "react";
import { useOrigin } from "@/hooks/use-origin";
import { useModal } from "@/hooks/use-modal-store";

//Components
import { Check, Copy, RefreshCcw } from "lucide-react";

import { 
    Dialog,

    DialogHeader,
    
    DialogTitle,
    DialogContent,
    DialogDescription,
    
    DialogTrigger,
    DialogClose,

} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)
            
            onOpen("invite", {server: response.data})
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">

                    <DialogTitle className=" text 2xl text-center font-bold">
                        Convide Amigos!
                    </DialogTitle>

                    <DialogDescription className="text-center text-zinc-500">
                        Convide amigos para fazerem parte do seu servidor!
                    </DialogDescription>

                </DialogHeader>
                <div className="p-6">

                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>

                    <div className="flex items-center mt-2 gap-x-2">
                        <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0" 
                        value={inviteUrl}
                        disabled={isLoading}>
                        </Input>
                        <Button
                        disabled={isLoading} 
                        onClick={onCopy} size="icon">
                            {copied 
                                ? <Check className="h-4 w-4" /> 
                                : <Copy className="h-4 w-4" />
                            }
                        </Button>
                    </div>

                    <Button className="text-xs text-zinc-500 mt-4"
                    variant="link" 
                    size="sm"
                    onClick={onNew}
                    disabled={isLoading}>
                        Gerar novo Link
                        <RefreshCcw className="w-4 h-4 ml-2"/>
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}