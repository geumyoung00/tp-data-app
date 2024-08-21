import type { Metadata } from 'next';
import localFont from 'next/font/local';
import '@/src/style/reset.css';
import '@/src/style/style.css';
import React from 'react';
import Header from '../components/header';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Create Next App Example',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html>
      <body className={`${pretendard.variable} font-pretendard`}>
        <Header />
        {children}
        {modal}
      </body>
    </html>
  );
}
