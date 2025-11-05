import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.css";

import BootstrapClient from "./bootstrap";
import "./globals.css";

export const metadata = {
  title: "Ekeremgba",
  description: "Celebrating Igbo Language, Culture and Excellence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <BootstrapClient></BootstrapClient>
        {children}
      </body>
    </html>
  );
}
