import Image from "next/image";
import { cn } from "@/lib/utils/cn";

export interface LogoProps {
  className?: string;
  size?: number;
  priority?: boolean;
}

export function Logo({ className, size = 28, priority }: LogoProps) {
  return (
    <Image
      src="/midialogo.png"
      alt="Content OS"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0 object-contain", className)}
    />
  );
}
