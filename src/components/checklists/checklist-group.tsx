"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { toggleChecklistItemAction } from "@/actions/checklists";

type ChecklistItem = {
  id: string;
  label: string;
  isChecked: boolean;
};

type ChecklistGroupProps = {
  title: string;
  description: string;
  items: ChecklistItem[];
};

export function ChecklistGroup({ title, description, items }: ChecklistGroupProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = (item: ChecklistItem) => {
    startTransition(async () => {
      await toggleChecklistItemAction(item.id, !item.isChecked);
      router.refresh();
    });
  };

  return (
    <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <p className="text-sm text-neutral-500">{description}</p>
        </div>
        {isPending ? (
          <span className="text-xs text-neutral-400">Opslaan...</span>
        ) : null}
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={item.isChecked}
              onChange={() => handleToggle(item)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-500"
            />
            <span className={`text-sm ${item.isChecked ? "text-neutral-400 line-through" : "text-neutral-700"}`}>
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
