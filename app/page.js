"use client";



export default function HomePage() {
  //const { sendMessage, messages } = useWebSocket();

  return (
    <section className="max-w-5xl" >
      <h2 className="mb-6 text-2xl font-semibold">
        Home
      </h2>

      <div className="rounded-lg border border-white bg-black p-6">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-muted">
            WebSocket Test
          </span>

          <button
          
            className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black hover:opacity-90"
          >
            Send Message
          </button>
        </div>

        <pre className="max-h-64 overflow-auto rounded bg-surface p-4 text-xs text-muted">
          
        </pre>
      </div>
    </section>
  );
}
