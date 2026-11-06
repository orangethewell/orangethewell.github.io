import { useCallback, useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ArrowUpRight, AtSign, Mail, MessageCircle, Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import SaturnOrbit, { OrbitItem } from './components/SaturnOrbit';
import GradientASCII from './components/GradientASCII';
import LeBiageDetail from './components/LeBiageDetail';
import EcaonomiaDetail from './components/EcaonomiaDetail';
import ManuNailsDetail from './components/ManuNailsDetail';
import { SiteHeader } from './components/SiteChrome';
import { portfolioItems } from './data/projects';
import portrait from '../assets/img-hero.webp';

gsap.registerPlugin(useGSAP, ScrollToPlugin);

const portraitAsset = {
  src: portrait,
  alt: 'Wellington Guimarães Jr., de gravata laranja, apontando para o projeto em destaque.',
  width: 1081,
  height: 1289,
};

const heroPanelClassName = 'relative border border-[#d8d5ca] bg-[#fffdfa]/95 p-6 shadow-[0_18px_50px_rgba(51,46,35,0.08)] sm:p-7';
const whatsappUrl = `https://wa.me/5534988688130?text=${encodeURIComponent('Olá, Wellington! Vi seu portfólio e gostaria de conversar sobre um projeto.')}`;

export default function App() {
  const pageRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [targetProjectId, setTargetProjectId] = useState<string | null>(null);
  const [orbitPaused, setOrbitPaused] = useState(false);
  const selectedProject = portfolioItems.find((item) => item.id === selectedProjectId);
  const reducedMotion = useReducedMotion();

  const closeProject = useCallback(() => {
    setTargetProjectId(null);
    setSelectedProjectId(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const openProjectAfterOrbit = useCallback((id: string) => {
    setTargetProjectId(null);
    setSelectedProjectId(id);
  }, []);

  useEffect(() => {
    if (!selectedProjectId) return;
    let scrollTween: gsap.core.Tween | undefined;
    const frame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
      const detail = document.getElementById('orbit-project-detail');
      if (!detail || !window.matchMedia('(max-width: 1279px)').matches) return;
      if (reducedMotion) detail.scrollIntoView({ block: 'nearest' });
      else scrollTween = gsap.to(window, { scrollTo: { y: detail, offsetY: 24 }, duration: 0.6, ease: 'power2.out' });
    });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeProject();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      scrollTween?.kill();
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closeProject, reducedMotion, selectedProjectId]);

  useGSAP((_, contextSafe) => {
    const page = pageRef.current;
    if (!page || reducedMotion || !contextSafe) return;

    const onAnchorClick = contextSafe((event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const source = event.target;
      if (!(source instanceof Element)) return;
      const link = source.closest<HTMLAnchorElement>('a[href^="#"]');
      const hash = link?.getAttribute('href');
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, '', hash);
      gsap.to(window, {
        scrollTo: { y: target, offsetY: 20 },
        duration: 0.85,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          const hadTabIndex = target.hasAttribute('tabindex');
          if (!hadTabIndex) target.tabIndex = -1;
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        },
      });
    });
    page.addEventListener('click', onAnchorClick);
    return () => {
      page.removeEventListener('click', onAnchorClick);
    };
  }, { scope: pageRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div ref={pageRef} className="min-h-svh overflow-x-hidden bg-[#eeefec] text-[#1e211f]">
      <main>
        <section id="inicio" className="paper-texture relative isolate min-h-svh overflow-hidden border-b border-[#d9dcd7]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(ellipse_at_50%_38%,rgba(255,255,255,0.94),transparent_68%)]" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
            <GradientASCII
              colors={['#bca78f', '#dfc2a0', '#fff5e4', '#e9a762']}
              shape="horizon"
              characters=" .:+*#@"
              cellSize={20}
              density={0.7}
              glyphOpacity={0.45}
              gradientOpacity={0.38}
              glow={0.08}
              flicker={0.12}
              flow={0.3}
              speed={0.4}
              grain={0.03}
              lightMode
            />
          </div>

          <SiteHeader />

          <div id="conteudo" tabIndex={-1} className="relative z-10 mx-auto flex max-w-[1460px] flex-col gap-6 px-5 pt-5 pb-10 sm:px-9 xl:block xl:px-14 xl:pt-0 xl:pb-0">
            <h1 className="sr-only">Wellington Guimarães Jr. — sites e experiências digitais</h1>
            <div id="projetos" className="relative z-10 order-2 mx-auto w-full min-w-0 max-w-[860px] scroll-mt-8">
              <SaturnOrbit
                portrait={portraitAsset}
                className="z-10"
                featuredId="lebiage"
                paused={Boolean(targetProjectId || selectedProjectId)}
                autoRotatePaused={orbitPaused}
                focusId={targetProjectId}
                focusPoint={{ x: 0.02, y: 0.18 }}
                focusTrail={0}
                onFocusComplete={openProjectAfterOrbit}
              >
                {portfolioItems.map((item) => (
                  <OrbitItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    icon={item.icon}
                    iconSize={item.iconSize}
                    href={item.href}
                    color={item.color}
                    selected={selectedProjectId === item.id}
                    onSelect={() => {
                      if (selectedProjectId === item.id) {
                        closeProject();
                        return;
                      }
                      if (targetProjectId === item.id) return;
                      if (document.activeElement instanceof HTMLElement) triggerRef.current = document.activeElement;
                      setSelectedProjectId(null);
                      setTargetProjectId(item.id);
                    }}
                  />
                ))}
              </SaturnOrbit>
              {!reducedMotion && !targetProjectId && !selectedProjectId && (
                <button
                  type="button"
                  onClick={() => setOrbitPaused((current) => !current)}
                  aria-pressed={orbitPaused}
                  className="absolute bottom-1 right-0 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#d8d5ca] bg-[#fffdfa]/90 px-4 text-[11px] font-semibold text-[#39413a] shadow-sm backdrop-blur-sm transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]"
                >
                  {orbitPaused ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
                  {orbitPaused ? 'Retomar anel' : 'Pausar anel'}
                </button>
              )}
            </div>
            <div className={`relative z-20 order-1 w-full max-w-[420px] self-start xl:absolute xl:left-0 xl:top-0 ${selectedProject ? 'xl:w-[320px] 2xl:w-[350px]' : 'xl:w-[280px] 2xl:w-[300px]'}`}>
              {selectedProject?.id === 'lebiage' ? (
                  <LeBiageDetail href={selectedProject.href} onClose={closeProject} closeButtonRef={closeButtonRef} />
                ) : selectedProject?.id === 'ecaonomia' ? (
                  <EcaonomiaDetail href={selectedProject.href} onClose={closeProject} closeButtonRef={closeButtonRef} />
                ) : selectedProject?.id === 'manunails' ? (
                  <ManuNailsDetail href={selectedProject.href} onClose={closeProject} closeButtonRef={closeButtonRef} />
                ) : (
                  <div className={heroPanelClassName}>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#997043]">Sites e experiências digitais</span>
                    <h2 className="mt-8 max-w-[280px] text-[clamp(2.8rem,4vw,4.4rem)] font-black leading-[0.94] tracking-[-0.075em] text-[#242621] xl:text-[3.5rem]">Bora criar algo <em className="font-serif font-medium text-[#d87822]">bacana</em>?</h2>
                    <p className="mt-6 text-sm leading-6 text-[#56615a]">Sites e experiências digitais que dão personalidade ao seu negócio.</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-12 w-full items-center justify-between gap-2 rounded-full bg-[#d87822] px-4 py-2 text-[11px] font-bold uppercase leading-4 tracking-[0.06em] text-[#241b14] shadow-[0_8px_20px_rgba(171,88,19,0.2)] transition-[transform,background-color,box-shadow] hover:bg-[#e9a762] hover:shadow-[0_10px_24px_rgba(171,88,19,0.28)] motion-safe:hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]">
                      Conversar sobre um projeto <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" /><span className="sr-only">(abre em nova aba)</span>
                    </a>
                    <p className="mt-6 text-xs font-bold uppercase leading-5 tracking-[0.12em] text-[#262923]">Clique em um ícone para descobrir mais!</p>
                    <p className="mt-2 text-[11px] leading-5 text-[#69716c]">Le Biagê · Ecãonomia · Manu C. Nails</p>
                  </div>
                )}
            </div>
            <aside id="sobre" aria-labelledby="about-title" className="relative z-20 order-3 w-full max-w-[420px] self-end scroll-mt-8 xl:absolute xl:right-14 xl:top-[25%] xl:w-[260px] 2xl:w-[290px]">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b16b2b]">01 / Apresentação</span>
              <h2 id="about-title" className="mt-5 text-3xl font-black tracking-[-0.07em]">Sobre mim<span className="text-[#d87822]">.</span></h2>
              <p className="mt-5 text-sm leading-6 text-[#56615a]">Sou <b>Wellington Guimarães Jr.</b>, desenvolvedor de sistemas digitais. Crio sites e experiências web que traduzem a identidade de cada negócio em uma presença online clara e memorável.</p>
              <div className="mt-6 border-t border-[#d8d5ca] pt-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b16b2b]">Contato</h3>
                <div className="mt-2 flex flex-col">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-[#39413a] transition-colors hover:text-[#b85e18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]"><MessageCircle size={16} className="shrink-0" aria-hidden="true" />WhatsApp · (34) 98868-8130<span className="sr-only"> (abre em nova aba)</span></a>
                  <a href="mailto:wcguimaraesjr@gmail.com" className="inline-flex min-h-11 items-center gap-2 break-all text-xs font-medium text-[#39413a] transition-colors hover:text-[#b85e18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]"><Mail size={16} className="shrink-0" aria-hidden="true" />E-mail · wcguimaraesjr@gmail.com</a>
                  <a href="https://www.instagram.com/wellington_jr.dev/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-[#39413a] transition-colors hover:text-[#b85e18] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5b5cca]"><AtSign size={16} className="shrink-0" aria-hidden="true" />Instagram · @wellington_jr.dev<span className="sr-only"> (abre em nova aba)</span></a>
                </div>
              </div>
            </aside>
          </div>

          <div className="relative z-20 mx-auto max-w-[1460px] px-6 pb-7 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#778079] sm:px-9 lg:px-14">
            <span>Wellington Guimarães Jr. · {new Date().getFullYear()}</span>
          </div>
        </section>

      </main>
    </div>
  );
}
