import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DisputeGuard AI — Autonomous PayPal Dispute Defense Agent',
  description: 'AI-Powered Chargeback Protection & Forensic Evidence Dossier Generator built for PayPal and AG Grid',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen selection:bg-sky-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
