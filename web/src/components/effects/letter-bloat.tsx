import { cn } from "@/lib/cn";

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

interface LetterBloatProps {
  text: string;
  as?: Tag;
  className?: string;
}

export function LetterBloat({ text, as: Tag = "span", className }: LetterBloatProps) {
  const words = text.split(/(\s+)/);

  return (
    <Tag className={cn(className)}>
      {words.map((chunk, wordIndex) => {
        if (/^\s+$/.test(chunk)) {
          return <span key={`space-${wordIndex}`}> </span>;
        }

        return (
          <span key={`word-${wordIndex}`} className="whitespace-nowrap">
            {Array.from(chunk).map((character, characterIndex) => (
              <span key={`char-${wordIndex}-${characterIndex}`} className="bloat-letter">
                {character}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
