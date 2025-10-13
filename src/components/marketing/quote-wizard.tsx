"use client";

import { useCallback, useMemo, useState, useTransition } from "react";

import { submitQuoteRequestAction } from "@/actions/quotes";

type LocationOption = "bij-ons" | "externe-locatie" | "nog-te-bepalen";
type GoalOption = "verbinding" | "communicatie" | "plezier" | "impact";
type ActivityOption = "buiten" | "binnen" | "advies";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  participantCount: number;
  datePreference: string;
  locationOption: LocationOption;
  goals: GoalOption[];
  activityType: ActivityOption;
  notes: string;
  privacyAccepted: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  participantCount: 10,
  datePreference: "",
  locationOption: "nog-te-bepalen",
  goals: [],
  activityType: "advies",
  notes: "",
  privacyAccepted: false,
};

const steps = [
  "Intro",
  "Contact",
  "Event",
  "Doel",
  "Afronding",
];

type StepError = {
  message: string;
};

export function QuoteWizard() {
  const [form, setForm] = useState<FormState>(initialState);
  const [step, setStep] = useState(0);
  const [error, setError] = useState<StepError | null>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const progress = useMemo(() => ((step + 1) / (steps.length + 1)) * 100, [step]);

  const goToStep = useCallback((target: number) => {
    setStep(target);
    setError(null);
  }, []);

  const handleCheckboxToggle = useCallback((value: GoalOption) => {
    setForm((prev) => {
      const exists = prev.goals.includes(value);
      return {
        ...prev,
        goals: exists ? prev.goals.filter((item) => item !== value) : [...prev.goals, value],
      };
    });
  }, []);

  const validateStep = useCallback(() => {
    switch (step) {
      case 1:
        if (!form.name.trim()) {
          return { message: "Naam is verplicht" };
        }
        if (!form.email.trim()) {
          return { message: "E-mailadres is verplicht" };
        }
        break;
      case 2:
        if (!form.participantCount || form.participantCount < 1) {
          return { message: "Geef het aantal deelnemers op" };
        }
        break;
      case 3:
        if (form.goals.length === 0) {
          return { message: "Kies minimaal één doel" };
        }
        break;
      case 4:
        if (!form.privacyAccepted) {
          return { message: "Accepteer het privacybeleid om verder te gaan" };
        }
        break;
      default:
        break;
    }
    return null;
  }, [form, step]);

  const handleNext = useCallback(() => {
    const validation = validateStep();
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setStep((prev) => Math.min(prev + 1, steps.length));
  }, [validateStep]);

  const handlePrev = useCallback(() => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSubmit = useCallback(() => {
    const validation = validateStep();
    if (validation) {
      setError(validation);
      return;
    }

    startTransition(async () => {
      const result = await submitQuoteRequestAction({
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || undefined,
        phone: form.phone.trim() || undefined,
        participantCount: form.participantCount,
        datePreference: form.datePreference.trim() || undefined,
        locationOption: form.locationOption,
        goals: form.goals,
        activityType: form.activityType,
        notes: form.notes.trim() || undefined,
        privacyAccepted: form.privacyAccepted,
      });

      if (result.status === "success") {
        setStatus("success");
        setStep(steps.length);
        setForm(initialState);
      } else {
        setStatus("error");
        setError({ message: result.message });
      }
    });
  }, [form, validateStep]);

  if (status === "success" && step === steps.length) {
    return (
      <div className="rounded-3xl border border-accent/40 bg-white p-8 shadow-lg shadow-neutral-200">
        <div className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-deep">
            Bedankt!
          </p>
          <h3 className="text-2xl font-semibold text-neutral-900">Aanvraag ontvangen 🎉</h3>
          <p className="text-sm text-neutral-600">
            We nemen binnen 24 uur contact op om jullie impactvolle teambuilding te plannen. Je ontvangt zo een kopie van de aanvraag in je mailbox.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              goToStep(0);
            }}
            className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:bg-neutral-100"
          >
            Nieuwe aanvraag
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-accent/40 bg-white p-6 shadow-lg shadow-neutral-200">
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          <span>Stap {Math.min(step + 1, steps.length)} van {steps.length}</span>
          <span>{steps[Math.min(step, steps.length - 1)]}</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-neutral-100">
          <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {step === 0 ? (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-neutral-900">Plan jullie impactvolle teambuilding 🌱</h3>
          <p className="text-sm text-neutral-600">Ontvang binnen 24 uur een vrijblijvende offerte. Duurt 1 minuut.</p>
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="mt-4 inline-flex items-center justify-center rounded-xl bg-[#006D77] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-accent-deep"
          >
            Start aanvraag
          </button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-4">
          <div className="grid gap-4">
            <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-name">
              <span>Naam *</span>
              <input
                id="quote-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
                placeholder="Jouw naam"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-email">
              <span>E-mailadres *</span>
              <input
                id="quote-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
                placeholder="naam@bedrijf.nl"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-company">
              <span>Bedrijf (optioneel)</span>
              <input
                id="quote-company"
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
                placeholder="Bedrijfsnaam"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-phone">
              <span>Telefoonnummer (optioneel)</span>
              <input
                id="quote-phone"
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
                placeholder="0612345678"
              />
            </label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-participants">
            <span>Aantal deelnemers: {form.participantCount}</span>
            <input
              id="quote-participants"
              type="range"
              min={5}
              max={150}
              value={form.participantCount}
              onChange={(event) => setForm((prev) => ({ ...prev, participantCount: Number(event.target.value) }))}
              className="w-full"
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-date">
            <span>Gewenste datum of periode</span>
            <input
              id="quote-date"
              value={form.datePreference}
              onChange={(event) => setForm((prev) => ({ ...prev, datePreference: event.target.value }))}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
              placeholder="Bijvoorbeeld: juni 2025 of 12-09-2025"
            />
          </label>
          <div className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Locatie</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ value: "bij-ons", label: "Bij ons" }, { value: "externe-locatie", label: "Externe locatie" }, { value: "nog-te-bepalen", label: "Nog te bepalen" }].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, locationOption: option.value as LocationOption }))}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    form.locationOption === option.value
                      ? "border-[#006D77] bg-[#006D77] text-white"
                      : "border-neutral-200 text-neutral-700 hover:border-[#006D77]/50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6">
          <div className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Wat is het doel van jullie teambuilding?</span>
            <div className="grid gap-3 sm:grid-cols-2">
              {[{ value: "verbinding", label: "Verbinding" }, { value: "communicatie", label: "Communicatie" }, { value: "plezier", label: "Plezier" }, { value: "impact", label: "Maatschappelijke impact" }].map((option) => {
                const selected = form.goals.includes(option.value as GoalOption);
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleCheckboxToggle(option.value as GoalOption)}
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      selected
                        ? "border-[#006D77] bg-accent-soft/80 text-[#006D77]"
                        : "border-neutral-200 text-neutral-700 hover:border-[#006D77]/40"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 text-sm font-medium text-neutral-700">
            <span>Type activiteit</span>
            <div className="grid gap-3 sm:grid-cols-3">
              {[{ value: "buiten", label: "Buiten" }, { value: "binnen", label: "Binnen" }, { value: "advies", label: "Advies gewenst" }].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, activityType: option.value as ActivityOption }))}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                    form.activityType === option.value
                      ? "border-[#006D77] bg-accent-soft/80 text-[#006D77]"
                      : "border-neutral-200 text-neutral-700 hover:border-[#006D77]/40"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-4">
          <label className="block space-y-2 text-sm font-medium text-neutral-700" htmlFor="quote-notes">
            <span>Opmerkingen (optioneel)</span>
            <textarea
              id="quote-notes"
              rows={4}
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              className="w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900 shadow-sm transition focus:border-[#006D77] focus:outline-none focus:ring-2 focus:ring-[#83C5BE]/40"
              placeholder="Zijn er specifieke wensen, thema's of doelgroepen waar we rekening mee mogen houden?"
            />
          </label>
          <label className="flex items-start gap-3 text-sm text-neutral-600">
            <input
              type="checkbox"
              checked={form.privacyAccepted}
              onChange={(event) => setForm((prev) => ({ ...prev, privacyAccepted: event.target.checked }))}
              className="mt-1 h-4 w-4 rounded border-neutral-300 text-[#006D77] focus:border-[#006D77] focus:ring-[#83C5BE]/40"
            />
            <span>
              Ik ga akkoord met het privacybeleid en geef toestemming om contact met mij op te nemen over deze aanvraag.
            </span>
          </label>
        </div>
      ) : null}

      {error ? (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error.message}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={step === 0 || isPending}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400"
        >
          Vorige
        </button>

        {step >= 1 && step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-[#006D77] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Volgende
          </button>
        ) : null}

        {step === 4 ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="inline-flex items-center justify-center rounded-xl bg-[#006D77] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white shadow-sm transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {isPending ? "Versturen..." : "Offerte aanvragen"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
