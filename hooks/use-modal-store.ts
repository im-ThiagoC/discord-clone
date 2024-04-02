import { create } from "zustand"

export type ModalType = "createServer" | "joinServer" | "createChannel" | "joinChannel"

interface ModalStore {
    type: ModalType | null
    isOpen: boolean
    onOpen: (type: ModalType) => void
    onClose: () => void;
}