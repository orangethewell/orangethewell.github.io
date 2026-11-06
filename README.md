# Portfólio criativo — Wellington Guimarães Jr.

A single-hero portfolio built with React, TypeScript, Tailwind CSS, Motion, GSAP, and Vite. Three published projects appear in an interactive orbit. Selecting an icon opens that project's detail card with a gallery and a link to its site. The orbit uses DOM/SVG projection rather than WebGL, so its controls remain semantic HTML buttons or links and the scene works on devices without WebGL.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` for the type check and production build, then `npm run preview` to inspect the built site.

## Sharing image

`social/social-shot.html` is the editable 1200 × 630 HTML/CSS composition based on the hero. Run `npm run social:render` with Firefox installed to regenerate `public/social-shot.png`. Vite copies this image to the root of `dist/`; `index.html` points Open Graph and X large-card metadata at its absolute GitHub Pages URL. After changing the image, redeploy the site so sharing services can fetch the new file.

## Publish on GitHub Pages

This project is configured for the user site `https://orangethewell.github.io/`. The Vite base is `/`, and `.github/workflows/deploy.yml` builds the site with Node.js 24 and publishes only the generated `dist/` directory when a commit reaches the repository's default branch. The workflow can also be started manually from the Actions tab on that branch.

1. Push this source to the `orangethewell.github.io` repository on GitHub. Keep `package-lock.json` in the repository; `dist/` and `node_modules/` are generated and ignored.
2. In the repository, open **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. Push to the default branch or run **Deploy to GitHub Pages** from the Actions tab, then check the workflow result and the published site.

This workspace does not contain usable Git metadata, so its remote and default branch cannot be checked locally. The workflow reads the repository's actual default branch at run time.

## Content

The site has one page, `/`, containing the hero. The invitation presents the web design offer and links to WhatsApp; the about panel provides WhatsApp, email, and Instagram contact options. The orbit shows Le Biagê, Ecãonomia, and Manu C. Nails. Project names, icons, and external links are maintained in `src/data/projects.tsx`; each detail component contains its own description. The header uses `assets/icon-black.png` as its orange mark and favicon.

Le Biagê opens a fixed-height detail with a fixed header, internally scrolling body, animated image carousel, and a description of the Studio MOS collaboration and design concept. The photographs in `assets/lebiage/` are copies of the images at `https://lebiage.com.br/assets/`. The header uses the site's published `brand.svg` and `wordmark.svg` from the same directory. The detail also links to its presentation video and live site.

Ecãonomia uses the same fixed-height, internally scrolling detail pattern with its published pet gallery, copy about the brand's warmth and custom icons, and a link to the live site. The photographs in `assets/ecaonomia/` come from `https://ecaonomia.vercel.app/img/`; its mark is the existing optimized `assets/ecaonomia-brand.webp`.

Manu C. Nails has a matching detail with nine published portfolio photos from `https://manunails.com.br/img/`, their captions, a note about the website's visual identity, and links to its presentation video and live site. All three project details share `ProjectCarousel`: a horizontal, animated, snap-scrolling image strip with a peek at the next image, mouse drag, touch swipe, arrow keys, and previous/next buttons. Reduced-motion users get immediate scrolling.


## Use the component

```tsx
import SaturnOrbit, { OrbitItem } from './components/SaturnOrbit';
import { CodeXml } from 'lucide-react';
import orangeIcon from '../assets/icon-black.png';

<SaturnOrbit
  portrait={{ src: '/portrait-transparent.png', alt: 'Portrait description' }}
  featuredId="featured"
  durationSeconds={35}
  ellipse={{ radiusX: 0.43, radiusY: 0.43, rotationX: 70, rotationY: 0, rotationZ: 20 }}
>
  <OrbitItem
    id="featured"
    label="Featured project"
    icon={<img src={orangeIcon} alt="" />}
    href="/projects/featured"
    color="#D87822"
  />
  <OrbitItem
    id="social"
    label="Social profile"
    icon={<CodeXml aria-hidden="true" />}
    href="https://example.com/your-profile"
  />
</SaturnOrbit>
```

