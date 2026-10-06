import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-xs font-mono text-accent mb-6">
        <span>404 // TRACK DRIFT</span>
      </div>
      <h1 className="font-heading font-black text-6xl sm:text-8xl tracking-tighter text-white mb-4">
        OFF COURSE
      </h1>
      <p className="max-w-md text-neutral-400 text-sm sm:text-base font-sans mb-8">
        The telemetry vector you requested does not exist on this circuit. Realign to base coordinates.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full bg-accent text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-accent-hover transition-colors shadow-glow"
      >
        Return to Grid
      </Link>
    </div>
  );
}
