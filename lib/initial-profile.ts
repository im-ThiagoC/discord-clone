import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { db } from "@/lib/db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await db.profile.findFirst({
    where: {
      userId: user.id
    }
  });

  if (profile) {
    return profile;
  }

  const params = new URLSearchParams();
 
  params.set("height", "200");
  params.set("width", "200");
  params.set("quality", "100");
  params.set("fit", "crop");
 
  const imageSrc = `${user.imageUrl}?${params.toString()}`;
  
  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName || ""}`,
      imageUrl: imageSrc,
      email: user.emailAddresses[0].emailAddress
    }
  });

  return newProfile;
};