import './globals.css';

export const metadata = {
  title: '競馬買い目下書き',
  description: '予想・買い目の下書きを整理して共有するアプリ',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
