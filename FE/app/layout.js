import './globals.css';

export const metadata = {
  title: 'CakeNgonNhu — Tiệm Bánh Kem',
  description: 'Đặt bánh kem online — sinh nhật, cưới, kem tươi, fondant',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="font-sans">{children}</body>
    </html>
  );
}
