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
          ? "my-9 overflow-hidden rounded-lg bg-stone-200/50"
          : "mb-6 aspect-[16/10] overflow-hidden rounded-md bg-stone-200/50"
      }
    >
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        decoding="async"
        className={
          hero
            ? "mx-auto max-h-[620px] w-full object-contain"
            : "h-full w-full object-contain"
        }
      />
    </div>
  );
}
