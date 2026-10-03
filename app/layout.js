import './globals.css';

export const metadata = {
  title: 'Ink — Notes',
  description: 'A little space for your ideas. Create, view, edit and delete notes.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
