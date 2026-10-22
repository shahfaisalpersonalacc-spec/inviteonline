"use client";

import { useState } from "react";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SectionForm from "./SectionForms";
import { SECTION_META, SECTION_TYPES, newId } from "@/data/sections";

function SortableSection({ s, isOpen, onToggleOpen, onUpdate, onRemove }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: s.id });
  const meta = SECTION_META[s.type] || { label: s.type };
  const Icon = meta.Icon;

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 20 : undefined, position: "relative" }}
      className={`rounded-2xl border bg-white transition-shadow ${
        isDragging ? "border-ink/30 shadow-[0_20px_40px_-16px_rgba(28,26,61,.45)]" : isOpen ? "border-ink/25 shadow-[0_14px_30px_-20px_rgba(28,26,61,.5)]" : "border-ink/[0.08]"
      }`}
    >
      <div className="flex items-center gap-1.5 p-2.5 pl-1.5">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          className={`grid h-8 w-7 shrink-0 touch-none place-items-center rounded-lg text-ink/35 hover:bg-ink/5 hover:text-ink ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
          aria-label={`Drag to reorder ${meta.label}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button type="button" className="flex min-w-0 flex-1 items-center gap-2.5 text-left" onClick={onToggleOpen}>
          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${s.enabled ? "bg-gold/20 text-gold-600" : "bg-ink/5 text-ink/30"}`}>
            {Icon && <Icon className="h-4 w-4" strokeWidth={1.8} />}
          </span>
          <span className={`truncate text-sm font-semibold ${s.enabled ? "text-ink" : "text-ink/35 line-through"}`}>{meta.label}</span>
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={s.enabled}
          aria-label={s.enabled ? "Hide section" : "Show section"}
          onClick={() => onUpdate({ enabled: !s.enabled })}
          className={`relative h-5 w-9 shrink-0 rounded-full transition ${s.enabled ? "bg-ink" : "bg-zinc-300"}`}
        >
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${s.enabled ? "left-[18px]" : "left-0.5"}`} />
        </button>
      </div>
      {isOpen && !isDragging && (
        <div className="border-t border-ink/[0.06] p-4">
          <SectionForm section={s} onChange={(data) => onUpdate({ data })} />
          {s.type !== "hero" && (
            <button type="button" onClick={onRemove} className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline">
              <Trash2 className="h-3.5 w-3.5" /> Remove section
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SectionsPanel({ sections, onChange, onFocusSection }) {
  const [open, setOpen] = useState(sections[0]?.id || null);
  const [adding, setAdding] = useState(false);

  // Small movement threshold so taps on the handle don't start a drag; keyboard: Space + arrows.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const update = (id, patch) => onChange(sections.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id) => {
    if (!confirm("Remove this section? Stickers placed on it will move to the first section.")) return;
    onChange(sections.filter((s) => s.id !== id));
  };
  const add = (type) => {
    const s = { id: newId(), type, enabled: true, data: SECTION_META[type].data() };
    onChange([...sections, s]);
    setOpen(s.id);
    setAdding(false);
    setTimeout(() => onFocusSection?.(s.id), 50);
  };

  function onDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((s) => s.id === active.id);
    const to = sections.findIndex((s) => s.id === over.id);
    onChange(arrayMove(sections, from, to));
    setTimeout(() => onFocusSection?.(active.id), 50);
  }

  return (
    <div className="space-y-2.5">
      <p className="text-xs text-ink-500">Tap a section to edit it. Drag the handle to reorder, and use the switch to hide it.</p>

      <DndContext id="sections-dnd" sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {sections.map((s) => (
              <SortableSection
                key={s.id}
                s={s}
                isOpen={open === s.id}
                onToggleOpen={() => {
                  const opening = open !== s.id;
                  setOpen(opening ? s.id : null);
                  if (opening) onFocusSection?.(s.id);
                }}
                onUpdate={(patch) => update(s.id, patch)}
                onRemove={() => remove(s.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {adding ? (
        <div className="rounded-2xl border border-ink/15 bg-cream p-3">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-bold text-ink">Add a section</p>
            <button className="rounded-full p-1 text-ink-500 hover:bg-white" onClick={() => setAdding(false)} aria-label="Cancel">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {SECTION_TYPES.filter((t) => t !== "hero").map((t) => {
              const { Icon, label } = SECTION_META[t];
              return (
                <button key={t} type="button" onClick={() => add(t)} className="flex items-center gap-2 rounded-xl bg-white p-2.5 text-left text-xs font-semibold text-ink shadow-sm hover:ring-2 hover:ring-gold/50">
                  <Icon className="h-4 w-4 shrink-0 text-gold-600" strokeWidth={1.8} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/15 py-3 text-sm font-semibold text-ink-500 hover:border-ink/35 hover:text-ink">
          <Plus className="h-4 w-4" /> Add section
        </button>
      )}
    </div>
  );
}
