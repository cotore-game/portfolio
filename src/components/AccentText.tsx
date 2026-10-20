export function AccentText({ children }: { children: string }) {
  return children.split(/(。)/).map((part, index) =>
    part === "。" ? (
      <span className="text-[#61754a]" key={index}>
        {part}
      </span>
    ) : (
      part
    ),
  );
}
