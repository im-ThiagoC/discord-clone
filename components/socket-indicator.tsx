"use client";

import { useSocket } from "@/components/providers/socket-provider";

import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if(!isConnected){
    return null;
  }

  return (
    <Badge variant="outline" className="bg-emerald-600 text-white border-none">
      Conectado, atualizações em tempo real
    </Badge>
  )
}