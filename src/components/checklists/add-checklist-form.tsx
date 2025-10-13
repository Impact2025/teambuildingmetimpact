"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createChecklistItemAction } from "@/actions/checklists";

type ChecklistType = "PREP" | "SESSION" | "WRAP";

type AddChecklistItemFormProps = {
  workshopId: string;
  type: ChecklistType;
  label: string;
};

export function AddChecklistItemForm({ workshopId, type, label }: AddChecklistItemFormProps) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      setError("Geef een checklistitem op");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      await createChecklistItemAction({
        workshopId,
        type,
        label: value.trim(),
      });
      setValue("");
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? "Kon item niet toevoegen");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Nieuw checklistitem"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white disabled:cursor-not-allowed disabled:bg-neutral-400"
        >
          {isSaving ? "Opslaan" : "Toevoegen"}
        </button>
      </div>
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : null}
    </form>
  );
}
