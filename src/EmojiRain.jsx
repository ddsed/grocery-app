// EmojiRain.jsx — draws one emoji "raining" over the whole screen.
// Purely visual: it covers the screen but ignores taps (pointer-events: none
// in index.css), so you can keep using the app while it rains.
// The parent (ListScreen) decides when to show and remove it.

export default function EmojiRain({ emoji, drops }) {
  return (
    // aria-hidden: screen readers skip this decoration
    <div className="emoji-rain" aria-hidden="true">
      {drops.map((drop) => (
        <span
          key={drop.id}
          // Each drop gets its own position, size, and timing
          style={{
            left: `${drop.left}%`,
            fontSize: `${drop.size}px`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
