import type { Metadata } from "next";
import ReduxProvider from "./components/ReduxProvider";
import AuthProvider from "./components/AuthProvider";
import { ToastProvider } from "./context/ToastContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atlas of Tamriel",
  description: "Explorez les mystères de Tamriel avec notre atlas interactif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <title>{String(metadata.title || "")}</title>
        <meta name="description" content={String(metadata.description || "")} />
      </head>
      <body className="antialiased flex flex-col h-screen">
        <ReduxProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
