export function extract(
  text: string,
  type: "mention" | "hashtag"
): string[] {
  let regex: RegExp;

  if (type === "mention") {
    regex = /@(\w+)/g; 
  } else {
    regex = /#(\w+)/g; 
  }

  const matches = text.match(regex);
  if (!matches) return [];

  return [...new Set(matches.map(m => m.slice(1)))];
}
