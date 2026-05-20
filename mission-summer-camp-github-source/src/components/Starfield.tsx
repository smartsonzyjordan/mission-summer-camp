"use client";

export function Starfield() {
  const stars = Array.from({ length: 95 }, (_, index) => {
    const size = 1 + ((index * 7) % 4);
    return {
      id: index,
      size,
      top: `${(index * 37) % 100}%`,
      left: `${(index * 61) % 100}%`,
      delay: `${(index % 9) * 0.22}s`
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <span
          key={star.id}
          className="star-dot"
          style={{ width: star.size, height: star.size, top: star.top, left: star.left, animationDelay: star.delay }}
        />
      ))}
      <div className="absolute left-8 top-24 h-16 w-28 -rotate-12 rounded-full border border-cyan-300/30" />
      <div className="absolute right-5 top-10 h-12 w-20 rotate-12 rounded-full border border-amber-300/40" />
      <div className="absolute bottom-32 left-4 h-10 w-16 rotate-12 rounded-full border border-fuchsia-300/30" />
    </div>
  );
}
