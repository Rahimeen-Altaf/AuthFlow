import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="animate-[breathe_5s_ease-in-out_infinite]">
        <ShieldCheck className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold">AuthFlow</h1>
    </div>
  );
}
