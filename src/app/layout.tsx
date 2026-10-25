import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sri Venkateshwara Arisi Mandy | Rice Wholesale Merchant & Modern Rice Mill, Chennai',
  description:
    'Sri Venkateshwara Arisi Mandy (ஸ்ரீ வெங்கடேஸ்வரா அரிசி மண்டி) - Rice Wholesale Merchant & Sri Venkateswara Modern Rice Mill. Premium aged boiled, steam, raw & idly rice in 26kg sacks direct from mill. Kundrathur Main Road, Chiikkarayapuram & Kolapakkam, Chennai.',
  icons: {
    icon: '/favicon.png',
    apple: '/images/logo-square.png',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable} overflow-x-hidden max-w-full w-full`}>
      <body className="min-h-screen flex flex-col font-sans bg-[#FBF9F5] text-[#19241F] overflow-x-hidden max-w-full w-full">
        {children}
      </body>
    </html>
  );
}
