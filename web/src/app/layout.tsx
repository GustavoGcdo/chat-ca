'use client';
import { useRealtimeStore } from '@/modules/@shared/store/store';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chat CA',
  description: 'Chat usando clean architecture',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { isOnline } = useRealtimeStore();

  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-200">
          {children}
          <span className="mt-5 px-2 rounded text-white bg-gray-500">
            {typeof window !== 'undefined' && isOnline ? 'Online' : 'Offline'}
          </span>
        </main>
      </body>
    </html>
  );
}
