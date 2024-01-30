import { config } from "@fortawesome/fontawesome-svg-core";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "normalize.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.scss";
import styles from "./layout.module.scss";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dedimon",
  description: "Dedicated server monitor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
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
