import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme/theme-provider';

import { ClerkProvider } from "@clerk/nextjs"

export const metadata: Metadata = {
  title: 'Moore Internal',
  description: 'Internal Moore Equine Tool',
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider signInUrl='/sign-in'>
        <html lang='en' suppressHydrationWarning>
            <body>
                <ThemeProvider
                attribute={`class`}
                defaultTheme='system'
                enableSystem
                disableTransitionOnChange
                >
                {children}
                </ThemeProvider>
            </body>
        </html>
    </ClerkProvider>
  );
}
