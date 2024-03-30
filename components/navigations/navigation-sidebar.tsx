import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";

export const NavigationSideBar = async () => {
    const profile = await currentProfile();

    if(!profile) {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <nav className="space-y-4 flex flex-col items-center h-full
         text-primary w-full dark:bg-[#1E1F22] py-3">
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700
                ronded-md w-10 mx-auto"
            />
        </nav>
    )
}