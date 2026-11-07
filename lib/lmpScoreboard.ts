import { cache } from "react";

// La API LMP publica un gamePk ("boxScore") por partido. Este mismo
// scoreboard sirve para probable pitchers y canales de transmisión.
// Reutilizar la respuesta solo durante este render evita peticiones
// redundantes y mantiene las dobles carteleras diferenciadas.
export const getLmpScoreboard = cache(async (datePath: string): Promise<Record<string, any>[]> => {
  if (!/^\d{4}\/\d{2}\/\d{2}$/.test(datePath)) return [];

  try {
    const response = await fetch(
      `https://api.lmp.mx/3.0.0/scoreboard/${datePath}`,
      {
        next: { revalidate: 60 },
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8000),
      },
    );
    if (!response.ok) return [];

    const data = await response.json();
    return Array.isArray(data?.response) ? data.response : [];
  } catch {
    return [];
  }
});
