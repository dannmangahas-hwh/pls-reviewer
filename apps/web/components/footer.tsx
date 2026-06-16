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
    <footer className="w-full border-t border-slate-200 bg-white py-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Logo textClassName="text-[#06194b]" />
          </Link>

          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#06194b] text-[10px] font-medium tracking-[0.2em] hover:text-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-[#06194b] text-[10px] font-medium tracking-[0.2em] whitespace-nowrap">
          © {currentYear} PHILIPPINE LAW SOCIETY BAR EXAM REVIEWER
        </p>
      </div>
    </footer>
  );
}
