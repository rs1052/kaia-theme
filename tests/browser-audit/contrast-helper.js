/**
 * Run in the browser, for example: await page.evaluate(scanVisibleContrastCandidates).
 * Results are candidates for visual review, not an accessibility verdict.
 */
export function scanVisibleContrastCandidates(root = document.body) {
  const parseColor = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/i);
    if (!match) return null;
    const parts = match[1].match(/[\d.]+/g)?.map(Number);
    if (!parts || parts.length < 3) return null;
    return { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 };
  };
  const composite = (foreground, background) => ({
    r: foreground.r * foreground.a + background.r * (1 - foreground.a),
    g: foreground.g * foreground.a + background.g * (1 - foreground.a),
    b: foreground.b * foreground.a + background.b * (1 - foreground.a),
    a: 1,
  });
  const luminance = (color) => {
    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };
    return (
      0.2126 * channel(color.r) +
      0.7152 * channel(color.g) +
      0.0722 * channel(color.b)
    );
  };
  const contrast = (a, b) => {
    const [light, dark] = [luminance(a), luminance(b)].sort(
      (left, right) => right - left,
    );
    return (light + 0.05) / (dark + 0.05);
  };
  const backgroundFor = (element) => {
    const layers = [];
    for (let current = element; current; current = current.parentElement) {
      const color = parseColor(getComputedStyle(current).backgroundColor);
      if (color && color.a > 0) layers.push(color);
    }
    return layers
      .reverse()
      .reduce((background, layer) => composite(layer, background), {
        r: 255,
        g: 255,
        b: 255,
        a: 1,
      });
  };
  const selector = (element) => {
    const parts = [];
    for (
      let current = element;
      current && parts.length < 4;
      current = current.parentElement
    ) {
      const name = current.tagName.toLowerCase();
      parts.unshift(
        current.id
          ? `${name}#${current.id}`
          : `${name}.${[...current.classList].slice(0, 2).join(".")}`,
      );
    }
    return parts.join(" > ");
  };

  return [...root.querySelectorAll("*")]
    .flatMap((element) => {
      const text = [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const foreground = parseColor(style.color);
      if (
        !text ||
        !foreground ||
        style.visibility === "hidden" ||
        style.display === "none" ||
        Number(style.opacity) === 0 ||
        !rect.width ||
        !rect.height ||
        rect.right <= 0 ||
        rect.bottom <= 0 ||
        rect.left >= innerWidth ||
        rect.top >= innerHeight
      )
        return [];
      const background = backgroundFor(element);
      return [
        {
          selector: selector(element),
          text: text.slice(0, 120),
          foreground: style.color,
          background: style.backgroundColor,
          effectiveBackground: `rgb(${Math.round(background.r)}, ${Math.round(background.g)}, ${Math.round(background.b)})`,
          ratio: Number(
            contrast(composite(foreground, background), background).toFixed(2),
          ),
        },
      ];
    })
    .sort((left, right) => left.ratio - right.ratio);
}
