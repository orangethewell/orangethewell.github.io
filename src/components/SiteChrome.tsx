import orangeIcon from '../../assets/icon-black.png';

export function SiteHeader() {
  return (
    <header className="relative z-30 mx-auto flex max-w-[1460px] flex-wrap items-center justify-between gap-x-5 gap-y-4 px-5 py-6 sm:px-9 lg:px-14">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-3 focus:z-50 focus:rounded-md focus:bg-[#272b29] focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white">
        Pular para o conteúdo
      </a>
      <a
        href="#inicio"
        aria-label="Wellington Guimarães Jr. — voltar ao início"
        className="flex items-center gap-3 rounded-sm font-semibold tracking-[-0.06em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5b5cca]"
      >
        <img src={orangeIcon} alt="" width={112} height={114} className="size-8 object-contain" />
        <span className="hidden text-[10px] font-medium uppercase tracking-[0.18em] text-[#69716c] sm:inline">Portfólio / {new Date().getFullYear()}</span>
      </a>

      <span className="hidden items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#67706b] lg:inline-flex">
        Visual / Web <span className="size-1.5 rounded-full bg-[#d87822]" />
      </span>
    </header>
  );
}
