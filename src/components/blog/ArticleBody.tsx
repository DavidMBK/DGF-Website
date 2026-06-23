import type { Block } from "@/lib/blog";

/** Renderizza i blocchi tipizzati di un articolo in tipografia leggibile. */
export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={i}
                className="pt-4 font-display text-[clamp(1.4rem,3vw,1.9rem)] font-semibold tracking-[-0.02em] text-ink"
              >
                {block.text}
              </h2>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-3 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[17px] leading-[1.7] text-ink-soft">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-blue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-2 border-brand-blue/40 py-1 pl-6 font-display text-[clamp(1.2rem,2.4vw,1.6rem)] font-medium leading-[1.45] tracking-[-0.01em] text-ink"
              >
                {block.text}
              </blockquote>
            );
          default:
            return (
              <p key={i} className="text-[17px] leading-[1.8] text-ink-soft">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
