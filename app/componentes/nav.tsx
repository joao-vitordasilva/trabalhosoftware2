"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Home", href: "/" },
  { label: "Talentos", href: "/sistema/paginas/curriculos" },
  { label: "Novo", href: "/sistema/paginas/curriculos/novo" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav-v2" aria-label="Navegacao principal">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
