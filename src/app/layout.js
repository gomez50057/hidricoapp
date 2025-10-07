import ClientLayout from "@/components/shared/ClientLayout";
import FooterGate from "@/components/shared/FooterGate";
import "@/styles/globals.css";

export const metadata = {
  title: "Plan Hídrico Metropolitano",
  description: "Proyecto integral del plan hídrico en Hidalgo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
        <FooterGate />
      </body>
    </html>
  );
}
