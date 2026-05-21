import Link from "next/link";
import Nav from "./nav";

export default function Header() {
  return (
    <aside className="sidebar-v2">
      <Link href="/" className="brand-v2">
        <span className="mark-v2">NG</span>
        <span>
          <small>NovaGlow</small>
          <strong>Curriculos</strong>
        </span>
        <span>Estrutura lateral fixa com conteudo simples no painel principal.</span>
      </Link>
      <Nav />
    </aside>
  );
}
