// app/layout.js
import "./globals.css";
import { AuthProvider } from "../context/authContext";
import Script from "next/script";
import UmamiPageView from "../components/UmamiPageView";

export const metadata = {
  title: "Kapehan — Your Local Coffee Guide",
  description:
    "Discover neighborhood cafés, hidden gems, and local brews near you.",
  generator: "v0.app",
};

export default function RootLayout({ children }) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="en">
      <head>
        {isProduction && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id="07ec39de-5c21-4f00-9ddb-9f987c805af7"
            strategy="afterInteractive"
          />
        )}
      </head>

      <body className="font-whyte-regular antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
