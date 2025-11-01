import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Starfield from "@/components/misc/Starfield";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const poppins = Poppins({ subsets: ["latin"], weight: ['700', '900'], variable: '--font-poppins' });

export const metadata: Metadata = {
  title: "BrandHub | DaemonCore Labs",
  description: "Manage all your brands in one universe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-black`}>
        <div className="relative min-h-screen text-slate-200 flex flex-col">
            <Starfield />
            <Navbar />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 z-10">
                {children}
            </main>
            <Footer />
        </div>
      </body>
    </html>
  );
}
