import "server-only";

const translationCache =
  new Map<string, string>();

function normalizeBaseballSpanish(
  text: string
) {
  return text
    .replace(
      /\bshortstop\b/gi,
      "campocorto"
    )
    .replace(
      /\bhome run\b/gi,
      "jonrón"
    )
    .replace(
      /\bwild pitch\b/gi,
      "lanzamiento descontrolado"
    )
    .replace(
      /\bwalks\b/gi,
      "recibe base por bolas"
    );
}

export async function translateBaseballText(
  text: string
): Promise<string> {
  const cleanText = text.trim();

  if (!cleanText) {
    return "";
  }

  const cached =
    translationCache.get(cleanText);

  if (cached) {
    return cached;
  }

  const authKey =
    process.env.DEEPL_AUTH_KEY;

  if (!authKey) {
    return cleanText;
  }

  const endpoint =
    authKey.endsWith(":fx")
      ? "https://api-free.deepl.com/v2/translate"
      : "https://api.deepl.com/v2/translate";

  try {
    const response = await fetch(
      endpoint,
      {
        method: "POST",

        headers: {
          Authorization:
            `DeepL-Auth-Key ${authKey}`,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          text: [cleanText],
          source_lang: "EN",
          target_lang: "ES",

          context:
            "Texto de narración jugada por jugada de béisbol MLB. " +
            "Usa terminología de béisbol latinoamericana. " +
            "Ejemplos: home run = jonrón, shortstop = campocorto, " +
            "walk = base por bolas, strikeout = ponche, " +
            "first baseman = primera base, " +
            "second baseman = segunda base, " +
            "third baseman = tercera base, " +
            "right fielder = jardinero derecho, " +
            "center fielder = jardinero central, " +
            "left fielder = jardinero izquierdo.",
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "DeepL translation error:",
        response.status
      );

      return cleanText;
    }

    const data = await response.json();

    const translated =
      data?.translations?.[0]?.text;

    if (
      typeof translated !== "string" ||
      !translated.trim()
    ) {
      return cleanText;
    }

    const result =
      normalizeBaseballSpanish(
        translated.trim()
      );

    translationCache.set(
      cleanText,
      result
    );

    return result;
  } catch (error) {
    console.error(
      "DeepL translation failed:",
      error
    );

    return cleanText;
  }
}
