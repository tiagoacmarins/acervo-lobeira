/**
 * Florzinha lilás — o mesmo motivo da flor que aparece na logo oficial do
 * Instituto Lobeira, usada aqui como um acento decorativo enquanto o
 * arquivo definitivo da logo não entra no lugar do wordmark em texto.
 */
export default function FlorLilas({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <g fill="currentColor">
        <path d="M12 2c1.8 1.6 2.8 3.4 2.8 5.2 0 1.5-1.2 2.8-2.8 2.8s-2.8-1.3-2.8-2.8C9.2 5.4 10.2 3.6 12 2z" />
        <path d="M4.6 6.8c2.3.4 4.1 1.5 5.1 3 .8 1.3.4 2.9-.9 3.7s-2.9.4-3.7-.9c-1-1.6-1.1-3.8-.5-5.8z" />
        <path d="M19.4 6.8c.6 2 .5 4.2-.5 5.8-.8 1.3-2.4 1.7-3.7.9s-1.7-2.4-.9-3.7c1-1.5 2.8-2.6 5.1-3z" />
      </g>
    </svg>
  );
}
