import Link from "next/link";
import Nav from "./nav";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link href="/" className="brand-link">
          <span className="brand-mark">NG</span>
          <span className="brand-copy">
            <small>NovaGlow</small>
            <strong>Curriculos</strong>
          </span>
        </Link>
        <Nav />
      </div>
    </header>
  );
}
