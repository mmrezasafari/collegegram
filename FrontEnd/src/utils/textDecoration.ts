export const highlightHastags = (text: string) => {
  return text.replace(
    /#[\u0600-\u06FF\w]+/g, // match # + Persian or English word chars
    (match) => `<span class="font-black">${match}</span>`
  )
}

export const parseCaption = (text: string): string => {
  // 1) Replace hashtags with <span>
  const withHashtags = highlightHastags(text)

  // 2) Replace line breaks with <br />
  return withHashtags.replace(/\r?\n/g, "<br />")
}
