import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { RoleDemoBanner } from "@/components/RoleDemoBanner";

export const metadata: Metadata = {
  title: "NexusCollab | Academia–Industry Collaboration Portal",
  description: "Next-generation Academia–Industry Collaboration Portal with Extensible AI Skill Matching Engine, Role-Based Access Control, and Placement Analytics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <RoleDemoBanner />
          <div className="flex-1 flex flex-col">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
