"use client";

const links = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#projects", label: "Projects" },
  { href: "#connect", label: "Connect" },
];

export function Navbar() {
  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#F3ECDD] rounded-full px-2 py-2 shadow-lg shadow-black/30">
      <ul className="flex items-center gap-1">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="focus-ring block px-4 py-2 rounded-full text-sm font-medium text-[#0B1420] hover:bg-black/5 transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
