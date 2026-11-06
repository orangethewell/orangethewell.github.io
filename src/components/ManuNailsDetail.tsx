import { type RefObject } from 'react';
import { ArrowUpRight, Play, X } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import ProjectCarousel from './ProjectCarousel';
import nails010 from '../../assets/manu-nails/010_showcase.jpg';
import nails020 from '../../assets/manu-nails/020_showcase.jpg';
import nails030 from '../../assets/manu-nails/030_showcase.jpg';
import nails040 from '../../assets/manu-nails/040_showcase.jpg';
import nails050 from '../../assets/manu-nails/050_showcase.jpg';
import nails060 from '../../assets/manu-nails/060_showcase.jpg';
import nails070 from '../../assets/manu-nails/070_showcase.jpg';
import nails080 from '../../assets/manu-nails/080_showcase.jpg';
import nails090 from '../../assets/manu-nails/090_showcase.jpg';

const slides = [
  { src: nails010, alt: 'Unhas amendoadas com francesinha preta e nail art rosa inspirada em asas de borboleta', caption: 'Arte criativa' },
  { src: nails020, alt: 'Pedicure tradicional com esmaltação branca', caption: 'Clássico delicado' },
  { src: nails030, alt: 'Unhas amendoadas claras com contorno dourado junto às cutículas', caption: 'Dourado delicado' },
  { src: nails040, alt: 'Unhas amendoadas com francesinha azul, detalhes florais e brilho dourado', caption: 'Azul artístico' },
  { src: nails050, alt: 'Pedicure lilás com pequenas flores brancas', caption: 'Flores delicadas' },
  { src: nails060, alt: 'Unhas curtas vermelhas com filha única em francesinha', caption: 'Vermelho elegante' },
  { src: nails070, alt: 'Unhas curtas com francesinha branca e desenhos de cerejas', caption: 'Cerejas divertidas' },
  { src: nails080, alt: 'Unhas curtas em rosa e marrom decoradas com poás', caption: 'Poá romântico' },
  { src: nails090, alt: 'Unhas quadradas rosas com acabamento metalizado', caption: 'Efeito cromado' },
];

interface ManuNailsDetailProps {
  href: string;
  onClose: () => void;
  closeButtonRef: RefObject<HTMLButtonElement | null>;
}

export default function ManuNailsDetail({ href, onClose, closeButtonRef }: ManuNailsDetailProps) {
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
      className="flex h-[520px] max-h-[calc(100svh-112px)] w-full flex-col overflow-hidden border border-[#d9bfc5] bg-[#fffdfb] shadow-[0_18px_50px_rgba(41,33,31,0.13)]"
    >
      <div className="shrink-0 border-b border-[#e6d3d4] px-6 pb-4 pt-6 sm:px-7 sm:pt-7">
        <div className="flex items-start justify-between gap-3">
          <span className="pt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#762d4a]">Nail designer / Araxá</span>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Fechar informações de Manu C. Nails" className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#d9bfc5] text-[#762d4a] transition-colors hover:bg-[#f2e2de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">
            <X size={17} aria-hidden="true" />
          </button>
        </div>
        <h2 id="orbit-project-title" className="mt-4 flex w-fit flex-col items-center text-[#762d4a]">
          <span className="font-serif text-[2.7rem] font-semibold leading-[0.8] tracking-[-0.06em]">manu c.</span>
          <span className="mt-2 text-[9px] font-bold uppercase tracking-[0.32em] text-[#29211f]">Nails</span>
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pb-6 pt-4 sm:px-7 sm:pb-7">
        <p id="orbit-project-summary" className="text-sm leading-6 text-[#66595a]">O website da Manuella Castro, designer de unhas em Araxá, ganhou uma <strong className="font-semibold text-[#762d4a]">vitrine virtual</strong> para apresentar o seu trabalho de forma profissional na internet.</p>

        <ProjectCarousel label="Trabalhos de Manu C. Nails" slides={slides} accent="#762d4a" border="#d9bfc5" surface="#f2e2de" aspect="portrait" />

        <section aria-labelledby="manu-identity-title" className="mt-7 border-t border-[#e6d3d4] pt-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b59063]">Identidade / Cuidado</p>
          <h3 id="manu-identity-title" className="mt-3 font-serif text-[2rem] leading-[0.95] tracking-[-0.035em] text-[#762d4a]">Um design <em className="text-[#c98283]">moderno</em></h3>
          <p className="mt-4 text-sm leading-6 text-[#66595a]">O site foi modelado para trazer essa visão moderna com profissionalismo. Um perfil no Instagram já permite criar uma vitrine para o trabalho; o website transforma essa vitrine em uma experiência especial e sofisticada.</p>
        </section>

        <a href="https://www.instagram.com/reel/Dd896NnMK6k/?utm_source=ig_web_copy_link&rpxt=MzRlODBiNWFlZA==&srtk=MzRlODBiNWFlZA==" target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center gap-3 border border-[#d9bfc5] bg-[#f8ebeb] p-3 text-[#762d4a] transition-colors hover:bg-[#f2e2de] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#762d4a] text-white"><Play size={18} fill="currentColor" aria-hidden="true" /></span>
          <span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[0.16em] text-[#946f7b]">Vídeo de apresentação</span><strong className="mt-1 block text-sm leading-tight">Assista no Instagram</strong></span>
          <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
        </a>

        <a href={href} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 border-b-2 border-[#762d4a] pb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#762d4a] transition-colors hover:text-[#c98283] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b5cca]">
          Visite o site <ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>
    </motion.article>
  );
}
