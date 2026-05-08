import './globals.css';
import AppLayout from '../components/AppLayout';

export const metadata = {
  title: 'ERP Maroc 2026',
  description: 'Gestion PME Marocaine conforme DGI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
