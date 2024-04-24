import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if(req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido!' });
  }

  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl, fileName } = req.body;
    const { conversationId } = req.query;

    if(!profile){
      return res.status(401).json({ message: 'Usuário não autenticado!' });
    }

    if(!conversationId){
      return res.status(401).json({ message: 'Conversa não encontrada!'});
    }

    if(!content){
      return res.status(400).json({ message: 'Conteúdo da mensagem não encontrado!'});
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
    });

    if(!conversation){
      return res.status(404).json({ message: 'Conversa não encontrada!'});
    }

    const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

    if(!member){
      return res.status(404).json({ message: 'Membro não encontrado!'});
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        fileName,
        conversationId: conversationId as string,
        memberId: member.id
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: 'Erro ao enviar mensagem!' });
  }
}