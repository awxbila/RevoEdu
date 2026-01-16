import "./globals.css";

export const metadata = {
  title: "LMS",
  description: "LMS Frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
