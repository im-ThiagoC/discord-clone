import { MemberRole } from "@prisma/client";

import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if(req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Método não permitido!" });
  }

  try {
    
    const profile = await currentProfilePages(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if(!profile){
      return res.status(401).json({ error: "Sem autorização, sem perfil" })
    }

    if(!conversationId){
      return res.status(400).json({ error: "Conversa não encontrada" });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id
            }
          },
          {
            memberTwo: {
              profileId: profile.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })

    if(!conversation){
      return res.status(404).json({ error: "Conversa não encontrada" });
    }

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if(!member) {
      return res.status(404).json({ error: "Membro não encontrado" });
    }
    

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    
    if(!directMessage || directMessage.deleted){
      return res.status(404).json({ error: "Mensagem não encontrada" });
    }
    
    const isAdmin = member.role = MemberRole.ADMIN;
    const isModerator = member.role = MemberRole.MODERATOR;
    const isMessageOwner = directMessage.memberId === member.id;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if(!canModify){
      return res.status(401).json({ error: "Sem permissão" });
    }

    if(req.method === "DELETE"){
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string
        },
        data: {
          fileUrl: null,
          content: "Mensagem deletada",
          deleted: true
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      });
    }

    if(req.method === "PATCH"){
      if(!isMessageOwner){
        return res.status(401).json({ error: "Sem permissão" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        }
      });
    }

    const updateKey = `chat:${conversationId}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);
     
    return res.status(200).json(directMessage);
    
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    
    return res.status(500).json({ error: "Error Interno" })
  }

}