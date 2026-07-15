import Link from "next/link";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-text-primary border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-heading text-lg font-bold text-white">
              {SITE.name}
            </h3>
            <p className="mt-2 text-sm text-white/60 max-w-xs leading-relaxed">
              Camisetas de Honduras, inspiradas en la montaña.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Tienda
            </h4>
            <ul className="space-y-2">
              <li><Link href="/#catalogo" className="text-sm text-white/60 hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/#catalogo" className="text-sm text-white/60 hover:text-white transition-colors">Novedades</Link></li>
              <li><Link href="/#catalogo" className="text-sm text-white/60 hover:text-white transition-colors">Ofertas</Link></li>
              <li><Link href="/#catalogo" className="text-sm text-white/60 hover:text-white transition-colors">Más vendidos</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Info
            </h4>
            <ul className="space-y-2">
              <li><Link href="/#nosotros" className="text-sm text-white/60 hover:text-white transition-colors">Nosotros</Link></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Guía de tallas</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Envíos</a></li>
              <li><a href="#" className="text-sm text-white/60 hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-3">
              Contacto
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Envío a toda Honduras</li>
              <li>Pago contra entrega disponible</li>
              <li>WhatsApp: +504 9999-9999</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE.name}. Hecho en Honduras.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Términos</a>
            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
