import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";

interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({
    serverId,
}: ServerSidebarProps) => {
    const profile = await currentProfile();

    if(!profile){
        return redirect("/");
    }


    return (
        <div>
            Server Sidebar Component
       </div>
    )
}