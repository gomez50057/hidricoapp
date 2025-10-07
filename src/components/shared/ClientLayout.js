"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/shared/Navbar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const hideNavbar = pathname.startsWith("/dashboard") || pathname.startsWith("/report");

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
