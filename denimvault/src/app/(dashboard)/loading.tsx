import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground animate-in fade-in duration-300">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
      <p>Cargando información...</p>
    </div>
  );
}
