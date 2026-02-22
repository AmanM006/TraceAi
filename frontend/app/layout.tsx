import "./globals.css";
import { TraceAIProvider } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TraceAIProvider>
          {children}
        </TraceAIProvider>
      </body>
    </html>
  );
}