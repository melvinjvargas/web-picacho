import { EL_PICACHO_ELEVATION } from "@/lib/constants";

export function AboutSection() {
  return (
    <section id="nosotros" className="bg-[#FAFAFA]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Photo */}
          <div className="w-full lg:w-1/2 aspect-4/3 bg-white rounded-lg flex items-center justify-center overflow-hidden">
            <span className="text-sm text-text-muted">
              [Cerro El Picacho, Honduras]
            </span>
          </div>

          {/* Text */}
          <div className="flex flex-col gap-5 lg:w-1/2">
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-brand-green">
              El nombre
            </span>
            <h2 className="font-heading text-3xl font-bold text-text-primary sm:text-4xl break-words">
              Un cerro, un punto de partida.
            </h2>
            <p className="text-base text-text-secondary leading-relaxed">
              Picacho nace del amor por las montañas de Honduras. Cada diseño
              cuenta una historia de senderos, fogatas y amaneceres en la cima.
            </p>

            <div className="py-2">
              <p className="font-heading text-4xl font-bold text-brand-green">
                {EL_PICACHO_ELEVATION}
              </p>
              <p className="text-sm text-text-secondary mt-1">
                Altura del Picacho
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
