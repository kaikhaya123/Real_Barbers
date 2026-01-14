'use client';

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

interface MenuItem {
  label: string;
  ariaLabel?: string;
  link: string;
}

interface SocialItem {
  label: string;
  link: string;
}

interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: MenuItem[];
  socialItems?: SocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  accentColor?: string;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/logo/Pro_barbershop_logo.png',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  isFixed = false,
  accentColor = '#ff6b6b',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLElement>(null);
  const preLayersRef = useRef<HTMLDivElement>(null);
  const preLayerElsRef = useRef<Element[]>([]);

  const plusHRef = useRef<HTMLSpanElement>(null);
  const plusVRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const textInnerRef = useRef<HTMLSpanElement>(null);
  const textWrapRef = useRef<HTMLSpanElement>(null);
  const [textLines, setTextLines] = useState(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: Element[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const tl = gsap.timeline({ paused: true });

    // Animate layers sliding in
    layers.forEach((layer, i) => {
      const offscreen = position === 'left' ? -100 : 100;
      tl.fromTo(layer, { xPercent: offscreen }, { xPercent: 0, duration: 0.4, ease: 'power3.out' }, i * 0.05);
    });

    // Animate panel sliding in
    const offscreen = position === 'left' ? -100 : 100;
    tl.fromTo(panel, { xPercent: offscreen }, { xPercent: 0, duration: 0.5, ease: 'power3.out' }, 0);

    // Animate menu items fading in
    const items = Array.from(panel.querySelectorAll('li'));
    items.forEach((item, i) => {
      tl.fromTo(item, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 0.3 + i * 0.08);
    });

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;
    const tl = gsap.timeline();

    // Fade out items
    const items = Array.from(panel.querySelectorAll('li'));
    items.forEach((item, i) => {
      tl.to(item, { opacity: 0, y: -10, duration: 0.3, ease: 'power2.in' }, i * 0.04);
    });

    // Slide out layers and panel
    [...layers, panel].forEach((el, i) => {
      tl.to(el, { xPercent: offscreen, duration: 0.4, ease: 'power3.in' }, 0.1 + i * 0.05);
    });

    tl.eventCallback('onComplete', () => {
      busyRef.current = false;
    });

    closeTweenRef.current = tl;
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      spinTweenRef.current = gsap.to([h, v], {
        rotate: 45,
        duration: 0.4,
        ease: 'power2.out',
      });
    } else {
      spinTweenRef.current = gsap.to([h, v], {
        rotate: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      // Color animation already handled by CSS transitions
    },
    []
  );

  const animateText = useCallback((opening: boolean) => {
    // Text transitions handled by HTML content
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  // Handle navigation link clicks
  const handleLinkClick = useCallback(() => {
    // Small delay to allow animation to start smoothly
    setTimeout(() => {
      closeMenu();
    }, 50);
  }, [closeMenu]);

  // Prevent body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [open]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div
      className={`sm-scope z-40 ${
        isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden' : 'w-full h-full'
      }`}
      style={{ pointerEvents: open ? 'auto' : 'none' }}
    >
      {/* Toggle Button - Always Visible */}
      <button
        ref={toggleBtnRef}
        className={`fixed top-6 right-6 z-50 inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer font-medium text-sm leading-none pointer-events-auto transition-all duration-300 ${
          open ? 'text-black' : 'text-white'
        }`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={toggleMenu}
        type="button"
      >
        <span className="hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
        <span
          ref={iconRef}
          className="relative w-5 h-5 flex items-center justify-center"
          aria-hidden="true"
        >
          <span
            ref={plusHRef}
            className="absolute w-full h-0.5 bg-current rounded"
          />
          <span
            ref={plusVRef}
            className="absolute w-0.5 h-full bg-current rounded"
          />
        </span>
      </button>

      <div
        className={
          (className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full'
        }
        style={accentColor ? { ['--sm-accent' as any]: accentColor } : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            let arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        {/* Panel with menu items */}
        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 h-full w-full bg-white flex flex-col overflow-y-auto z-10 pointer-events-auto"
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
          aria-hidden={!open}
        >
          {/* Header inside panel */}
          <div className="sticky top-0 w-full flex items-center justify-between p-6 bg-white border-b border-gray-100 z-30">
            <div className="flex items-center">
              <Image
                src={logoUrl || '/logo/Pro_barbershop_logo.png'}
                alt="Logo"
                className="h-8 w-auto object-contain"
                draggable={false}
                width={110}
                height={24}
                priority
              />
            </div>
            <div className="w-5 h-5" />
          </div>

          {/* Menu content */}
          <div className="flex-1 flex flex-col p-6 gap-8">
            {/* Navigation items */}
            <nav>
              <ul
                className="list-none m-0 p-0 flex flex-col gap-6"
                role="list"
              >
                {items && items.length > 0 ? (
                  items.map((it, idx) => (
                    <li key={`${it.label}-${idx}`} className="overflow-hidden">
                      <a
                        href={it.link}
                        className="block text-3xl font-bold text-black uppercase tracking-tight hover:text-[var(--sm-accent,#ff6b6b)] transition-colors"
                        aria-label={it.ariaLabel}
                        onClick={handleLinkClick}
                      >
                        <span className="inline-block">
                          {it.label}
                        </span>
                        {displayItemNumbering && (
                          <span className="ml-2 text-[var(--sm-accent,#ff6b6b)] text-sm font-normal">
                            0{idx + 1}
                          </span>
                        )}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No items available</li>
                )}
              </ul>
            </nav>

            {/* Social links */}
            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="mt-auto pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-[var(--sm-accent,#ff6b6b)] mb-4 uppercase tracking-wider">
                  Connect
                </h3>
                <ul className="list-none m-0 p-0 flex flex-col gap-3">
                  {socialItems.map((s, i) => (
                    <li key={`${s.label}-${i}`}>
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black font-medium hover:text-[var(--sm-accent,#ff6b6b)] transition-colors"
                      >
                        {s.label} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
.sm-scope { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope.fixed { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; }
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; pointer-events: none; }
.sm-scope .staggered-menu-wrapper[data-open] { pointer-events: auto; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; visibility: hidden; }
.sm-scope .staggered-menu-wrapper[data-open] .sm-prelayers { visibility: visible; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; width: 100%; height: 100%; }
.sm-scope [data-position="left"] .sm-prelayer { left: 0; right: auto; }
.sm-scope .staggered-menu-panel { position: fixed; top: 0; right: 0; width: 100%; height: 100vh; background: white; overflow-y: auto; overscroll-behavior: contain; z-index: 50; pointer-events: auto; visibility: hidden; opacity: 0; }
.sm-scope .staggered-menu-wrapper[data-open] .staggered-menu-panel { visibility: visible; opacity: 1; }
.sm-scope [data-position="left"] .staggered-menu-panel { left: 0; right: auto; }
.sm-scope .staggered-menu-panel header { position: sticky; top: 0; width: 100%; background: white; z-index: 40; }
.sm-scope a { color: inherit; text-decoration: none; }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
