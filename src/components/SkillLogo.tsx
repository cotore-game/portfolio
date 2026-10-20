const logos: Record<string, string> = {
  "C#": "csharp.svg",
  C: "c.svg",
  "C++": "cplusplus.svg",
  Python: "python.svg",
  Java: "java.svg",
  JavaScript: "javascript.svg",
  TypeScript: "typescript.svg",
  PHP: "php.svg",
  HTML5: "html5.svg",
  CSS: "css3.svg",
  Unity: "unity.svg",
  "Visual Studio Code": "vscode.svg",
  Ubuntu: "ubuntu.svg",
  Emacs: "emacs.svg",
  React: "react.svg",
  "Next.js": "nextjs.svg",
  "Tailwind CSS": "tailwindcss.svg",
  Rocq: "rocq.svg",
  UPPAAL: "uppaal.ico",
};

export function SkillLogo({ name }: { name: string }) {
  const filename = logos[name];
  if (!filename) return null;
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-white/65 p-2"
      aria-hidden="true"
    >
      <img
        src={`/portfolio/skill-icons/${filename}`}
        alt=""
        width={32}
        height={32}
        loading="lazy"
        decoding="async"
        className="h-8 w-8 object-contain"
      />
    </span>
  );
}
