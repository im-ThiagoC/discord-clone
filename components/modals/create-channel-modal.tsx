"use client";

import qs from "query-string"
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";

//Components
import { 
    Dialog,

    DialogHeader,

    DialogTitle,
    DialogContent,
    
    DialogFooter,

} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store";
import { useEffect } from "react";



const formSchema = z.object({
    name: z.string().min(1, {
        message: "Nome do servidor é obrigatório."
    }).refine(
        name => name !== "geral",{
            message: "Você não pode criar um canal com o nome 'geral'."
        }
    ),
    type: z.nativeEnum(ChannelType),
});

export const CreateChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "createChannel";
    const { channelType } = data;
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: channelType ||  ChannelType.TEXT,
        }
    });

    useEffect(() => {
        if(channelType){
            form.setValue("type", channelType);
        }
        else {
            form.setValue("type", ChannelType.TEXT);
        }
    }, [channelType, form])

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId,
                }
            });

            await axios.post(url, values);

            form.reset();
            router.refresh();
            onClose();
        }
        catch (error){
            console.log(error);
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">

                    <DialogTitle className=" text 2xl text-center font-bold">
                        Criar Canal
                    </DialogTitle>

                </DialogHeader>
                    
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control = {form.control}
                                name = "name"
                                render = {({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500
                                            dark: text-secondary/70">
                                            Criar Canal
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0
                                                focus-visible:ring-0 text-black
                                                focus-visible:ring-offset-0"
                                                placeholder="Insira o nome do servidor"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="">Tipo </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}    
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className="bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none"
                                                >
                                                    <SelectValue placeholder="Selecione um tipo de canal"/>
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem
                                                        key={type}
                                                        value={type}
                                                        className="capitalize"
                                                    >
                                                        {type.toLowerCase()}
                                                    </SelectItem>
                                                ))}
                                                
                                                    
                                            </SelectContent>
                                        </Select>
                                            
                                        
                                        <FormMessage />
                                    </FormItem>
                                )}
                            
                            />
                        </div>
                        <DialogFooter className="px-6 py-4 bg-gray-100">
                            <Button variant="primary" disabled={isLoading}>
                                Criar
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}