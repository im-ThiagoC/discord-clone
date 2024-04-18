"use client"

import { UploadDropzone } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"
import Image from "next/image"

import { X } from "lucide-react"

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage"
}

export const FileUpload = ({
    onChange,
    value,
    endpoint,
}: FileUploadProps
) => {
    const fileType = value?.split(".").pop();

    if(value && fileType !== "pdf"){
        return (
            <div className="relative h-20 w-20">
                <Image
                    src={value}
                    alt="Upload"
                    style={{ objectFit: "cover" }}
                    width={96}
                    height={96}
                    className="rounded-full w-full h-full"
                />
                <button onClick={() => onChange()}
                    className="bg-rose-500 text-white rounded-full p-1 absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    <X
                        className="h-4 w-4"
                    />
                </button>
            </div>
        )
    }
    return (

        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.log(error);
            }}
        />
    )
}