import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dedimon",
  description: "Dedicated server monitor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className={styles.header}>
          <h1>Dedimon</h1>

          <p>&copy; dagerikhl 2024 &ndash;</p>
        </header>
        {children}
      </body>
    </html>
  );
}
