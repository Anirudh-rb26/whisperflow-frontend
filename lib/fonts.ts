import {
  Poppins,
  Lato,
  Cinzel_Decorative,
  Tangerine,
  Sacramento,
  Great_Vibes,
  Source_Code_Pro,
  IBM_Plex_Mono,
  Noto_Sans_Devanagari,
  Hind,
} from "next/font/google";

// Normal/Clean Fonts
export const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const lato = Lato({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-lato",
});

// Fancy/Decorative Fonts
export const cinzelDecorative = Cinzel_Decorative({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
});

export const tangerine = Tangerine({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-tangerine",
});

export const sacramento = Sacramento({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sacramento",
});

export const greatVibes = Great_Vibes({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-great-vibes",
});

// Coding/Typewriter Fonts
export const sourceCodePro = Source_Code_Pro({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-source-code-pro",
});

export const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

// Devanagari (Hindi) Support
export const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["400", "700"],
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-sans-devanagari",
});

export const hind = Hind({
  weight: ["400", "600"],
  subsets: ["devanagari", "latin"],
  variable: "--font-hind",
});
