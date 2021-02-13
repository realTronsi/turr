export function fitText(ctx, text, maxWidth) {
  const text_width = ctx.measureText(text).width;
  if (text_width > maxWidth) {
    for (let i = text.length - 1; i > 0; i--) {
      text = text.slice(0, -1);
      if (ctx.measureText(text).width < maxWidth) {
        return text + "...";
      }
    }
    return text;
  }
  return text;
}