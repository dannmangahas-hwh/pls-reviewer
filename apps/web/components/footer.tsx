import Link from "next/link";
import { Logo } from "./logo";

const footerLinks = [
  { label: "DISCLAIMERS", href: "/disclaimers" },
  { label: "PRIVACY POLICY", href: "/privacy-policy" },
  { label: "TERMS OF SERVICE", href: "/terms-of-service" },
  { label: "CONTACT FACULTY", href: "/contact-faculty" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    // Changed bg-white to bg-[#1B2644] and updated border color to a subtle white opacity
    <footer className="w-full border-t border-white/10 bg-[#1B2644] py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            {/* Note: You might want to pass a different class to your Logo if its text was dark blue */}
            <Logo textClassName="text-white" />
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                // Changed text-[#06194b] to text-white/80 (or text-white)
                className="text-white/80 text-[10px] font-medium tracking-[0.2em] hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Changed text-[#06194b] to text-white/60 */}
        <p className="text-white/60 text-[10px] font-medium tracking-[0.2em] whitespace-nowrap">
          © {currentYear} PHILIPPINE LAW SOCIETY BAR EXAM REVIEWER
        </p>
      </div>
    </footer>
  );
}