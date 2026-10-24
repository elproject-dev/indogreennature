export function LoadingSpinner({ text = "Loading" }: { text?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center min-h-[60vh] h-full w-full">
      <div className="relative flex items-center justify-center mb-6">
        <div
          style={{
            borderColor: "rgba(21, 128, 61, 0.2)",
            borderTopColor: "#15803d",
            borderBottomColor: "#15803d",
          }}
          className="loading-spinner-fixed-outer"
        />
        <div
          style={{
            borderColor: "rgba(21, 128, 61, 0.25)",
            borderLeftColor: "#15803d",
            borderRightColor: "#15803d",
          }}
          className="loading-spinner-fixed-inner"
        />
        <div
          style={{
            backgroundColor: "#15803d",
            boxShadow: "0 0 20px rgba(21, 128, 61, 0.7)",
          }}
          className="loading-spinner-fixed-dot"
        />
      </div>
      <p
        style={{
          color: "#15803d",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
        className="loading-spinner-fixed-text"
      >
        {text}
      </p>
    </div>
  );
}
