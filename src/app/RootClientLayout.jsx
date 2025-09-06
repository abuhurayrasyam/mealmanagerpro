'use client';
import { usePathname } from "next/navigation";
import Navbar from "@/components/Header/Navbar";
import Footer from "@/components/Footer/Footer";

export default function RootClientLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && (
        <header className="sticky top-0 z-[9999]">
          <Navbar />
        </header>
      )}

      {children}

      {!isDashboard && <Footer />}
    </>
  );
}
