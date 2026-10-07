"use client";

import * as React from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { ChevronLeft, ChevronRight, Download, ImageDown, FileDown } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
} from "@/components/ui/Dropdown";
import { ContentFilters, EMPTY_FILTERS, applyContentFilters, type ContentFilterState } from "@/components/content/ContentFilters";
import { MonthView } from "@/components/calendar/MonthView";
import { WeekView } from "@/components/calendar/WeekView";
import { DayView } from "@/components/calendar/DayView";
import { CalendarCard } from "@/components/calendar/CalendarCard";
import { CalendarExportSheet } from "@/components/calendar/CalendarExportSheet";
import { exportNodeToPng, exportNodeToPdf, slugifyFileName } from "@/lib/utils/export";
import { useContentStore } from "@/store/content-store";
import { useToast } from "@/components/ui/Toast";
import { getClientById } from "@/data/mock-clients";
import { getCampaignById } from "@/data/mock-campaigns";
import {
  addMonths,
  addDays,
  formatMonthYear,
  formatFullDate,
  formatDayMonth,
  startOfWeek,
  endOfWeek,
} from "@/lib/utils/date";
import type { Content } from "@/types";

type ViewMode = "month" | "week" | "day";
type ExportFormat = "png" | "pdf";

export default function CalendarPage() {
  const contents = useContentStore((s) => s.contents);
  const rescheduleContent = useContentStore((s) => s.rescheduleContent);
  const { toast } = useToast();

  const [filters, setFilters] = React.useState<ContentFilterState>(EMPTY_FILTERS);
  const [view, setView] = React.useState<ViewMode>("month");
  const [anchor, setAnchor] = React.useState(new Date());
  const [activeContent, setActiveContent] = React.useState<Content | null>(null);
  const [pendingExport, setPendingExport] = React.useState<ExportFormat | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const exportRef = React.useRef<HTMLDivElement>(null);
  const exportLockRef = React.useRef(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const filtered = applyContentFilters(
    contents,
    filters,
    (id) => getClientById(id)?.name ?? "",
    (id) => getCampaignById(id)?.name ?? ""
  );

  function goPrev() {
    if (view === "month") setAnchor((d) => addMonths(d, -1));
    else if (view === "week") setAnchor((d) => addDays(d, -7));
    else setAnchor((d) => addDays(d, -1));
  }

  function goNext() {
    if (view === "month") setAnchor((d) => addMonths(d, 1));
    else if (view === "week") setAnchor((d) => addDays(d, 7));
    else setAnchor((d) => addDays(d, 1));
  }

  function goToday() {
    setAnchor(new Date());
  }

  function handleExportSelect(format: ExportFormat) {
    setIsExporting(true);
    setPendingExport(format);
  }

  React.useEffect(() => {
    if (!pendingExport || exportLockRef.current) return;
    const format = pendingExport;
    const node = exportRef.current;
    if (!node) return;
    exportLockRef.current = true;

    void (async () => {
      try {
        const base = slugifyFileName(`calendario-editorial-${formatMonthYear(anchor)}`);
        const filename = `${base}.${format}`;
        if (format === "png") await exportNodeToPng(node, filename);
        else await exportNodeToPdf(node, filename);
        toast({
          title: "Calendário exportado",
          description: `"${filename}" gerado com sucesso.`,
          variant: "success",
        });
      } catch {
        toast({
          title: "Erro ao exportar",
          description: "Não foi possível gerar o arquivo. Tente novamente.",
          variant: "error",
        });
      } finally {
        exportLockRef.current = false;
        setPendingExport(null);
        setIsExporting(false);
      }
    })();
  }, [pendingExport, anchor, toast]);

  function handleDragStart(event: DragStartEvent) {
    setActiveContent((event.active.data.current?.content as Content) ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveContent(null);
    const { active, over } = event;
    if (!over) return;

    const content = active.data.current?.content as Content | undefined;
    if (!content) return;

    const [year, month, day] = String(over.id).split("-").map(Number);
    const current = new Date(content.scheduledAt);
    const updated = new Date(current);
    updated.setFullYear(year, month - 1, day);

    if (updated.getTime() === current.getTime()) return;

    rescheduleContent(content.id, updated.toISOString());
    toast({
      title: "Conteúdo reagendado",
      description: `"${content.title}" movido para ${formatDayMonth(updated)}`,
      variant: "success",
    });
  }

  const periodLabel =
    view === "month"
      ? formatMonthYear(anchor)
      : view === "week"
        ? `${formatDayMonth(startOfWeek(anchor))} – ${formatDayMonth(endOfWeek(anchor))}`
        : formatFullDate(anchor);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Calendar" description="Seu calendário editorial completo." />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ContentFilters value={filters} onChange={setFilters} />
        <Tabs value={view} onValueChange={(v) => setView(v as ViewMode)}>
          <TabsList>
            <TabsTrigger value="month">Mês</TabsTrigger>
            <TabsTrigger value="week">Semana</TabsTrigger>
            <TabsTrigger value="day">Dia</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={goPrev}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goNext}>
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToday}>
            Hoje
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">{periodLabel}</span>
          {view === "month" && (
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="outline" size="sm" loading={isExporting}>
                  {!isExporting && <Download className="size-4" />}
                  Exportar
                </Button>
              </DropdownTrigger>
              <DropdownContent align="end">
                <DropdownItem onSelect={() => handleExportSelect("png")}>
                  <ImageDown className="size-4 text-muted-foreground" />
                  Imagem (PNG)
                </DropdownItem>
                <DropdownItem onSelect={() => handleExportSelect("pdf")}>
                  <FileDown className="size-4 text-muted-foreground" />
                  Documento (PDF)
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          )}
        </div>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        {view === "month" && (
          <MonthView
            month={anchor}
            items={filtered}
            onSelectDay={(date) => {
              setAnchor(date);
              setView("day");
            }}
          />
        )}
        {view === "week" && <WeekView anchor={anchor} items={filtered} />}
        {view === "day" && <DayView date={anchor} items={filtered} />}

        <DragOverlay>{activeContent && <CalendarCard content={activeContent} />}</DragOverlay>
      </DndContext>

      {pendingExport && (
        <div aria-hidden="true" className="pointer-events-none fixed left-[-20000px] top-0">
          <div ref={exportRef}>
            <CalendarExportSheet month={anchor} items={filtered} />
          </div>
        </div>
      )}
    </div>
  );
}
