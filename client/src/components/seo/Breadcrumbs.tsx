import { Link } from "wouter";

interface Breadcrumb {
  label: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="font-body text-xs text-[#1E1B16]/45">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index > 0 && <span>/</span>}
            <Link href={item.href} className="hover:text-[#C8813A] transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
