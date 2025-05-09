import Footer from "@/components/shared/Footer";
import ClientLayout from "@/components/shared/ClientLayout";
import "@/styles/globals.css";

export const metadata = {
  title: "Plan Hídrico Metropolitano",
  description: "Proyecto integral del plan hídrico en Hidalgo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  );
}
