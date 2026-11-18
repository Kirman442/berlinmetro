import { forwardRef, useEffect, useRef } from 'react';
import { Popup } from 'react-map-gl/maplibre';

// MapLibre смещает попап через translate(-50%,-100%): при нечётной ширине/высоте получаются полпикселя
// и текст размывается. Пересчитываем проценты в целые пиксели.
const CrispPopup = forwardRef(function CrispPopup(props, outerRef) {
  const ref = useRef(null);
  useEffect(() => {
    const popup = ref.current;
    const el = popup && popup.getElement();
    if (!el) return undefined;
    const fix = () => {
      const t = el.style.transform;
      if (!t.includes('%')) return;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      el.style.transform = t.replace(/translate\((-?[\d.]+)%,\s*(-?[\d.]+)%\)/,
        (_, x, y) => `translate(${Math.round((w * x) / 100)}px,${Math.round((h * y) / 100)}px)`);
    };
    fix();
    const mo = new MutationObserver(fix);
    mo.observe(el, { attributes: true, attributeFilter: ['style'] });
    // размер содержимого поменялся (другой год) — пусть MapLibre пересчитает позицию заново
    const ro = new ResizeObserver(() => popup.setLngLat(popup.getLngLat()));
    ro.observe(el);
    return () => { mo.disconnect(); ro.disconnect(); };
  }, []);
  return (
    <Popup
      {...props}
      ref={(p) => {
        ref.current = p;
        if (typeof outerRef === 'function') outerRef(p); else if (outerRef) outerRef.current = p;
      }}
    />
  );
});

export default CrispPopup;
