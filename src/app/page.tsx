import { MarketingHeader } from "@/components/marketing/MarketingHeader";
import { Hero } from "@/components/marketing/Hero";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSection } from "@/components/marketing/SolutionSection";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import { CalendarShowcase } from "@/components/marketing/CalendarShowcase";
import { CollaborationSection } from "@/components/marketing/CollaborationSection";
import { ApprovalSection } from "@/components/marketing/ApprovalSection";
import { AnalyticsSection } from "@/components/marketing/AnalyticsSection";
import { CTASection } from "@/components/marketing/CTASection";
import { MarketingFooter } from "@/components/marketing/MarketingFooter";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <WorkflowSection />
        <CalendarShowcase />
        <CollaborationSection />
        <ApprovalSection />
        <AnalyticsSection />
        <CTASection />
      </main>
      <MarketingFooter />
    </div>
  );
}
