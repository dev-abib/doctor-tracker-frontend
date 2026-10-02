import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "DoctorTracker | Clinical Administration & Healthcare Analytics",
    template: "%s | DoctorTracker",
  },
  description:
    "Enterprise healthcare management portal for medical practitioners, doctor roster scheduling, patient diagnosis tracking, and real-time clinical analytics.",
  applicationName: "DoctorTracker",
  keywords: [
    "Doctor Tracker",
    "Healthcare Administration",
    "Medical Practice Management",
    "Patient Electronic Health Records",
    "Clinical Analytics",
    "Doctor Roster Scheduling",
    "Hospital Practitioner Directory",
  ],
  authors: [{ name: "PulseCare Health Systems" }],
  creator: "DoctorTracker Health",
  publisher: "DoctorTracker Health Systems",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://doctortracker.health"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "DoctorTracker | Clinical Administration & Healthcare Analytics",
    description:
      "Enterprise healthcare management portal for medical practitioners, doctor roster scheduling, and real-time patient diagnosis tracking.",
    url: "https://doctortracker.health",
    siteName: "DoctorTracker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DoctorTracker | Clinical Administration Portal",
    description:
      "Enterprise healthcare management portal for medical practitioners and patient records.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={plusJakartaSans.variable}>
      <body className="font-sans antialiased bg-background text-foreground min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <QueryProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                richColors
                closeButton
              />
            </AuthProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
