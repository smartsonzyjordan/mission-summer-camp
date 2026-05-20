type VisualAssetProps = {
  src: string;
  alt: string;
  className?: string;
};

export function VisualAsset({ src, alt, className = "" }: VisualAssetProps) {
  return <img src={src} alt={alt} className={`select-none object-contain ${className}`} draggable={false} />;
}
