import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyVote Journey — Election Process Education Assistant',
  description: 'Understand and navigate the Indian election process with verified, step-by-step guidance. Register, verify, simulate, and vote with confidence.',
  keywords: ['India election', 'voter registration', 'voter ID', 'ECI', 'NVSP', 'Form 6', 'polling booth', 'election education'],
  authors: [{ name: 'MyVote Journey' }],
  openGraph: {
    title: 'MyVote Journey — Know Your Vote',
    description: 'Your complete guide to voting in India. Eligibility checks, registration help, and AI-powered Q&A.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#1A1F4B" />
      </head>
      <body>{children}</body>
    </html>
  );
}
