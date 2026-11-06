import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import './ProjectCarousel.css';

export interface ProjectSlide {
  src: string;
  alt: string;
  caption?: string;
  position?: string;
}

interface ProjectCarouselProps {
  label: string;
  slides: readonly ProjectSlide[];
  accent: string;
  border: string;
  surface: string;
  aspect?: 'landscape' | 'portrait';
}

export default function ProjectCarousel({ label, slides, accent, border, surface, aspect = 'landscape' }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; scrollLeft: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = useReducedMotion();
  const colors = {
    '--carousel-accent': accent,
    '--carousel-border': border,
    '--carousel-surface': surface,
  } as CSSProperties;

  const slideOffset = (index: number) => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    const slide = track?.children[index] as HTMLElement | undefined;
    return first && slide ? slide.offsetLeft - first.offsetLeft : 0;
  };

  const nearestIndex = () => {
    const track = trackRef.current;
    if (!track) return 0;
    let nearest = 0;
    for (let index = 1; index < slides.length; index += 1) {
      if (Math.abs(track.scrollLeft - slideOffset(index)) < Math.abs(track.scrollLeft - slideOffset(nearest))) nearest = index;
    }
    return nearest;
  };

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, slides.length - 1));
    trackRef.current?.scrollTo({ left: slideOffset(next), behavior: reducedMotion ? 'instant' : 'smooth' });
    setActiveIndex(next);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;
    pointerRef.current = { x: event.clientX, scrollLeft: track.scrollLeft };
    track.style.scrollSnapType = 'none';
    track.style.scrollBehavior = 'auto';
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current;
    const track = trackRef.current;
    if (!start || !track) return;
    track.scrollLeft = start.scrollLeft - (event.clientX - start.x);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!pointerRef.current || !track) return;
    pointerRef.current = null;
    track.style.scrollSnapType = '';
    track.style.scrollBehavior = '';
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    goTo(nearestIndex());
  };

  return (
    <div className="project-carousel mt-6" style={colors} role="group" aria-roledescription="carrossel" aria-label={label}>
      <div
        ref={trackRef}
        className="project-carousel__track"
        tabIndex={0}
        aria-label={`${label}. Use as setas do teclado ou deslize para ver as imagens.`}
        onScroll={() => setActiveIndex(nearestIndex())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') { event.preventDefault(); goTo(activeIndex + 1); }
          if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(activeIndex - 1); }
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {slides.map((slide, index) => (
          <figure key={`${slide.src}-${index}`} className="project-carousel__slide m-0" role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}`}>
            <img
              src={slide.src}
              alt={slide.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
              draggable={false}
              width={640}
              height={aspect === 'portrait' ? 800 : 480}
              style={{ objectPosition: slide.position || 'center' }}
              className={`w-full object-cover ${aspect === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]'}`}
            />
            {slide.caption && <figcaption className="project-carousel__caption">{slide.caption}</figcaption>}
          </figure>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span aria-live="polite" className="project-carousel__count text-[10px] font-bold uppercase tracking-[0.14em]">Imagem {activeIndex + 1} de {slides.length}</span>
        <div className="flex gap-2">
          <button type="button" onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0} aria-label="Imagem anterior" className="project-carousel__button flex size-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]"><ChevronLeft size={18} aria-hidden="true" /></button>
          <button type="button" onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === slides.length - 1} aria-label="Próxima imagem" className="project-carousel__button flex size-9 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]"><ChevronRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
