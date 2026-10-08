import { notFound } from "next/navigation";
import { ThemeShowcase } from "@/components/dev/ThemeShowcase";
import { isDevShowcaseEnabled } from "@/lib/theme/dev-showcase";

export const metadata = { title: "Vitrine de tema (dev)" };

export default function DevThemePage() {
  if (!isDevShowcaseEnabled()) notFound();
  return <ThemeShowcase />;
}
