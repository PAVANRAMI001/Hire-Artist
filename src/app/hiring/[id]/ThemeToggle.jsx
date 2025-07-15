"use client";

/**
 * Tiny checkbox‑based theme switcher.
 * Adds or removes `light-theme` on <body>.
 */
export default function ThemeToggle() {
  return (
    <>
      <input
        type="checkbox"
        id="theme-switch"
        className="theme-switch"
        onChange={(e) =>
          document.body.classList.toggle("light-theme", e.target.checked)
        }
      />
      <label htmlFor="theme-switch" className="theme-switch-label">
        toggle
      </label>
    </>
  );
}
