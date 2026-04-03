import type { Metadata } from 'next';
import '../styles/tailwind.css';

export const metadata: Metadata = {
  title: 'PharmaCare',
  description: 'Pharmacy Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
