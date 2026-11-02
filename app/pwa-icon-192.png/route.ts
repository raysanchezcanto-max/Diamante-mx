// Compatibilidad con instalaciones anteriores del manifiesto PWA.
export function GET(request: Request) {
  return Response.redirect(
    new URL("/diamante-mx-192.png", request.url),
    308
  );
}
