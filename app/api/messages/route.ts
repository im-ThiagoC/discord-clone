import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH_SIZE = 10;

export async function GET(
  req: Request
) {
  try{
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if(!profile){
      return new NextResponse("Usuário não autenticado!", {status: 401});
    }

    if(!channelId){
      return new NextResponse("ID de Canal não encontrado!", {status: 400});
    }

    let messages: Message[] = []
    
    if(cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH_SIZE,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH_SIZE,
        where: {
          channelId
        },
        include: {
          member: {
            include: {
              profile: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        }
      });
    }

    let nextCursor = null;

    if(messages.length === MESSAGES_BATCH_SIZE) {
      nextCursor = messages[MESSAGES_BATCH_SIZE - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.error("[MESSAGES_GET]", error);
    return new NextResponse("Erro ao carregar mensagens!", {status: 500});
  }
}