import"./index-VKzKZO7f.js";/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/main/LICENSE.md for details.
 * v1.11.0
 */function o(){return navigator.userAgentData}function g(){const e=o();return e!=null&&e.brands?e.brands.map(({brand:t,version:a})=>`${t}/${a}`).join(" "):navigator.userAgent}const i=/firefox/i.test(g()),r=i?new WeakMap:null;function b(){const{disabled:e}=this;e||HTMLElement.prototype.click.call(this)}function s(e){const t=e.target;if(i&&!r.get(t))return;const{disabled:a}=t;a&&e.preventDefault()}const u=["mousedown","mouseup","click"];function l(e){if(i&&!r.get(e.target))return;const{disabled:t}=e.target;t&&(e.stopImmediatePropagation(),e.preventDefault())}const n={capture:!0};function k(e,t=!1){if(e.disabled){e.el.setAttribute("tabindex","-1"),e.el.setAttribute("aria-disabled","true"),e.el.contains(document.activeElement)&&document.activeElement.blur(),c(e);return}f(e),typeof t=="function"?e.el.setAttribute("tabindex",t.call(e)?"0":"-1"):t===!0?e.el.setAttribute("tabindex","0"):t===!1&&e.el.removeAttribute("tabindex"),e.el.removeAttribute("aria-disabled")}function c(e){e.el.click=b,v(i?d(e):e.el)}function v(e){e&&(e.addEventListener("pointerdown",s,n),u.forEach(t=>e.addEventListener(t,l,n)))}function d(e){return r.get(e.el)}function f(e){delete e.el.click,E(i?d(e):e.el)}function E(e){e&&(e.removeEventListener("pointerdown",s,n),u.forEach(t=>e.removeEventListener(t,l,n)))}function x(e){if(!e.disabled||!i)return;const t=e.el.parentElement||e.el;r.set(e.el,t),c(e)}function L(e){i&&(r.delete(e.el),f(e))}export{x as c,L as d,k as u};
