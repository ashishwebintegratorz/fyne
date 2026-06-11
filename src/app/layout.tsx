import type { Metadata } from "next";
import { Josefin_Sans, Inter, Pinyon_Script } from "next/font/google";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import OfferBannerModal from "@/components/OfferBannerModal";
import Providers from "@/components/Providers";
import "./globals.css";

const josefin = Josefin_Sans({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const pinyon = Pinyon_Script({
  variable: "--font-logo",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Fyné | Luxury Personalized Lip Balm",
  description: "Bespoke leather cased lip balms tailored to your initials. Experience handcrafted elegance, organic luxury formulation, and premium gifting.",
  metadataBase: new URL("https://fynebeauty.com"),
  openGraph: {
    title: "Fyné | Luxury Personalized Lip Balm",
    description: "Bespoke leather cased lip balms tailored to your initials.",
    type: "website",
    locale: "en_US",
    siteName: "Fyné Beauty",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${josefin.variable} ${inter.variable} ${pinyon.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-gold-300/30 selection:text-gold-700">
        <Providers>
          <Navbar />
          <CartDrawer />
          <OfferBannerModal />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
