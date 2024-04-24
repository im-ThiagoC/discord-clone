"use client"

import { Member, MemberRole, Profile } from "@prisma/client";

import { UserAvatar } from "@/components/user-avatar";
import { ActionTooltip } from "@/components/action-tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-modal-store";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface ChatItemProps {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  fileName: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
}

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="w-4 h-4 ml-2 text-red-500" />
}

const formSchema = z.object({
  content: z.string().min(1)
})

export const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  fileName,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [holdingShift, setHoldingShift] = useState(false);
  const { onOpen } = useModal();
  const params = useParams();
  const router = useRouter();

  const onMemberClick = () => {
    if(member.id == currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape" || event.keyCode === 27) {
        setIsEditing(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  //Fast Delete

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Shift") {
        setHoldingShift(true);
      }
    }

    const handleKeyUp = (event: any) => {
      if (event.key === "Shift") {
        setHoldingShift(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    }
  }, []);
  const [isDeleting, setIsDeleting] = useState(false);

  const fastDelete = async ({ apiUrl, query }: { apiUrl: string, query: Record<string, string> }) => {
    try {
      setIsDeleting(true);
      const url = qs.stringifyUrl({
          url: apiUrl || "",
          query,
      });

      await axios.delete(url);
    } catch (error) {
        console.log(error);
    } finally {
        setIsDeleting(false);
    }
  }

  //Fast Delete End 


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  });

  const isLoading = form.formState.isSubmitting;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try{
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery
      })

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    form.reset({
      content: content,
    })
  }, [content]);

  const fileType = fileUrl?.split(".").pop()?.toLowerCase();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isOwner || isModerator);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div onClick={onMemberClick} className="cursor-pointer hover:drop-shadow-sm transition">
          <UserAvatar src={member.profile.imageUrl} size="sm"/>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p onClick={onMemberClick}  className="font-semibold text-sm hover:underline cursor-pointer">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                  {roleIconMap[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
            >
              <Image
                src={fileUrl}
                alt={fileName ? fileName : ""}
                style={{ objectFit: "cover" }}
                fill = {true}
                sizes="100%"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
            <a 
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              {fileName ? `${fileName}.${fileType}` : `Documento ${fileType}`}
            </a>
          </div>
          )}
          {!fileUrl && !isEditing && (
            <p className={cn(
              "text-sm text-zinc-600 dark:text-zinc-300",
              deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1"
            )}>
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (editado)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2" 
                onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField 
                    control={form.control}
                    name="content"
                    render= {({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <div className="relative w-full">
                            <Input 
                              disabled={isLoading}
                              className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                              placeholder="Mensagem Editada"
                              autoComplete="off"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                <Button disabled={isLoading} size="sm" variant="primary">
                    Salvar
                </Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                Pressione ESC para cancelar ou ENTER para salvar
              </span>
            </Form>

          )}
        </div>
      </div>
      {canDeleteMessage && !isDeleting && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="editar">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          {holdingShift && !isDeleting && (
            <ActionTooltip label="Fast Delete">
              <Trash
                onClick={() => fastDelete({
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery
                })}
                className="cursor-pointer ml-auto w-4 h-4 text-red-500 hover:text-red-600 dark:hover:text-red-300 transition"
              />  
            </ActionTooltip>
          )}
          {!holdingShift && !isDeleting && (
            <ActionTooltip label="Apagar">
              <Trash 
                onClick={() => onOpen("deleteMessage", { 
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery
                })}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
           </ActionTooltip>
          )}
          
        </div>
      )}
    </div>
  )
}