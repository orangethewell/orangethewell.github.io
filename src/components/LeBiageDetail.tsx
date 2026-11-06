import { type RefObject } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ProjectCarousel from './ProjectCarousel';
import toast from '../../assets/lebiage/005-img-data.jpg';
import pastry from '../../assets/lebiage/022-img-data.jpg';
import moka from '../../assets/lebiage/023-img-data.jpg';
import coffee from '../../assets/lebiage/024-img-data.webp';
import brand from '../../assets/lebiage/brand.svg';
import wordmark from '../../assets/lebiage/wordmark.svg';

const slides = [
  { src: toast, alt: 'Torrada com folhas e fatias de carne em prato verde' },
  { src: pastry, alt: 'Doce com chocolate e morango junto à janela' },
  { src: moka, alt: 'Cafeteira azul com desenho floral e detalhes dourados' },
  { src: coffee, alt: 'Café preparado sobre uma mesa de madeira' },
];

interface LeBiageDetailProps {
  href: string;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function LeBiageDetail({ href, onClose, closeButtonRef }: LeBiageDetailProps) {
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
      className="flex h-[520px] max-h-[calc(100svh-112px)] w-full flex-col overflow-hidden border border-[#b9c8b5] bg-[#faf9f2] shadow-[0_18px_50px_rgba(51,46,35,0.13)]"
    >
      <div className="shrink-0 border-b border-[#d7dfd1] px-6 pb-4 pt-6 sm:px-7 sm:pt-7">
        <div className="flex items-start justify-between gap-3">
          <span className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#49634e]">Experiência web</span>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar informações de Le Biagê" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#b9c8b5] text-[#45604b] transition-colors hover:bg-[#e8eddf] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <h2 id="orbit-project-title" className="mt-4 flex min-w-0 items-center gap-2">
          <span className="sr-only">Le Biagê</span>
          <img src={brand} alt="" aria-hidden="true" width={163} height={228} className="h-12 w-auto shrink-0" />
          <img src={wordmark} alt="" aria-hidden="true" width={410} height={110} className="h-11 min-w-0 max-w-full object-contain object-left" />
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-7 sm:pb-7">
        <p id="orbit-project-summary" className="text-sm leading-6 text-[#4f6253]">Desenvolvido em parceria com o <a href="https://www.instagram.com/studiomos.mk" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#2d4435] underline decoration-[#b36a69] underline-offset-2 hover:text-[#8c5252] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">Studio MOS<span className="sr-only"> (abre em nova aba)</span></a>, o site de inauguração do Le Biagê apresenta a cafeteria, a gelateria e os sabores da casa em Araxá. Um <strong className="font-semibold text-[#2d4435]">sistema de reservas especializado</strong> completa o convite à visita.</p>

      <ProjectCarousel label="Imagens do projeto Le Biagê" slides={slides} accent="#2d4435" border="#b9c8b5" surface="#e8eddf" />

      <section aria-labelledby="lebiage-branding-title" className="mt-7 border-t border-[#d7dfd1] pt-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b36a69]">Branding / Design</p>
        <h3 id="lebiage-branding-title" className="mt-3 font-serif text-[2rem] leading-[0.98] tracking-[-0.035em] text-[#2d4435]">Transformando experiências em <em className="text-[#b36a69]">memórias</em></h3>
        <p className="mt-4 text-sm leading-6 text-[#4f6253]">O visual do site parte do estilo vintage das viagens e da arquitetura dos lugares que inspiraram os sócios. Em conjunto com o Studio MOS, traduzimos essas referências em uma identidade digital que reflete o conceito do Le Biagê.</p>
      </section>

      <a href="https://www.instagram.com/reel/DeaGmU5hYUU/" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-3 border border-[#b9c8b5] bg-[#e8eddf] p-3 text-[#2d4435] transition-colors hover:bg-[#dce5d4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2d4435] text-white"><Play size={18} fill="currentColor" aria-hidden="true" /></span>
        <span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#60715f]">Vídeo de apresentação</span><strong className="mt-1 block text-sm leading-tight">Assista no Instagram</strong></span>
        <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
      </a>

      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 border-b-2 border-[#2d4435] pb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2d4435] transition-colors hover:text-[#b36a69] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b5cca]">
        Visitar Le Biagê <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
      </a>
      </div>
    </motion.article>
  );
}
