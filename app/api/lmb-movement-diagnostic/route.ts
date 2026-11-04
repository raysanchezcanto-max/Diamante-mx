// TEMPORAL: pruebas de la fuente pública; eliminar antes de aprobación final.
import { getAlgodonerosMovements, movementAudit } from "@/lib/lmbMovements";
export const dynamic = "force-dynamic";
export async function GET() {
  const data = await getAlgodonerosMovements();
  return Response.json({
    source: data.sourceStatus,
    verifiedAt: data.verifiedAt,
    recentDetected: data.recentDetected,
    movements: data.movements.map(x => ({
      date: x.date, title: x.title, type: x.type,
      description: x.description.slice(0, 220), url: x.url,
      automatic: x.automatic,
    })),
    validDate: movementAudit.movementDate("/noticias/lmb-movimientos-en-listas-de-reserva-4-de-noviembre-de-2026"),
  });
}
