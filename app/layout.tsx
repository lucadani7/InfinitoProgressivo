import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: { title: string; description: string; icons: { icon: { url: string; href: string }[] } } = {
    title: "Infinito Progressivo Progetto",
    description: "Laboratorio computazionale di Leonardo Fibonacci",
    icons: {
        icon: [
            {
                url: "/leonardofibonacci.png",
                href: "/leonardofibonacci.png",
            },
        ],
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning={true} // Aggiungi questa riga
        >
        {children}
        </body>
        </html>
    );
}
