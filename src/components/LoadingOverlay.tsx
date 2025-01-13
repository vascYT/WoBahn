export default function LoadingOverlay() {
  return (
    <div className="absolute top-0 left-0 w-screen h-screen bg-black/90 flex items-center justify-center z-[500]">
      <div className="text-white text-center p-5">
        <h1 className="font-bold text-xl">Waiting for data...</h1>
        <p className="text-sm">
          This may take up to 15 seconds to avoid overloading the Wiener Linien
          API.
        </p>
      </div>
    </div>
  );
}
