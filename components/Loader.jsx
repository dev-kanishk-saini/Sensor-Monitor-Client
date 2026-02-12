"use client";

export default function Loader({ size = 40 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #111827",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
  );
}
