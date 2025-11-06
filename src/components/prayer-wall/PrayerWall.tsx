import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useState,
  } from "react";
  import {
    CheckCircle2,
    ChevronRight,
    Clock3,
    HandHeart,
    Heart,
    Loader2,
    MessageCircle,
    Sparkles,
    Users,
  } from "lucide-react";
  
  import { useAuth } from "../../contexts/AuthContext";
  import { useNotification } from "../../contexts/NotificationContext";
  import {
    prayerWallService,
    PrayerEncouragement,
    PrayerRequest,
    PrayerUserProfile,
  } from "../../services/prayerWallService";
  
  export interface PrayerWallStats {
    total: number;
    active: number;
    answered: number;
  }
  
  export interface PrayerWallHandle {
    refresh: () => Promise<void>;
  }
  
  interface PrayerWallProps {
    onStatsChange?: (stats: PrayerWallStats) => void;
  }
  
  type SortOption = "newest" | "most_prayed" | "answered";
  
  const formatDateLabel = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (error) {
      return "";
    }
  };
  
  const maskNameForAnonymous = (request: PrayerRequest): string => {
    if (request.visibility === "anonymous") {
      return "Anonymous";
    }
    return (
      request.userProfile?.display_name ||
      request.userProfile?.username ||
      "Community member"
    );
  };
  
  interface EncouragementModalProps {
    request: PrayerRequest | null;
    open: boolean;
    loading: boolean;
    encouragements: PrayerEncouragement[];
    message: string;
    onMessageChange: (next: string) => void;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    submitting: boolean;
    canEncourage: boolean;
  }
  
  const EncouragementModal: React.FC<EncouragementModalProps> = ({
    request,
    open,
    loading,
    encouragements,
    message,
    onMessageChange,
    onClose,
    onSubmit,
    submitting,
    canEncourage,
  }) => {
    if (!open || !request) {
      return null;
    }
  
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      >
        <div className="mx-auto w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
                Encourage
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                {maskNameForAnonymous(request)}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {request.shortDescription}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close encouragements"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
          </div>
  
          <div className="max-h-80 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading encouragements...
              </div>
            ) : encouragements.length ? (
              <div className="space-y-3">
                {encouragements.map((encouragement) => (
                  <div
                    key={encouragement.id}
                    className="rounded-xl bg-[#F8F8F8] px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#0A1D37]">
                        {encouragement.user?.display_name ||
                          encouragement.user?.username ||
                          "Anonymous"}
                      </span>
                      <span>{formatDateLabel(encouragement.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      {encouragement.message}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">
                No encouragement notes yet. Be the first to leave a blessing.
              </div>
            )}
          </div>
  
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (!canEncourage || submitting || !message.trim()) {
                return;
              }
              await onSubmit();
            }}
            className="border-t border-slate-100 px-6 py-4"
          >
            <label className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
              Add a short note
            </label>
            <textarea
              value={message}
              onChange={(event) => onMessageChange(event.target.value)}
              maxLength={100}
              rows={2}
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-[#F8F8F8] px-3 py-2 text-sm text-slate-700 focus:border-[#0A1D37] focus:outline-none focus:ring-2 focus:ring-[#0A1D37]/20"
              disabled={submitting || !canEncourage}
              placeholder="Let them know you're standing with them (100 chars)"
            />
            {!canEncourage ? (
              <p className="mt-2 text-xs text-rose-500">
                Sign in to share encouragement notes with others.
              </p>
            ) : null}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{Math.max(0, 100 - message.trim().length)} characters left</span>
              <button
                type="submit"
                disabled={submitting || !message.trim() || !canEncourage}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A1D37] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#15294F] disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  interface AnsweredDialogProps {
    request: PrayerRequest | null;
    open: boolean;
    note: string;
    scripture: string;
    onChangeNote: (value: string) => void;
    onChangeScripture: (value: string) => void;
    onClose: () => void;
    onSubmit: () => Promise<void>;
    submitting: boolean;
  }
  
  const AnsweredDialog: React.FC<AnsweredDialogProps> = ({
    request,
    open,
    note,
    scripture,
    onChangeNote,
    onChangeScripture,
    onClose,
    onSubmit,
    submitting,
  }) => {
    if (!open || !request) {
      return null;
    }
  
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      >
        <div className="mx-auto w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          <div className="border-b border-slate-100 px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
              Mark as answered
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              {request.shortDescription}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Celebrate what God has done and thank those who prayed with you.
            </p>
          </div>
  
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await onSubmit();
            }}
            className="space-y-4 px-6 py-6"
          >
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
                Thank-you note
              </label>
              <textarea
                value={note}
                maxLength={200}
                onChange={(event) => onChangeNote(event.target.value)}
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-[#F8F8F8] px-3 py-2 text-sm text-slate-700 focus:border-[#0A1D37] focus:outline-none focus:ring-2 focus:ring-[#0A1D37]/20"
                placeholder="Share a short praise or encouragement (200 chars)"
              />
              <p className="mt-1 text-xs text-slate-500">
                {Math.max(0, 200 - note.trim().length)} characters remaining
              </p>
            </div>
  
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
                Scripture (optional)
              </label>
              <input
                type="text"
                value={scripture}
                maxLength={120}
                onChange={(event) => onChangeScripture(event.target.value)}
                className="mt-2 w-full rounded-full border border-slate-200 bg-[#F8F8F8] px-4 py-2 text-sm text-slate-700 focus:border-[#0A1D37] focus:outline-none focus:ring-2 focus:ring-[#0A1D37]/20"
                placeholder="Example: Psalm 28:7"
              />
            </div>
  
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#0A1D37] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15294F] disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Share answer
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  interface PrayedByModalProps {
    open: boolean;
    onClose: () => void;
    supporters: PrayerUserProfile[];
    loading: boolean;
  }
  
  const PrayedByModal: React.FC<PrayedByModalProps> = ({
    open,
    onClose,
    supporters,
    loading,
  }) => {
    if (!open) {
      return null;
    }
  
    return (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      >
        <div className="mx-auto w-full max-w-sm transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
                People who prayed
              </p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">
                Prayer supporters
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              aria-label="Close prayed-by list"
            >
              <ChevronRight className="h-5 w-5 rotate-180" />
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto px-5 py-5">
            {loading ? (
              <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading supporters...
              </div>
            ) : supporters.length ? (
              <ul className="space-y-3">
                {supporters.map((supporter) => (
                  <li
                    key={supporter.id}
                    className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F8F8F8] text-[#0A1D37]">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {supporter.display_name || supporter.username}
                      </p>
                      <p className="text-xs text-slate-500">Faithful prayer partner</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">
                No one has prayed yet. Share this request to invite others.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  const PrayerWall = forwardRef<PrayerWallHandle, PrayerWallProps>(({ onStatsChange }, ref) => {
    const { user } = useAuth();
    const notification = useNotification();
  
    const [allRequests, setAllRequests] = useState<PrayerRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sort, setSort] = useState<SortOption>("newest");
    const [encouragementModalOpen, setEncouragementModalOpen] = useState(false);
    const [answeredDialogOpen, setAnsweredDialogOpen] = useState(false);
    const [prayedByOpen, setPrayedByOpen] = useState(false);
    const [activeRequest, setActiveRequest] = useState<PrayerRequest | null>(null);
    const [encouragements, setEncouragements] = useState<PrayerEncouragement[]>([]);
    const [encouragementLoading, setEncouragementLoading] = useState(false);
    const [encouragementMessage, setEncouragementMessage] = useState("");
    const [submittingEncouragement, setSubmittingEncouragement] = useState(false);
    const [answeredNote, setAnsweredNote] = useState("");
    const [answeredScripture, setAnsweredScripture] = useState("");
    const [markingAnswered, setMarkingAnswered] = useState(false);
    const [prayedUsers, setPrayedUsers] = useState<PrayerUserProfile[]>([]);
    const [prayedUsersLoading, setPrayedUsersLoading] = useState(false);
    const [pendingPrayerIds, setPendingPrayerIds] = useState<Set<string>>(new Set());
  
    const loadRequests = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
        const requests = await prayerWallService.fetchPrayerRequests();
        setAllRequests(requests);
      } catch (err) {
        console.error("Failed to load prayer requests", err);
        setError((err as Error)?.message || "Failed to load prayer wall.");
      } finally {
        setLoading(false);
      }
    }, []);
  
    const stats = useMemo<PrayerWallStats>(() => {
      const active = allRequests.filter((item) => item.status === "active").length;
      const answered = allRequests.filter((item) => item.status === "answered").length;
      return {
        total: allRequests.length,
        active,
        answered,
      };
    }, [allRequests]);
  
    useEffect(() => {
      onStatsChange?.(stats);
    }, [stats, onStatsChange]);
  
    useImperativeHandle(ref, () => ({ refresh: loadRequests }), [loadRequests]);
  
    useEffect(() => {
      loadRequests();
    }, [loadRequests]);
  
    const visibleRequests = useMemo(() => {
      if (sort === "answered") {
        return allRequests
          .filter((item) => item.status === "answered")
          .sort((a, b) => {
            const aTime = a.answeredAt ? new Date(a.answeredAt).getTime() : 0;
            const bTime = b.answeredAt ? new Date(b.answeredAt).getTime() : 0;
            return bTime - aTime;
          });
      }
  
      if (sort === "most_prayed") {
        return [...allRequests].sort((a, b) => b.prayerCount - a.prayerCount);
      }
  
      return [...allRequests].sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    }, [allRequests, sort]);
  
    const handleTogglePrayer = async (request: PrayerRequest) => {
      if (!user) {
        notification.showNotification({
          type: "info",
          title: "Sign in required",
          message: "Create an account or sign in to pray with others.",
        });
        return;
      }
  
      const requestId = String(request.id);
      setPendingPrayerIds((prev) => new Set(prev).add(requestId));
  
      try {
        const { prayerCount } = await prayerWallService.togglePrayer(
          requestId,
          request.isPrayedByCurrentUser
        );
  
        setAllRequests((prev) =>
          prev.map((item) =>
            item.id === request.id
              ? {
                  ...item,
                  prayerCount,
                  isPrayedByCurrentUser: !item.isPrayedByCurrentUser,
                }
              : item
          )
        );
      } catch (err) {
        notification.showNotification({
          type: "error",
          title: "Action failed",
          message: (err as Error)?.message || "Could not record your prayer.",
        });
      } finally {
        setPendingPrayerIds((prev) => {
          const next = new Set(prev);
          next.delete(requestId);
          return next;
        });
      }
    };
  
    const openEncouragements = async (request: PrayerRequest) => {
      setActiveRequest(request);
      setEncouragementModalOpen(true);
      setEncouragementLoading(true);
      setEncouragementMessage("");
      try {
        const thread = await prayerWallService.fetchEncouragements(request.id);
        setEncouragements(thread);
      } catch (err) {
        notification.showNotification({
          type: "error",
          title: "Could not load",
          message: (err as Error)?.message || "Failed to load encouragement notes.",
        });
        setEncouragements([]);
      } finally {
        setEncouragementLoading(false);
      }
    };
  
    const submitEncouragement = async () => {
      if (!activeRequest) {
        return;
      }
  
      if (!user) {
        notification.showNotification({
          type: "info",
          title: "Sign in required",
          message: "Please sign in to encourage others.",
        });
        return;
      }
  
      const trimmedMessage = encouragementMessage.trim();
      if (!trimmedMessage) {
        return;
      }
  
      setSubmittingEncouragement(true);
      try {
        const created = await prayerWallService.submitEncouragement(
          activeRequest.id,
          trimmedMessage
        );
        setEncouragements((prev) => [created, ...prev]);
        setEncouragementMessage("");
        setAllRequests((prev) =>
          prev.map((item) =>
            item.id === activeRequest.id
              ? {
                  ...item,
                  encouragementCount: item.encouragementCount + 1,
                  recentEncouragements: [created, ...item.recentEncouragements].slice(0, 3),
                }
              : item
          )
        );
      } catch (err) {
        notification.showNotification({
          type: "error",
          title: "Could not send",
          message: (err as Error)?.message || "Failed to send encouragement.",
        });
      } finally {
        setSubmittingEncouragement(false);
      }
    };
  
    const openAnsweredDialog = (request: PrayerRequest) => {
      setActiveRequest(request);
      setAnsweredNote("");
      setAnsweredScripture("");
      setAnsweredDialogOpen(true);
    };
  
    const submitAnswered = async () => {
      if (!activeRequest) {
        return;
      }
  
      setMarkingAnswered(true);
      try {
        const updated = await prayerWallService.markAnswered(activeRequest.id, {
          answeredNote: answeredNote,
          answeredScripture: answeredScripture,
        });
        setAllRequests((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        );
        setAnsweredDialogOpen(false);
        notification.showNotification({
          type: "success",
          title: "Prayer answered",
          message: "Your community will be notified of this praise report!",
        });
      } catch (err) {
        notification.showNotification({
          type: "error",
          title: "Could not update",
          message: (err as Error)?.message || "Failed to mark prayer as answered.",
        });
      } finally {
        setMarkingAnswered(false);
      }
    };
  
    const openPrayedUsers = async (request: PrayerRequest) => {
      setActiveRequest(request);
      setPrayedByOpen(true);
      setPrayedUsersLoading(true);
      try {
        const supporters = await prayerWallService.fetchPrayedUsers(request.id);
        setPrayedUsers(supporters);
      } catch (err) {
        notification.showNotification({
          type: "error",
          title: "Could not load",
          message: (err as Error)?.message || "Failed to load supporters.",
        });
        setPrayedUsers([]);
      } finally {
        setPrayedUsersLoading(false);
      }
    };
  
    return (
      <section className="rounded-xl border border-[#E6E6E6] bg-[#F8F8F8] p-2 sm:p-3">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow">
                <Heart className="h-6 w-6 text-[#0A1D37]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#0A1D37] sm:text-2xl">Prayer Wall</h2>
                
                <p className="mt-1 text-sm text-slate-600">
                  Short, heartfelt requests. Pray with friends — celebrate answers.
                </p>
              </div>
            </div>
  
            <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
              <div className="flex items-center gap-2 rounded-full bg-white px-1.5 py-1 shadow-sm">
                {([
                  { key: "newest", label: "Newest" },
                  { key: "most_prayed", label: "Most Prayed" },
                  { key: "answered", label: "Answered" },
                ] as Array<{ key: SortOption; label: string }>).map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setSort(option.key)}
                    aria-pressed={sort === option.key}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      sort === option.key
                        ? "bg-[#0A1D37] text-white shadow"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
            </div>
          </div>
  
          {/* Stats 
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Total", value: stats.total, caption: "Requests shared" },
              { label: "Active", value: stats.active, caption: "Still receiving prayer" },
              { label: "Answered", value: stats.answered, caption: "Praise reports" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col justify-between rounded-xl bg-white px-4 py-4 text-sm text-slate-600 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#0A1D37]">
                    {item.label}
                  </span>
                  {/* small icon could go here 
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-semibold text-[#0A1D37]">{item.value}</span>
                  <p className="mt-1 text-xs text-slate-500">{item.caption}</p>
                </div>
              </div>
            ))}
          </div>  */}
  
          {/* Error */}
          {error ? (
            <div className="mt-6 rounded-lg bg-white px-4 py-3 text-sm text-rose-600 shadow">
              {error}
            </div>
          ) : null}
  
          {/* Loading / Empty / Requests */}
          {loading ? (
            <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 rounded-xl bg-white/80 p-6 text-sm text-slate-500 shadow">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading prayer requests...
            </div>
          ) : visibleRequests.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-[#D4AF37]/40 bg-white px-6 py-8 text-center text-sm text-slate-500 shadow-sm">
              It’s peaceful here right now. Share a prayer so others can stand with you.
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {visibleRequests.map((request) => {
                const isAnswered = request.status === "answered";
                const isPending = pendingPrayerIds.has(String(request.id));
                const hasEncouragements = request.recentEncouragements.length > 0;
  
                return (
                  <article
                    key={request.id}
                    className={`rounded-2xl border border-white bg-white px-4 py-4 shadow-sm transition hover:shadow-md ${
                      isAnswered ? "ring-1 ring-[#D4AF37]/40" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-4 sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        {/* <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#0A1D37]/6 text-[#0A1D37]">
                          <HandHeart className="h-6 w-6" />
                        </div> */}
                        <div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">
                              {maskNameForAnonymous(request)}
                            </span>
                            <span>•</span>
                            <span>{formatDateLabel(request.createdAt)}</span>
                          </div>
                          <p className="mt-1 text-sm text-base font-semibold text-[#0A1D37]">
                            {request.shortDescription}
                          </p>
                          {request.category ? (
                            <span className="mt-2 inline-flex items-center rounded-full bg-[#0A1D37]/5 px-3 py-1 text-xs font-semibold text-[#0A1D37]">
                              #{request.category}
                            </span>
                          ) : null}
                        </div>
                      </div>
  
                      <div className="flex flex-wrap items-left gap-2 sm:flex-col">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTogglePrayer(request)}
                            disabled={isPending}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                              request.isPrayedByCurrentUser
                                ? "bg-slate-blue text-[#0A1D37] shadow"
                                : "bg-[#0A1D37] text-white hover:bg-[#15294F]"
                            } ${isPending ? "opacity-70" : ""}`}
                          >
                            {isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <HandHeart className="h-4 w-4" />
                            )}
                            {request.isPrayedByCurrentUser ? "Prayed" : "I prayed"}
                          </button>
  
                          <button
                            type="button"
                            onClick={() => openEncouragements(request)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#0A1D37] transition hover:bg-[#0A1D37]/5"
                          >
                            <MessageCircle className="h-4 w-4" />
                            
                          </button>
                        </div>
  
                        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                          <button
                            type="button"
                            onClick={() => openPrayedUsers(request)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#F8F8F8] px-3 py-1 text-[#0A1D37] transition hover:bg-[#0A1D37]/10"
                          >
                            <Users className="h-3.5 w-3.5" />
                            {request.prayerCount} prayed
                          </button>
  
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F8F8] px-3 py-1 text-[#0A1D37]">
                            <MessageCircle className="h-3.5 w-3.5" />
                            {request.encouragementCount} notes
                          </span>
  
                          {isAnswered ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#0A1D37]">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Answered
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
  
                    {hasEncouragements ? (
                      <div className="mt-3 space-y-2 rounded-xl bg-[#0A1D37]/6 px-4 py-3">
                        {request.recentEncouragements.slice(0, 2).map((encouragement) => (
                          <p key={encouragement.id} className="text-sm text-[#0A1D37]">
                            <span className="font-semibold">
                              {encouragement.user?.display_name ||
                                encouragement.user?.username ||
                                "Anonymous"}
                            </span>{" "}
                            {encouragement.message}
                          </p>
                        ))}
                        {request.encouragementCount > 2 ? (
                          <button
                            type="button"
                            onClick={() => openEncouragements(request)}
                            className="text-xs font-semibold uppercase tracking-wider text-[#0A1D37]"
                          >
                            View all encouragements
                          </button>
                        ) : null}
                      </div>
                    ) : null}
  
                    {isAnswered ? (
                      <div className="mt-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-3">
                        {request.answeredNote ? (
                          <p className="text-sm font-medium text-[#0A1D37]">
                            “{request.answeredNote}”
                          </p>
                        ) : null}
                        {request.answeredScripture ? (
                          <p className="mt-2 text-xs uppercase tracking-wider text-[#0A1D37]">
                            {request.answeredScripture}
                          </p>
                        ) : null}
                        <div className="mt-3 flex items-center gap-2 text-xs text-[#0A1D37]">
                          <Clock3 className="h-3.5 w-3.5" />
                          Answered on {request.answeredAt ? formatDateLabel(request.answeredAt) : ""}
                        </div>
                      </div>
                    ) : request.isOwner ? (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => openAnsweredDialog(request)}
                          className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37] bg-white px-4 py-2 text-sm font-semibold text-[#0A1D37] transition hover:bg-[#D4AF37]/20"
                        >
                          <Sparkles className="h-4 w-4" />
                          Mark as answered
                        </button>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          )}
        </div>
  
        <EncouragementModal
          request={activeRequest}
          open={encouragementModalOpen}
          loading={encouragementLoading}
          encouragements={encouragements}
          message={encouragementMessage}
          onMessageChange={setEncouragementMessage}
          onClose={() => setEncouragementModalOpen(false)}
          onSubmit={submitEncouragement}
          submitting={submittingEncouragement}
          canEncourage={Boolean(user)}
        />
  
        <AnsweredDialog
          request={activeRequest}
          open={answeredDialogOpen}
          note={answeredNote}
          scripture={answeredScripture}
          onChangeNote={setAnsweredNote}
          onChangeScripture={setAnsweredScripture}
          onClose={() => setAnsweredDialogOpen(false)}
          onSubmit={submitAnswered}
          submitting={markingAnswered}
        />
  
        <PrayedByModal
          open={prayedByOpen}
          onClose={() => setPrayedByOpen(false)}
          supporters={prayedUsers}
          loading={prayedUsersLoading}
        />
      </section>
    );
  });
  
  PrayerWall.displayName = "PrayerWall";
  
  export default PrayerWall;
  