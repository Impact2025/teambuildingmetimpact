"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import clsx from "clsx";

import {
  deleteSessionAction,
  reorderSessionsAction,
  updateSessionFormAction,
} from "@/actions/workshops";
import { workshopActionDefaultState } from "@/state/workshop-actions";

type SessionListItem = {
  id: string;
  title: string;
  assignmentMarkdown: string;
  buildDurationSec: number;
  discussDurationSec: number;
  themeColor: string | null;
  facilitatorNotes: string | null;
  order: number;
};

type SessionListProps = {
  workshopId: string;
  sessions: SessionListItem[];
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m${secs ? ` ${secs}s` : ""}`;
}

function EditSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? "Opslaan..." : "Wijzigingen opslaan"}
    </button>
  );
}

function SessionEditForm({
  session,
  onClose,
}: {
  session: SessionListItem;
  onClose: () => void;
}) {
  const [state, formAction] = useFormState(
    updateSessionFormAction,
    workshopActionDefaultState
  );

  useEffect(() => {
    if (state.status === "success") {
      onClose();
    }
  }, [state, onClose]);

  const buildMinutes = Math.floor(session.buildDurationSec / 60);
  const buildSeconds = session.buildDurationSec % 60;
  const discussMinutes = Math.floor(session.discussDurationSec / 60);
  const discussSeconds = session.discussDurationSec % 60;

  return (
    <form
      action={formAction}
      className="mt-4 space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4"
    >
      <input type="hidden" name="sessionId" value={session.id} />
      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1 text-xs font-medium text-neutral-600" htmlFor={`title-${session.id}`}>
          <span>Titel</span>
          <input
            id={`title-${session.id}`}
            name="title"
            defaultValue={session.title}
            className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
          />
        </label>
        <label className="space-y-1 text-xs font-medium text-neutral-600" htmlFor={`themeColor-${session.id}`}>
          <span>Themakleur</span>
          <input
            id={`themeColor-${session.id}`}
            name="themeColor"
            type="color"
            defaultValue={session.themeColor ?? "#bcccdc"}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-white"
          />
        </label>
      </div>
      <label className="block space-y-1 text-xs font-medium text-neutral-600" htmlFor={`assignment-${session.id}`}>
        <span>Opdracht (Markdown)</span>
        <textarea
          id={`assignment-${session.id}`}
          name="assignmentMarkdown"
          defaultValue={session.assignmentMarkdown}
          rows={4}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1 text-xs font-medium text-neutral-600" htmlFor={`notes-${session.id}`}>
        <span>Facilitator-notities</span>
        <textarea
          id={`notes-${session.id}`}
          name="facilitatorNotes"
          defaultValue={session.facilitatorNotes ?? ""}
          rows={3}
          className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
        />
      </label>
      <div className="grid gap-3 md:grid-cols-2">
        <fieldset className="rounded-xl border border-neutral-200 bg-white p-3">
          <legend className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Bouwfase
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="space-y-1 text-[0.7rem] font-medium text-neutral-600">
              <span>Minuten</span>
              <input
                name="buildMinutes"
                type="number"
                min={0}
                defaultValue={buildMinutes}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-[0.7rem] font-medium text-neutral-600">
              <span>Seconden</span>
              <input
                name="buildSeconds"
                type="number"
                min={0}
                max={59}
                defaultValue={buildSeconds}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </fieldset>
        <fieldset className="rounded-xl border border-neutral-200 bg-white p-3">
          <legend className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-neutral-400">
            Bespreekfase
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="space-y-1 text-[0.7rem] font-medium text-neutral-600">
              <span>Minuten</span>
              <input
                name="discussMinutes"
                type="number"
                min={0}
                defaultValue={discussMinutes}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
              />
            </label>
            <label className="space-y-1 text-[0.7rem] font-medium text-neutral-600">
              <span>Seconden</span>
              <input
                name="discussSeconds"
                type="number"
                min={0}
                max={59}
                defaultValue={discussSeconds}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm"
              />
            </label>
          </div>
        </fieldset>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[0.65rem] text-neutral-400">
          Aanpassingen worden direct zichtbaar in de presentatie.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600"
          >
            Annuleer
          </button>
          <EditSubmitButton />
        </div>
      </div>
      {state.status === "error" ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function SortableSessionCard({ session }: { session: SessionListItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: session.id });
  const [isEditing, setIsEditing] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={clsx(
        "cursor-grab rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition",
        isDragging ? "opacity-80 shadow-lg" : "hover:border-neutral-400 hover:shadow-md"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400"
            >
              Verschuif
            </button>
            <span
              className="inline-flex h-2 w-2 rounded-full"
              style={{ backgroundColor: session.themeColor ?? "#CBD5F5" }}
            />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">{session.title}</h3>
          <p className="whitespace-pre-line text-sm text-neutral-500">
            {session.assignmentMarkdown}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-3 text-xs text-neutral-500">
          <span>Bouwen: {formatDuration(session.buildDurationSec)}</span>
          <span>Bespreken: {formatDuration(session.discussDurationSec)}</span>
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:border-neutral-400 hover:text-neutral-800"
          >
            {isEditing ? "Sluit" : "Bewerk"}
          </button>
        </div>
      </div>
      {session.facilitatorNotes ? (
        <p className="mt-4 rounded-2xl bg-neutral-50 px-4 py-3 text-sm text-neutral-500">
          {session.facilitatorNotes}
        </p>
      ) : null}
      {isEditing ? (
        <SessionEditForm
          session={session}
          onClose={() => setIsEditing(false)}
        />
      ) : null}
    </article>
  );
}

export function SessionList({ workshopId, sessions }: SessionListProps) {
  const sorted = useMemo(
    () => [...sessions].sort((a, b) => a.order - b.order),
    [sessions]
  );
  const [items, setItems] = useState(() => sorted);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setItems(sorted);
  }, [sorted]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

      setItems((prev) => {
        const oldIndex = prev.findIndex((item) => item.id === active.id);
        const newIndex = prev.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(prev, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index,
        }));

        startTransition(() =>
          reorderSessionsAction(
            workshopId,
            reordered.map((item) => item.id)
          )
        );

        return reordered;
      });
  };

  const handleDelete = (id: string) => {
    startTransition(() => deleteSessionAction(id));
    setItems((prev) =>
      prev
        .filter((item) => item.id !== id)
        .map((item, index) => ({
          ...item,
          order: index,
        }))
    );
  };

  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">Dagprogramma</h2>
          <p className="text-sm text-neutral-500">
            Sleep om de volgorde te wijzigen. Wijzigingen worden automatisch opgeslagen.
          </p>
        </div>
        {isPending ? (
          <span className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-500">
            Opslaan...
          </span>
        ) : null}
      </header>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-10 text-center text-sm text-neutral-500">
          <p>Er zijn nog geen sessies ingepland voor deze dag.</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((session) => session.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {items.map((session) => (
                <div key={session.id} className="relative">
                  <SortableSessionCard session={session} />
                  <button
                    type="button"
                    onClick={() => handleDelete(session.id)}
                    className="absolute right-6 top-6 rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs font-semibold text-neutral-500 transition hover:border-red-300 hover:text-red-600"
                  >
                    Verwijder
                  </button>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
