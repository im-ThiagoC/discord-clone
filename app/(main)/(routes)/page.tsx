import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="">
      <UserButton 
        afterSignOutUrl="/"
        />
      <p className="text-3xl font-bold text-indigo-500">
      Discord
      </p>
      <Button variant="outline">
        Click me!
      </Button>
    </div>
    
  )
}
