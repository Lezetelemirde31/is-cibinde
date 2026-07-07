"use client";

// Catches errors thrown in the root layout itself. It replaces the entire
// document, so it must render <html>/<body> and cannot rely on global CSS.
export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="az">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#141c2b",
          textAlign: "center",
          padding: "2rem"
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Nəsə səhv getdi</h1>
          <p style={{ marginTop: "0.5rem", color: "#5b6b82" }}>
            Gözlənilməz xəta baş verdi. Səhifəni yenilə.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              height: "44px",
              padding: "0 1.5rem",
              borderRadius: "10px",
              border: "none",
              background: "#1d4ed8",
              color: "#fff",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            Yenidən cəhd et
          </button>
        </div>
      </body>
    </html>
  );
}
