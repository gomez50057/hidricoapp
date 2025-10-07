'use client';

import { usePathname } from 'next/navigation';
import Footer from "@/components/shared/Footer";


const HIDE_FOOTER_PATTERNS = [
  /^\/planhidrico\/report(\/|$)/, // tus reportes de nivelación
  // agrega aquí otras rutas de reportes si lo necesitas:
  /^\/report(\/|$)/,
];

export default function FooterGate() {
  const pathname = usePathname() || '';
  const hideFooter = HIDE_FOOTER_PATTERNS.some((re) => re.test(pathname));
  if (hideFooter) return null;
  return <Footer />;
}
