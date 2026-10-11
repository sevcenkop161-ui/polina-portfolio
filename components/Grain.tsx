// Плёночное зерно: SVG-шум (feTurbulence) поверх всей страницы.
// pointer-events: none — слой не мешает кликам. Стили в globals.css (.grain).
export default function Grain() {
  return <div className="grain" aria-hidden="true" />;
}
