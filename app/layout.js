export const metadata = {
  title: 'Seller-Buyer System',
  description: 'A simple project bidding system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'Arial, sans-serif', margin: 0, padding: 20 }}>
        <h1 style={{ textAlign: 'center' }}>Seller-Buyer Project Bidding System</h1>
        {children}
      </body>
    </html>
  );
}
