import Image from "next/image";

/**
 * Illustrations carried over from the previous axonarbor.in site, recoloured
 * to the brand palette. The SVGs animate themselves (CSS embedded by
 * scripts/animate-legacy-illustrations.py); the wrapper adds a slow float.
 */
const SCENES = {
  "coffee-date": { src: "/illustrations/coffee-date.svg", width: 1553, height: 1190 },
  designing: { src: "/illustrations/designing.svg", width: 1202, height: 1020 },
  presenting: { src: "/illustrations/presenting.svg", width: 1327, height: 966 },
} as const;

export type LegacyScene = keyof typeof SCENES;

type Props = {
  scene: LegacyScene;
  className?: string;
  /** Above-the-fold illustrations load eagerly. */
  eager?: boolean;
};

export function LegacyIllustration({ scene, className = "", eager = false }: Props) {
  const { src, width, height } = SCENES[scene];
  return (
    <div aria-hidden="true" className={`legacy-float ${className}`}>
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        unoptimized
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="h-auto w-full"
      />
    </div>
  );
}

/** The coaching-circle illustration with amber ripples around the coach. */
export function CoachingCircle({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`legacy-float relative ${className}`}>
      <Image
        src="/illustrations/coaching-circle.webp"
        alt=""
        width={1175}
        height={817}
        sizes="(min-width: 1024px) 45vw, 100vw"
        className="h-auto w-full"
      />
      <span className="ripple left-[49.5%] top-[34%] w-[26%]" />
      <span className="ripple left-[49.5%] top-[34%] w-[26%]" />
      <span className="ripple left-[49.5%] top-[34%] w-[26%]" />
      <span className="glow left-[50%] top-[20%] w-[7%]" />
    </div>
  );
}
