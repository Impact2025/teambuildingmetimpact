"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { TeamdayReviewWithSession } from "@/lib/teamday-reviews";
import type { TeamdayProgram } from "@/lib/teamday-program";
import { MAX_TEAMDAY_REVIEW_COMMENT_LENGTH } from "@/lib/teamday-review-constants";

const dateFormatter = new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short" });

const statusLabels = {
  PENDING: "In behandeling",
  APPROVED: "Goedgekeurd",
  REJECTED: "Afgewezen",
};

const statusColors = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

type TeamdayReviewListProps = {
  reviews: TeamdayReviewWithSession[];
  program: TeamdayProgram;
};

export function TeamdayReviewList({ reviews: initialReviews, program }: TeamdayReviewListProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);
  const [loading, setLoading] = useState<string | null>(null);

  const updateReviewStatus = async (reviewId: string, status: "APPROVED" | "REJECTED") => {
    setLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/teamday/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Update mislukt");
      }

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId ? { ...review, status } : review
        )
      );
      router.refresh();
    } catch (error) {
      alert("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(null);
    }
  };

  const editReview = async (
    reviewId: string,
    data: { reviewerName: string; rating: number; comment: string; sessionKey: string; reviewedAt: Date }
  ) => {
    setLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/teamday/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          reviewedAt: data.reviewedAt.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Update mislukt");
      }

      const { review: updatedReview } = await response.json();

      // Find the session title for the updated sessionKey
      const session = program.sessions.find((s) => s.id === updatedReview.sessionKey);

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                reviewerName: updatedReview.reviewerName,
                rating: updatedReview.rating,
                comment: updatedReview.comment,
                sessionKey: updatedReview.sessionKey,
                sessionTitle: session?.title ?? "Onbekend onderdeel",
                sessionSubtitle: session?.subtitle ?? null,
                reviewedAt: new Date(updatedReview.reviewedAt),
              }
            : review
        )
      );
      router.refresh();
    } catch (error) {
      alert("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(null);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Weet je zeker dat je deze review wilt verwijderen?")) {
      return;
    }

    setLoading(reviewId);
    try {
      const response = await fetch(`/api/admin/teamday/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Verwijderen mislukt");
      }

      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      router.refresh();
    } catch (error) {
      alert("Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(null);
    }
  };

  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 p-10 text-center text-sm text-neutral-500">
        Nog geen reviews ontvangen.
      </div>
    );
  }

  const groupedByStatus = {
    PENDING: reviews.filter((r) => r.status === "PENDING"),
    APPROVED: reviews.filter((r) => r.status === "APPROVED"),
    REJECTED: reviews.filter((r) => r.status === "REJECTED"),
  };

  return (
    <div className="space-y-8">
      {/* Pending reviews */}
      {groupedByStatus.PENDING.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            In behandeling ({groupedByStatus.PENDING.length})
          </h2>
          <div className="space-y-4">
            {groupedByStatus.PENDING.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                loading={loading === review.id}
                onApprove={() => updateReviewStatus(review.id, "APPROVED")}
                onReject={() => updateReviewStatus(review.id, "REJECTED")}
                onDelete={() => deleteReview(review.id)}
                onEdit={(data) => editReview(review.id, data)}
                program={program}
              />
            ))}
          </div>
        </section>
      )}

      {/* Approved reviews */}
      {groupedByStatus.APPROVED.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Goedgekeurd ({groupedByStatus.APPROVED.length})
          </h2>
          <div className="space-y-4">
            {groupedByStatus.APPROVED.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                loading={loading === review.id}
                onReject={() => updateReviewStatus(review.id, "REJECTED")}
                onDelete={() => deleteReview(review.id)}
                onEdit={(data) => editReview(review.id, data)}
                program={program}
              />
            ))}
          </div>
        </section>
      )}

      {/* Rejected reviews */}
      {groupedByStatus.REJECTED.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-neutral-900">
            Afgewezen ({groupedByStatus.REJECTED.length})
          </h2>
          <div className="space-y-4">
            {groupedByStatus.REJECTED.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                loading={loading === review.id}
                onApprove={() => updateReviewStatus(review.id, "APPROVED")}
                onDelete={() => deleteReview(review.id)}
                onEdit={(data) => editReview(review.id, data)}
                program={program}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

type ReviewCardProps = {
  review: TeamdayReviewWithSession;
  loading: boolean;
  onApprove?: () => void;
  onReject?: () => void;
  onDelete: () => void;
  onEdit: (data: { reviewerName: string; rating: number; comment: string; sessionKey: string; reviewedAt: Date }) => void;
  program: TeamdayProgram;
};

function ReviewCard({ review, loading, onApprove, onReject, onDelete, onEdit, program }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(review.reviewerName);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment ?? "");
  const [editSessionKey, setEditSessionKey] = useState(review.sessionKey);
  const [editReviewedAt, setEditReviewedAt] = useState(
    review.reviewedAt instanceof Date
      ? review.reviewedAt.toISOString().split("T")[0]
      : new Date(review.reviewedAt).toISOString().split("T")[0]
  );

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    onEdit({
      reviewerName: editName,
      rating: editRating,
      comment: editComment,
      sessionKey: editSessionKey,
      reviewedAt: new Date(editReviewedAt),
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(review.reviewerName);
    setEditRating(review.rating);
    setEditComment(review.comment ?? "");
    setEditSessionKey(review.sessionKey);
    setEditReviewedAt(
      review.reviewedAt instanceof Date
        ? review.reviewedAt.toISOString().split("T")[0]
        : new Date(review.reviewedAt).toISOString().split("T")[0]
    );
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <article className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-neutral-900">Review bewerken</h3>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-sm text-neutral-500 hover:text-neutral-700"
            >
              Annuleren
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-neutral-700">
              Naam
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </label>

            <label className="block text-sm font-medium text-neutral-700">
              Datum
              <input
                type="date"
                value={editReviewedAt}
                onChange={(e) => setEditReviewedAt(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              />
            </label>
          </div>

          <label className="block text-sm font-medium text-neutral-700">
            Onderdeel
            <select
              value={editSessionKey}
              onChange={(e) => setEditSessionKey(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            >
              {program.sessions.map((session) => (
                <option key={session.id} value={session.id}>
                  {session.title} {session.subtitle ? `- ${session.subtitle}` : ""}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium text-neutral-700">Rating</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = value <= editRating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setEditRating(value)}
                    className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition ${
                      isActive
                        ? "border-amber-500 bg-amber-100 text-amber-600"
                        : "border-neutral-200 bg-neutral-50 text-neutral-400 hover:border-neutral-300 hover:text-neutral-600"
                    }`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block text-sm font-medium text-neutral-700">
            Toelichting
            <textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              rows={3}
              maxLength={MAX_TEAMDAY_REVIEW_COMMENT_LENGTH}
              className="mt-2 w-full rounded-2xl border border-neutral-200 px-4 py-3 text-sm text-neutral-900 focus:border-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-200"
            />
            <span className="mt-1 block text-xs text-neutral-400">
              {editComment.length}/{MAX_TEAMDAY_REVIEW_COMMENT_LENGTH} tekens
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#006D77] px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loading ? "Opslaan..." : "Opslaan"}
          </button>
        </form>
      </article>
    );
  }
  return (
    <article className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[review.status]}`}>
              {statusLabels[review.status]}
            </span>
            <span className="text-xs text-neutral-400">•</span>
            <span className="text-xs text-neutral-500">{dateFormatter.format(review.reviewedAt)}</span>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900">{review.reviewerName}</h3>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span className="font-medium">{review.sessionTitle}</span>
            {review.sessionSubtitle && (
              <>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-500">{review.sessionSubtitle}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={star <= review.rating ? "text-amber-400" : "text-neutral-300"}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-neutral-600">({review.rating}/5)</span>
          </div>
        </div>
      </div>

      {review.comment && (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm text-neutral-700 whitespace-pre-wrap">{review.comment}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setIsEditing(true)}
          disabled={loading}
          className="rounded-xl border border-[#006D77] bg-white px-4 py-2 text-sm font-medium text-[#006D77] transition hover:bg-neutral-50 disabled:opacity-50"
        >
          Bewerken
        </button>
        {onApprove && (
          <button
            onClick={onApprove}
            disabled={loading}
            className="rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Bezig..." : "Goedkeuren"}
          </button>
        )}
        {onReject && (
          <button
            onClick={onReject}
            disabled={loading}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Bezig..." : "Afwijzen"}
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={loading}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Bezig..." : "Verwijderen"}
        </button>
      </div>
    </article>
  );
}
