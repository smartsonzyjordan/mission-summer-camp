"use client";

import type { Certificate } from "@/types";

const placement: Record<string, { top: string; yRatio: number; fontSize: string; canvasFontSize: number }> = {
  discipline: { top: "54.2%", yRatio: 0.542, fontSize: "clamp(1.1rem, 6vw, 4.3rem)", canvasFontSize: 82 },
  confidence: { top: "55.8%", yRatio: 0.558, fontSize: "clamp(1.1rem, 6vw, 4.3rem)", canvasFontSize: 82 },
  brain: { top: "55.1%", yRatio: 0.551, fontSize: "clamp(1.1rem, 6vw, 4.3rem)", canvasFontSize: 82 },
  "galaxy-hero-cert": { top: "57.8%", yRatio: 0.578, fontSize: "clamp(1rem, 5.4vw, 4rem)", canvasFontSize: 74 },
  "space-legend-cert": { top: "57.2%", yRatio: 0.572, fontSize: "clamp(1rem, 5.4vw, 4rem)", canvasFontSize: 74 }
};

function xmlEscape(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] ?? char);
}

function getPlacement(cert: Certificate) {
  return placement[cert.id] ?? placement.discipline;
}

export function createCertificateSvg(cert: Certificate, childName: string) {
  const name = xmlEscape(childName || "Cadet");
  const nameY = {
    discipline: 447,
    confidence: 462,
    brain: 452,
    "galaxy-hero-cert": 472,
    "space-legend-cert": 469
  }[cert.id] ?? 452;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1536 1076">
  <image href="${cert.image}" x="0" y="0" width="1536" height="1076" preserveAspectRatio="xMidYMid slice"/>
  <text x="768" y="${nameY}" text-anchor="middle" dominant-baseline="middle"
    font-family="Brush Script MT, Segoe Script, cursive"
    font-size="86"
    font-weight="700"
    fill="#0b2a67"
    stroke="#fff4d6"
    stroke-width="2"
    paint-order="stroke">${name}</text>
</svg>`;
}

export function certificateDataUrl(cert: Certificate, childName: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(createCertificateSvg(cert, childName))}`;
}

export async function downloadCertificatePng(cert: Certificate, childName: string) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = cert.image;
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Certificate image could not be loaded."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || 1536;
  canvas.height = image.naturalHeight || 1076;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const spot = getPlacement(cert);
  const name = childName || "Cadet";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round((canvas.width / 1536) * spot.canvasFontSize)}px "Brush Script MT", "Segoe Script", cursive`;
  ctx.lineWidth = Math.max(2, Math.round(canvas.width / 768));
  ctx.strokeStyle = "#fff4d6";
  ctx.fillStyle = "#0b2a67";
  ctx.shadowColor = "rgba(255,244,214,.85)";
  ctx.shadowBlur = Math.round(canvas.width / 192);
  ctx.strokeText(name, canvas.width / 2, canvas.height * spot.yRatio);
  ctx.fillText(name, canvas.width / 2, canvas.height * spot.yRatio);
  ctx.restore();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png", 0.96));
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = cert.downloadName.replace(/\.(jpe?g|svg)$/i, ".png");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function CertificateArtwork({ cert, childName, locked = false }: { cert: Certificate; childName: string; locked?: boolean }) {
  const spot = getPlacement(cert);

  return (
    <div className="relative aspect-[16/11.2] overflow-hidden bg-slate-950">
      <img src={cert.image} alt={`${cert.name} preview`} className={`h-full w-full object-cover ${locked ? "blur-[1px] grayscale" : ""}`} />
      <div
        className={`pointer-events-none absolute left-1/2 z-10 w-[62%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-black leading-none text-[#0b2a67] ${locked ? "opacity-55" : ""}`}
        style={{
          top: spot.top,
          fontFamily: '"Brush Script MT", "Segoe Script", cursive',
          fontSize: spot.fontSize,
          textShadow: "0 1px 0 #fff4d6, 0 2px 8px rgba(255,244,214,.85)"
        }}
      >
        {childName || "Cadet"}
      </div>
      {locked ? (
        <div className="absolute inset-0 z-20 grid place-items-center bg-slate-950/58">
          <div className="rounded-2xl border border-white/15 bg-black/45 px-4 py-3 text-center">
            <i className="ti ti-lock text-3xl text-amber-300" />
            <div className="mt-1 text-sm font-black uppercase">{cert.starsRequired} stars required</div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
