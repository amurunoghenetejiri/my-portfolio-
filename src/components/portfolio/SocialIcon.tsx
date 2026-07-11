import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Mail,
  MessageCircle,
  Twitter,
} from "lucide-react";

export function SocialIcon({ name, className }: { name: string; className?: string }) {
  const props = { className: className ?? "h-4 w-4", strokeWidth: 1.75 };
  switch (name) {
    case "github": return <Github {...props} />;
    case "linkedin": return <Linkedin {...props} />;
    case "instagram": return <Instagram {...props} />;
    case "facebook": return <Facebook {...props} />;
    case "mail": return <Mail {...props} />;
    case "whatsapp": return <MessageCircle {...props} />;
    case "x": return <Twitter {...props} />;
    default: return <Mail {...props} />;
  }
}
