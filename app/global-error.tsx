'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  // Sentry desativado temporariamente durante diagnóstico
  console.error(error);
  return (
    <html>
      <body>
        <h2>Ocorreu um erro inesperado.</h2>
        <p>Por favor, tente novamente.</p>
      </body>
    </html>
  );
}
