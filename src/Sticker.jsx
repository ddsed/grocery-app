// Sticker.jsx — shows one sticker image popping up in the middle of the screen.
// Purely visual: taps pass through it (pointer-events: none in index.css).

export default function Sticker({ src }) {
  return (
    <div className="sticker" aria-hidden="true">
      <img src={src} alt="" />
    </div>
  );
}