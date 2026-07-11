import logo from "@/assets/d4tech-logo.png.asset.json";
import ceo from "@/assets/ceo-portrait.png.asset.json";

export const LOGO_URL = logo.url;
export const CEO_URL = ceo.url;

export const BRAND = {
  name: "D4 TECH",
  ceo: "Amurun Destiny",
  role: "Founder & CEO",
  motto: "Creating Solutions. Powering Lives.",
  school: "Federal University of Petroleum Resources, Effurun (FUPRE)",
  course: "Computer Engineering",
  intro:
    "I build innovative software, AI-powered solutions, fintech platforms, business websites, UI/UX experiences, and digital products that solve real-world problems through technology.",
};

export const SOCIALS = [
  { name: "WhatsApp", href: "https://wa.me/", icon: "whatsapp" },
  { name: "Gmail", href: "mailto:contact@d4tech.dev", icon: "mail" },
  { name: "GitHub", href: "https://github.com/", icon: "github" },
  { name: "LinkedIn", href: "https://linkedin.com/", icon: "linkedin" },
  { name: "Instagram", href: "https://instagram.com/", icon: "instagram" },
  { name: "Facebook", href: "https://facebook.com/", icon: "facebook" },
  { name: "X", href: "https://x.com/", icon: "x" },
] as const;

export const NAV_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "company", label: "Company" },
  { id: "skills", label: "Skills" },
  { id: "services", label: "Services" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
] as const;
