import "./globals.css";
import NavBar from "@/components/NavBar";
import FloatingAddButton from "@/components/FloatingAddButton";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Provisions",
  description:
    "Track what's in the fridge, freezer, and pantry — reduce waste, get recipe ideas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-cream text-stone-900 min-h-screen font-body">
        <NavBar />
        {children}
        <Footer />
        <FloatingAddButton />
      </body>
    </html>
  );
}
