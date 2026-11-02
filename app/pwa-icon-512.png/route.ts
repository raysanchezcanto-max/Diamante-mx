// Compatibilidad con instalaciones anteriores del manifiesto PWA.
export function GET(request: Request) {
  return Response.redirect(
    new URL("/diamante-mx-512.png", request.url),
    308
  );
}