`OrbitItem` accepts `id`, `label`, `icon`, and `href`; `color`, `external`, `iconSize: 'regular' | 'large'`, `onSelect`, and `selected` are optional. Items are evenly spaced around the orbit in child order: each starts `360 / itemCount` degrees after the previous one. `featuredId` anchors that item at `startAngle` (205° by default); without it, the first item is anchored. Adding or removing an item updates every position automatically. Use `iconSize="large"` for detailed favicons. Without `onSelect`, an item is a link to `href`; with `onSelect`, it renders as a button so the parent can open an in-page detail card. To align a selected item with the portrait's pointing finger, pass its ID as `focusId`, optionally set `focusPoint` to the finger's normalized coordinates on the portrait, pause the automatic rotation with `paused`, and reveal the card in `onFocusComplete`. `autoRotatePaused` pauses only the automatic rotation, so dragging and project selection remain available; `paused` also blocks dragging while a detail is open. With `focusPoint`, the component finds the closest point on the projected orbit for the current portrait size; otherwise it uses `startAngle`. The portfolio page targets the fingertip at `(0.02, 0.18)` with no trailing offset. It rotates by the shortest arc and snaps directly to the target under `prefers-reduced-motion`. HTTP(S) link destinations open in a new tab by default. `ellipse` radii are fractions of the stage width; rotations are in degrees. The default radii are `0.43` of stage width on desktop and `0.40` below `md`. The portrait uses `72%` of stage width (up to `360px`) below `md`, then uses `60%` width (up to `600px`) from `md` upward. The stage can grow to `1000px` on desktop. Optional `behindPortrait` content sits between the rear orbit and portrait. The default orbit center is `0.455` of stage height on desktop and `0.58` below `md`; both can be overridden through `ellipse.centerYDesktop` and `ellipse.centerYMobile`.

The hero portrait came with this repository and is served as lossless WebP to preserve its alpha edges at a smaller download size. Le Biagê uses its published `favicon-dark.png`, and Ecãonomia uses its published `img/brand.png` favicon (served locally as optimized WebP). Manu C. Nails uses a replaceable generic icon until a site favicon is available.

## How occlusion works

Each frame computes an item's 3D position on the tilted ellipse, rotates it around X/Y/Z, then applies a perspective projection. The projected position, scale, and depth fade are written directly to the link element, without a React render per frame. GSAP's ticker supplies the animation frame; it is paused when the scene is off screen or the tab is hidden. Dragging changes the orbital phase; on release, the orbit keeps the swipe's angular speed and eases back to its normal rotation. Motion stops when `prefers-reduced-motion` is enabled.

The ring is one continuous ellipse sampled into adjoining segments. Segments and icons with negative depth sit **behind** the transparent portrait WebP; positive depth sits in front. The portrait's alpha channel therefore clips the rear orbit against the actual hair, finger, shoulder, and jacket edges. The default framing puts the front arc below the face. When using another portrait, provide a transparent PNG/WebP with clean alpha and tune the radii, rotations, and center values to keep the face clear. No gradient mask is used for silhouette occlusion. The rear opacity and scale are based on depth, while the ring uses a restrained orange/gold depth gradient.

Because the scene is DOM/SVG, browser rendering already adapts to device pixel ratio. There are no Three.js textures or GPU resources to dispose. The component disconnects its resize and intersection observers and removes its GSAP ticker callback on unmount.

## Page composition and breakpoints

The hero centers the portrait and orbit between an invitation card and a short “Sobre mim” panel. The invitation says “Bora criar algo bacana?” and points to the orbit. Clicking an orbit icon rotates it toward the pointing finger and replaces the invitation with that project's detail card. The card links to the published project site in a new tab. Escape or the close button restores the invitation.

The hero background uses React Bits' [Gradient ASCII](https://www.reactbits.dev/backgrounds/gradient-ascii) TypeScript/CSS component in light mode, tuned to the site's warm palette. Its canvas sits behind the content; the existing paper and radial background remain visible if WebGL2 is unavailable. The component pauses when off screen or the tab is hidden and holds still for reduced-motion users. Cleanup releases GPU resources without forcing a WebGL context loss, which also supports React Strict Mode's development remount.

- **Wide desktop (1280px and wider):** the invitation and about panel sit beside the centered orbit. The project detail takes the invitation's place after selection.
- **Tablet and phone:** the invitation or project detail comes first, followed by the orbit and about panel. The orbit retains touch dragging and large controls.

## Focus and motion

The home registers `useGSAP` and `ScrollToPlugin` in React. The project detail scrolls into view on tablet and phone, and its close button returns focus to the selected orbit icon. `useGSAP` scopes animations to the page and reverts them on cleanup; reduced-motion users get immediate navigation.
