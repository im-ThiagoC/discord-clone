import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

import { ClerkProvider  } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ModalProvider } from "@/components/providers/modal-provider";

import { cn } from "@/lib/utils";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team Chat Application",
  description: "A Discord Clone in Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          font.className,
          "bg-white dark:bg-[#313338] text-black dark:text-white transition-colors duration-200  "
          )}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            storageKey="discord-theme"
          >
            <ModalProvider />    
            {children}  
          </ThemeProvider>
          
        </body>
     </html>
    </ClerkProvider>
    
  );
}
