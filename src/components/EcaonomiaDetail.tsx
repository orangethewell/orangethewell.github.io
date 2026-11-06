import { type RefObject } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ProjectCarousel from './ProjectCarousel';
import brand from '../../assets/ecaonomia-brand.webp';
import dogWithBow from '../../assets/ecaonomia/010-showcase_car.jpg';
import smallDog from '../../assets/ecaonomia/020-showcase_car.jpg';
import dogWithPinkBandana from '../../assets/ecaonomia/040-showcase_car.jpg';
import dogWithBlueTie from '../../assets/ecaonomia/070-showcase_car.jpg';

const slides = [
  { src: dogWithBow, alt: 'Cachorro branco com laço estampado após os cuidados da Ecãonomia', position: 'center' },
  { src: smallDog, alt: 'Cachorro de pelagem clara com laço verde', position: 'center' },
  { src: dogWithPinkBandana, alt: 'Cachorro de pelagem caramelo com bandana rosa', position: 'center 15%' },
  { src: dogWithBlueTie, alt: 'Cachorro de pelagem clara com gravata azul estampada', position: 'center' },
];

interface EcaonomiaDetailProps {
  href: string;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function EcaonomiaDetail({ href, onClose, closeButtonRef }: EcaonomiaDetailProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.article
      id="orbit-project-detail"
      role="dialog"
      aria-modal={false}
      aria-labelledby="orbit-project-title"
      aria-describedby="orbit-project-summary"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.22 }}
      className="flex h-[520px] max-h-[calc(100svh-112px)] w-full flex-col overflow-hidden border border-[#e9d8cd] bg-[#fffcf7] shadow-[0_18px_50px_rgba(81,41,58,0.13)]"
    >
      <div className="shrink-0 border-b border-[#e9d8cd] px-6 pb-4 pt-6 sm:px-7 sm:pt-7">
        <div className="flex items-start justify-between gap-3">
          <span className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#a92f38]">Pet shop / estética animal</span>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar informações de Ecãonomia" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#e9d8cd] text-[#a92f38] transition-colors hover:bg-[#f9e1e2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <h2 id="orbit-project-title" className="mt-4 flex min-w-0 items-center gap-2 text-[clamp(1.85rem,2.5vw,2.25rem)] font-black leading-none tracking-[-0.065em] text-[#c83e47]">
          <img src={brand} alt="" width={1254} height={1254} className="size-10 shrink-0 rounded-[25%]" />
          <span className="min-w-0">Ecãonomia<span className="text-[#e8c65d]">.</span></span>
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-7 sm:pb-7">
        <p id="orbit-project-summary" className="text-sm leading-6 text-[#6b5c58]">Quando você pensa em pet shop, pensa em <strong className="font-semibold text-[#a92f38]">carinho</strong>. Foi dessa ideia que nasceu o site da Ecãonomia: a identidade calorosa da marca precisava estar em destaque.</p>

        <ProjectCarousel label="Imagens do projeto Ecãonomia" slides={slides} accent="#a92f38" border="#e2c9bf" surface="#f9e1e2" />

        <section aria-labelledby="ecaonomia-identity-title" className="mt-7 border-t border-[#e9d8cd] pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c83e47]">Identidade / Experiência</p>
          <h3 id="ecaonomia-identity-title" className="mt-3 text-[1.75rem] font-black leading-[1.05] tracking-[-0.05em] text-[#292526]">Uma identidade que chama pelo seu <span className="text-[#c83e47]">cãozinho</span></h3>
          <p className="mt-4 text-sm leading-6 text-[#6b5c58]">Ícones personalizados, criados sob medida para a marca, dão personalidade à navegação. Cada seção deixa de parecer genérica e passa a transmitir o cuidado que a Ecãonomia dedica aos pets e a quem os acompanha.</p>
        </section>

        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 border-b-2 border-[#c83e47] pb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#a92f38] transition-colors hover:text-[#dd6a65] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b5cca]">
          Visitar Ecãonomia <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>
    </motion.article>
  );
}
