import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";
import NextAuthProvider from "@/providers/NextAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Meal Manager Pro",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
            <header className="sticky top-0 z-[9999]">
              <Navbar></Navbar>
            </header>
            {children}
            <footer>
              <Footer></Footer>
            </footer>
        </NextAuthProvider>
      </body>
    </html>
  );
}
