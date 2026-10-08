/**
 * Ref-counted body scroll lock. Multiple modals can stack (enquiry popup,
 * auth modal); the body only unlocks when the LAST lock releases, so one
 * modal's cleanup can never restore a stale value over another's lock.
 */

let lockCount = 0;

export function lockScroll() {
  if (typeof document === "undefined") return;
  if (lockCount++ === 0) {
    document.body.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  if (typeof document === "undefined" || lockCount === 0) return;
  if (--lockCount === 0) {
    document.body.style.overflow = "";
  }
}
