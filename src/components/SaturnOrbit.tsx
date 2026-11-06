import {
  Children,
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { gsap } from 'gsap';
import { createRingSegments, projectOrbit, type OrbitGeometry, type RingSegment } from './orbitMath';

export interface OrbitItemProps {
  id: string;
  label: string;
  icon: ReactNode;
  href: string;
  color?: string;
  /** Use a larger visual for detailed favicon assets without changing the link's hit area. */
  iconSize?: 'regular' | 'large';
  external?: boolean;
  /** When provided, the icon opens an in-page detail instead of navigating. */
  onSelect?: () => void;
  selected?: boolean;
}

/** Declarative child consumed by SaturnOrbit; the parent renders the link. */
export function OrbitItem(_props: OrbitItemProps): null {
  return null;
}

export interface EllipseOptions {
  /** Radii are fractions of the stage width. */
  radiusX?: number;
  radiusY?: number;
  /** Rotations in degrees. X produces the flattened perspective; Z is the screen diagonal. */
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  /** Vertical orbit center, as a fraction of stage height. */
  centerYDesktop?: number;
  centerYMobile?: number;
}

export interface SaturnOrbitProps {
  portrait: { src: string; alt: string; width?: number; height?: number };
  children: ReactNode;
  behindPortrait?: ReactNode;
  featuredId?: string;
  /** Rotation of the evenly spaced group in degrees. */
  startAngle?: number;
  durationSeconds?: number;
  paused?: boolean;
  /** Stops automatic rotation while keeping drag and project selection available. */
  autoRotatePaused?: boolean;
  /** Move this item to the featured angle, then call onFocusComplete. */
  focusId?: string | null;
  /** Optional point on the displayed portrait (0–1 coordinates) used as the exact focus target. */
  focusPoint?: { x: number; y: number };
  /** How far the selected icon trails the focus point, as a fraction of item spacing. */
  focusTrail?: number;
  onFocusComplete?: (id: string) => void;
  ellipse?: EllipseOptions;
  className?: string;
}

interface DragState {
  startX: number;
  lastX: number;
  lastTime: number;
  velocity: number;
  moved: boolean;
}

const degrees = (value: number) => (value * Math.PI) / 180;

function Ring({ segments, front }: { segments: RingSegment[]; front: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      style={{ zIndex: front ? 4 : 0 }}
    >
      {segments.filter((segment) => segment.front === front).map((segment, index) => (
        <line
          key={index}
          x1={segment.x1}
          y1={segment.y1}
          x2={segment.x2}
          y2={segment.y2}
          stroke={segment.stroke}
          strokeOpacity={segment.opacity}
          strokeWidth={front ? 1.45 : 1.05}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export default function SaturnOrbit({
  portrait,
  children,
  behindPortrait,
  featuredId,
  startAngle = 205,
  durationSeconds = 35,
  paused = false,
  autoRotatePaused = false,
  focusId,
  focusPoint,
  focusTrail = 0,
  onFocusComplete,
  ellipse,
  className = '',
}: SaturnOrbitProps) {
  const items = useMemo(() => Children.toArray(children).flatMap((child) => {
    if (!isValidElement<OrbitItemProps>(child) || child.type !== OrbitItem) return [];
    return [child.props];
  }), [children]);
  const reducedMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const linkRefs = useRef(new Map<string, HTMLElement>());
  const geometryRef = useRef<OrbitGeometry | null>(null);
  const phaseRef = useRef(0);
  const spinVelocityRef = useRef((Math.PI * 2) / Math.max(durationSeconds, 1));
  const pausedRef = useRef(false);
  const hoveredRef = useRef(false);
  const focusedRef = useRef(false);
  const visibleRef = useRef(true);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const [segments, setSegments] = useState<RingSegment[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const draw = useCallback(() => {
    const geometry = geometryRef.current;
    if (!geometry) return;
    const anchorIndex = Math.max(0, items.findIndex((item) => item.id === featuredId));
    const spacing = (Math.PI * 2) / Math.max(items.length, 1);
    items.forEach((item, index) => {
      const link = linkRefs.current.get(item.id);
      if (!link) return;
      const angle = degrees(startAngle) + (index - anchorIndex) * spacing + phaseRef.current;
      const point = projectOrbit(angle, geometry);
      const opacity = point.z < 0
        ? 0.42 + (point.depth + 1) * 0.32
        : 0.8 + point.depth * 0.2;
      link.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${point.scale.toFixed(4)})`;
      link.style.opacity = String(opacity);
      link.style.zIndex = point.z < 0 ? '1' : '5';
      link.dataset.depth = point.z < 0 ? 'rear' : 'front';
    });
  }, [featuredId, items, startAngle]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      const compact = window.matchMedia('(max-width: 767px)').matches;
      const defaultRadius = compact ? 0.4 : 0.43;
      const radiusX = width * (ellipse?.radiusX ?? defaultRadius);
      const radiusY = width * (ellipse?.radiusY ?? defaultRadius);
      geometryRef.current = {
        centerX: width / 2,
        centerY: height * (compact ? (ellipse?.centerYMobile ?? 0.58) : (ellipse?.centerYDesktop ?? 0.455)),
        radiusX,
        radiusY,
        rotationX: ellipse?.rotationX ?? 70,
        rotationY: ellipse?.rotationY ?? 0,
        rotationZ: ellipse?.rotationZ ?? 20,
        cameraDistance: Math.max(radiusX, radiusY) * 4.6,
      };
      setSegments(createRingSegments(geometryRef.current));
      draw();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [draw, ellipse?.radiusX, ellipse?.radiusY, ellipse?.rotationX, ellipse?.rotationY, ellipse?.rotationZ, ellipse?.centerYDesktop, ellipse?.centerYMobile]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const normalSpeed = (Math.PI * 2) / Math.max(durationSeconds, 1);
    if (reducedMotion) {
      phaseRef.current = 0;
      spinVelocityRef.current = normalSpeed;
      draw();
      return;
    }
    const tick = (_time: number, deltaTime: number) => {
      if (paused || autoRotatePaused || pausedRef.current || !visibleRef.current || document.visibilityState !== 'visible') {
        if (!dragRef.current) spinVelocityRef.current = normalSpeed;
        return;
      }
      const step = Math.min(deltaTime, 50) / 1000;
      phaseRef.current += spinVelocityRef.current * step;
      spinVelocityRef.current = normalSpeed + (spinVelocityRef.current - normalSpeed) * Math.exp(-step / 1.4);
      if (Math.abs(spinVelocityRef.current - normalSpeed) < 0.01) spinVelocityRef.current = normalSpeed;
      draw();
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [autoRotatePaused, draw, durationSeconds, paused, reducedMotion]);

  useEffect(() => {
    if (!focusId) return;
    spinVelocityRef.current = (Math.PI * 2) / Math.max(durationSeconds, 1);
    const index = items.findIndex((item) => item.id === focusId);
    if (index < 0) return;
    const anchorIndex = Math.max(0, items.findIndex((item) => item.id === featuredId));
    const spacing = (Math.PI * 2) / Math.max(items.length, 1);
    const itemBaseAngle = degrees(startAngle) + (index - anchorIndex) * spacing;
    let focusAngle = degrees(startAngle);
    const geometry = geometryRef.current;
    const portraitElement = portraitRef.current;
    const stageElement = stageRef.current;
    if (focusPoint && geometry && portraitElement && stageElement) {
      const portraitBounds = portraitElement.getBoundingClientRect();
      const stageBounds = stageElement.getBoundingClientRect();
      const targetX = portraitBounds.left - stageBounds.left + portraitBounds.width * focusPoint.x;
      const targetY = portraitBounds.top - stageBounds.top + portraitBounds.height * focusPoint.y;
      let closestDistance = Infinity;
      // This only runs on selection, so a dense search keeps the focus point
      // accurate across portrait and stage sizes without frame-time work.
      for (let step = 0; step < 720; step += 1) {
        const angle = (step / 720) * Math.PI * 2;
        const point = projectOrbit(angle, geometry);
        const distance = (point.x - targetX) ** 2 + (point.y - targetY) ** 2;
        if (distance < closestDistance) {
          closestDistance = distance;
          focusAngle = angle;
        }
      }
    }
    const targetPhase = focusAngle - spacing * focusTrail - itemBaseAngle;
    const difference = targetPhase - phaseRef.current;
    const shortestTurn = Math.atan2(Math.sin(difference), Math.cos(difference));
    const destination = phaseRef.current + shortestTurn;
    if (reducedMotion) {
      phaseRef.current = destination;
      draw();
      onFocusComplete?.(focusId);
      return;
    }
    const rotation = { value: phaseRef.current };
    const tween = gsap.to(rotation, {
      value: destination,
      duration: Math.max(0.55, Math.min(1.25, 0.35 + Math.abs(shortestTurn) / Math.PI)),
      ease: 'power2.inOut',
      onUpdate: () => {
        phaseRef.current = rotation.value;
        draw();
      },
      onComplete: () => {
        phaseRef.current = destination;
        draw();
        onFocusComplete?.(focusId);
      },
    });
    return () => { tween.kill(); };
  }, [draw, durationSeconds, featuredId, focusId, focusPoint?.x, focusPoint?.y, focusTrail, items, onFocusComplete, reducedMotion, startAngle]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || paused || event.button !== 0) return;
    dragRef.current = { startX: event.clientX, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false };
    suppressClickRef.current = false;
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const stage = stageRef.current;
    if (!drag || !stage || reducedMotion || paused) return;
    if (!drag.moved && Math.abs(event.clientX - drag.startX) <= 6) return;
    const wasMoving = drag.moved;
    if (!wasMoving) {
      drag.moved = true;
      stage.setPointerCapture(event.pointerId);
    }
    pausedRef.current = true;
    const angularStep = ((event.clientX - drag.lastX) / stage.clientWidth) * Math.PI * 2;
    const elapsed = Math.max(event.timeStamp - drag.lastTime, 8) / 1000;
    const instantaneousVelocity = Math.max(-8, Math.min(8, angularStep / elapsed));
    drag.velocity = wasMoving ? drag.velocity * 0.35 + instantaneousVelocity * 0.65 : instantaneousVelocity;
    phaseRef.current += angularStep;
    drag.lastX = event.clientX;
    drag.lastTime = event.timeStamp;
    draw();
    if (event.cancelable) event.preventDefault();
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    suppressClickRef.current = drag.moved;
    if (drag.moved) {
      const recentlyMoved = event.timeStamp - drag.lastTime < 100;
      spinVelocityRef.current = event.type === 'pointercancel' || !recentlyMoved
        ? (Math.PI * 2) / Math.max(durationSeconds, 1)
        : drag.velocity;
    }
    dragRef.current = null;
    pausedRef.current = hoveredRef.current || focusedRef.current;
    if (drag.moved) window.setTimeout(() => { suppressClickRef.current = false; }, 0);
  };

  return (
    <div
      ref={stageRef}
      className={`orbit-stage relative mx-auto aspect-[840/650] w-full max-w-[1000px] select-none overflow-visible max-[767px]:aspect-auto max-[767px]:h-[min(130vw,540px)] max-[767px]:min-h-[390px] ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => {
        hoveredRef.current = false;
        if (!dragRef.current) pausedRef.current = focusedRef.current;
        if (!focusedRef.current) setActiveId(null);
      }}
      onClickCapture={(event) => {
        if (suppressClickRef.current) {
          event.preventDefault();
          event.stopPropagation();
        }
      }}
    >
      <div className="pointer-events-none absolute inset-x-[12%] top-[22%] h-[65%] rounded-full bg-[radial-gradient(ellipse,rgba(214,155,89,0.13),transparent_68%)] blur-2xl" aria-hidden="true" />
      <Ring segments={segments} front={false} />
      {behindPortrait && <div className="pointer-events-none absolute inset-0 z-[2]">{behindPortrait}</div>}

      <img
        ref={portraitRef}
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        fetchPriority="high"
        draggable={false}
        className="orbit-portrait pointer-events-auto absolute bottom-0 left-1/2 z-[3] block w-[72%] max-w-[360px] -translate-x-1/2 object-contain drop-shadow-[0_28px_32px_rgba(71,48,31,0.15)] md:w-[60%] md:max-w-[600px]"
      />

      <Ring segments={segments} front />
      {items.map((item) => {
        const featured = item.id === featuredId;
        const external = item.external ?? /^https?:\/\//.test(item.href);
        const Control = item.onSelect ? 'button' : 'a';
        return (
          <Control
            key={item.id}
            ref={(element: HTMLElement | null) => {
              if (element) linkRefs.current.set(item.id, element);
              else linkRefs.current.delete(item.id);
            }}
            href={item.onSelect ? undefined : item.href}
            type={item.onSelect ? 'button' : undefined}
            target={!item.onSelect && external ? '_blank' : undefined}
            rel={!item.onSelect && external ? 'noopener noreferrer' : undefined}
            onClick={item.onSelect}
            aria-label={item.onSelect ? `Ver projeto ${item.label}` : `${item.label}${external ? ' (abre em nova aba)' : ''}`}
            aria-expanded={item.onSelect ? Boolean(item.selected) : undefined}
            aria-controls={item.onSelect ? 'orbit-project-detail' : undefined}
            className={`orbit-link group absolute left-0 top-0 flex items-center justify-center rounded-full ${featured ? 'size-[78px] max-[639px]:size-[70px]' : 'size-14'}`}
            style={{ color: item.color ?? '#594a3a', opacity: 0 }}
            onPointerEnter={() => {
              hoveredRef.current = true;
              pausedRef.current = true;
              setActiveId(item.id);
              const link = linkRefs.current.get(item.id);
              if (link) link.style.opacity = '1';
            }}
            onPointerLeave={() => {
              hoveredRef.current = false;
              pausedRef.current = focusedRef.current;
              setActiveId(null);
              draw();
            }}
            onFocus={() => {
              focusedRef.current = true;
              pausedRef.current = true;
              setActiveId(item.id);
              const link = linkRefs.current.get(item.id);
              if (link) {
                link.style.opacity = '1';
                link.style.zIndex = '6';
              }
            }}
            onBlur={() => {
              focusedRef.current = false;
              pausedRef.current = hoveredRef.current;
              setActiveId(null);
              draw();
            }}
          >
            <span className={`orbit-icon-face flex items-center justify-center ${featured ? 'size-[58px] max-[639px]:size-12' : item.iconSize === 'large' ? 'size-11 max-[639px]:size-9' : 'size-[30px] max-[639px]:size-7'}`}>
              {item.icon}
            </span>
            <AnimatePresence>
              {activeId === item.id && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: reducedMotion ? 0 : 0.16 }}
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-10 w-max max-w-40 -translate-x-1/2 rounded-md bg-[#29231e] px-3 py-1.5 text-center text-xs font-medium leading-tight text-white shadow-lg"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Control>
        );
      })}
    </div>
  );
}
