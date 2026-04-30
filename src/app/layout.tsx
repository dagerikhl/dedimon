import { config } from "@fortawesome/fontawesome-svg-core";
import type { Metadata } from "next";
import { Fira_Sans as Font } from "next/font/google";
import type { ReactNode } from "react";
import { PageHeader } from "@/common/components/page/PageHeader";
import { SseServerStateProvider } from "@/features/api/state/providers/SseServerStateProvider";
import "normalize.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "./globals.css";

config.autoAddCss = false;

const inter = Font({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dedimon",
  description: "Dedicated server monitor",
};

type IRootLayoutProps = Readonly<{ children: ReactNode }>;

export default function RootLayout({ children }: IRootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SseServerStateProvider>
          <PageHeader />

          {children}
        </SseServerStateProvider>
      </body>
    </html>
  );
}
