import Image from "next/image";
import type { Person } from "@/content/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part.replace(/[^A-Za-z]/g, "")[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

export function PersonCard({ person, headingLevel = "h3" }: { person: Person; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  return (
    <article className="flex h-full flex-col">
      <div className="img-reveal relative aspect-[4/5] overflow-hidden bg-grey-100">
        {person.image ? (
          <Image
            src={person.image.src}
            alt={person.image.alt}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover grayscale transition-[filter,transform] duration-700 hover:scale-[1.02] hover:grayscale-0"
          />
        ) : (
          <div aria-hidden="true" className="flex h-full items-center justify-center">
            <span className="font-serif text-7xl text-grey-400">{initials(person.name)}</span>
          </div>
        )}
      </div>
      <Heading className="mt-6 font-serif text-2xl tracking-tight">{person.name}</Heading>
      {person.role && <p className="eyebrow mt-2 text-grey-600">{person.role}</p>}
      <p className="mt-4 text-[0.95rem] leading-relaxed text-grey-600">{person.bio}</p>
    </article>
  );
}
