import type { Media } from "@/lib/content-schema";

export function WorkImage({
  media,
  hero = false,
}: {
  media: Media;
  hero?: boolean;
}) {
  return (
    <div
      className={
        hero
          ? "mb-9 aspect-[16/10] overflow-hidden rounded-lg bg-stone-200/50"
          : "mb-6 aspect-[16/10] overflow-hidden rounded-md bg-stone-200/50"
      }
    >
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </div>
  );
}
