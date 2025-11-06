import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  CheckCircle,
  Bell,
  Globe,
  Plus,
  FileUp,
  Heart,
  BookOpen,
  MessageCircle,
  Search,
  Loader2,
  X,
  Check,
  Share2,
  UserPlus,
  UserCheck,
  RefreshCw,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProtectedRoute from "../components/ProtectedRoute";
import PrayerWall, { PrayerWallHandle, PrayerWallStats } from "../components/prayer-wall/PrayerWall";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import { prayerWallService, PrayerVisibility } from "../services/prayerWallService";

// --- Interfaces ---
type ReactionCounts = Record<string, number>;

interface FeedPost {
  id: number | string;
  title: string;
  content: string;
  excerpt: string;
  verse: string;
  scriptureRefs: string[];
  author: string;
  authorId?: number;
  authorIsFollowing?: boolean;
  authorIsSelf?: boolean;
  time: string;
  tags: string[];
  imageUrl: string;
  reactionCounts: ReactionCounts;
  userReactions: string[];
  comments: number;
  attachments: boolean;
  hasPrayed: boolean;
  shareCount: number;
  hasShared: boolean;
}

interface CommentAuthor {
  id: number;
  username: string;
  email?: string;
  profile_picture?: string | null;
}

interface PostComment {
  id: number;
  post: number;
  author: CommentAuthor | null;
  content: string;
  reactions: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface UserData {
  displayName: string;
  avatar: string;
  verified: boolean;
  unreadNotifications: number;
  cached: boolean;
  isAdmin: boolean;
  followerCount: number;
  followingCount: number;
}

interface NewPostState {
  title: string;
  content: string;
  imageUrl: string;
  tags: string[];
  scriptureRefs: string[];
}

const createEmptyPostState = (): NewPostState => ({
  title: "",
  content: "",
  imageUrl: "",
  tags: [],
  scriptureRefs: [],
});

// --- Component ---
const HomePage: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();
  
  // State
  const [user, setUser] = useState<UserData | null>(null);
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<"en" | "sw">("en");
  // const [offline] = useState(false);

  // Form states
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activePost, setActivePost] = useState<FeedPost | null>(null);

  const [newPost, setNewPost] = useState<NewPostState>(createEmptyPostState);
  const [tagInput, setTagInput] = useState("");
  const [scriptureInput, setScriptureInput] = useState("");
  const [newPrayer, setNewPrayer] = useState({
    shortDescription: "",
    visibility: "public" as PrayerVisibility,
    category: "",
  });
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [postImageFile, setPostImageFile] = useState<File | null>(null);
  const [postImagePreview, setPostImagePreview] = useState<string>("");
  const [postImageError, setPostImageError] = useState<string | null>(null);
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [pendingPostPrayerIds, setPendingPostPrayerIds] = useState<Set<string>>(() => new Set());
  const [pendingPostLikeIds, setPendingPostLikeIds] = useState<Set<string>>(() => new Set());
  const [pendingPostShareIds, setPendingPostShareIds] = useState<Set<string>>(() => new Set());
  const [pendingFollowUserIds, setPendingFollowUserIds] = useState<Set<number>>(() => new Set());
  const floatingActionsRef = useRef<HTMLDivElement | null>(null);
  const commentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const prayerWallRef = useRef<PrayerWallHandle | null>(null);
  const floatingDragState = useRef<{
    pointerId: number | null;
    offsetRight: number;
    offsetBottom: number;
  }>({
    pointerId: null,
    offsetRight: 0,
    offsetBottom: 0,
  });
  const [floatingPosition, setFloatingPosition] = useState<{ right: number; bottom: number }>(() => ({
    right: 16,
    bottom: 96,
  }));
  const clampFloatingPosition = useCallback(
    (right: number, bottom: number) => {
      if (typeof window === "undefined") {
        return { right, bottom };
      }
      const element = floatingActionsRef.current;
      const width = element?.offsetWidth ?? 72;
      const height = element?.offsetHeight ?? 200;
      const maxRight = Math.max(16, window.innerWidth - width - 16);
      const maxBottom = Math.max(16, window.innerHeight - height - 16);
      return {
        right: Math.min(Math.max(right, 16), maxRight),
        bottom: Math.min(Math.max(bottom, 16), maxBottom),
      };
    },
    []
  );
  const [activeCommentsPost, setActiveCommentsPost] = useState<FeedPost | null>(null);
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [creatingPrayer, setCreatingPrayer] = useState(false);
  const [prayerStats, setPrayerStats] = useState<PrayerWallStats>({
    total: 0,
    active: 0,
    answered: 0,
  });

  // New states for Scripture Search
  const [scriptureSearchQuery, setScriptureSearchQuery] = useState("");
  const [scriptureResults, setScriptureResults] = useState<any[] | null>(null);
  const [scriptureError, setScriptureError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearchedScripture, setHasSearchedScripture] = useState(false);

  // Replace "YOUR_API_KEY_HERE" with your actual API key
  const BIBLE_API_KEY = import.meta.env.VITE_BIBLE_API_KEY;

  const limitedScriptureResults = useMemo(
    () =>
      Array.isArray(scriptureResults)
        ? scriptureResults.slice(0, 4)
        : [],
    [scriptureResults]
  );

  const activePostIdKey = activePost ? String(activePost.id) : null;
  const activePostLikePending = activePostIdKey ? pendingPostLikeIds.has(activePostIdKey) : false;
  const activePostSharePending = activePostIdKey ? pendingPostShareIds.has(activePostIdKey) : false;
  const activePostPrayPending = activePostIdKey ? pendingPostPrayerIds.has(activePostIdKey) : false;
  const activePostIsLiked = activePost ? activePost.userReactions.includes("heart") : false;
  const activePostIsShared = activePost ? activePost.hasShared : false;

  const handleFloatingPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (!floatingActionsRef.current || typeof window === "undefined") {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    floatingActionsRef.current.setPointerCapture(event.pointerId);
    const rect = floatingActionsRef.current.getBoundingClientRect();
    floatingDragState.current = {
      pointerId: event.pointerId,
      offsetRight: rect.right - event.clientX,
      offsetBottom: rect.bottom - event.clientY,
    };
  }, []);

  const handleFloatingPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (typeof window === "undefined") {
        return;
      }

      if (floatingDragState.current.pointerId !== event.pointerId) {
        return;
      }

      event.preventDefault();
      const desiredRight = window.innerWidth - event.clientX - floatingDragState.current.offsetRight;
      const desiredBottom = window.innerHeight - event.clientY - floatingDragState.current.offsetBottom;
      setFloatingPosition((prev) => {
        const next = clampFloatingPosition(desiredRight, desiredBottom);
        if (next.right === prev.right && next.bottom === prev.bottom) {
          return prev;
        }
        return next;
      });
    },
    [clampFloatingPosition]
  );

  const handleFloatingPointerUp = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (floatingDragState.current.pointerId !== event.pointerId) {
      return;
    }

    floatingDragState.current = { pointerId: null, offsetRight: 0, offsetBottom: 0 };
    if (floatingActionsRef.current?.hasPointerCapture(event.pointerId)) {
      floatingActionsRef.current.releasePointerCapture(event.pointerId);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (postImagePreview) {
        URL.revokeObjectURL(postImagePreview);
      }
    };
  }, [postImagePreview]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    setIsMobileView(window.innerWidth < 768);
    setFloatingPosition((prev) => clampFloatingPosition(prev.right, prev.bottom));

    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      setFloatingPosition((prev) => clampFloatingPosition(prev.right, prev.bottom));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampFloatingPosition]);

  useEffect(() => {
    if (!isMobileView) {
      setShowCommentsModal(false);
    }
  }, [isMobileView]);

  // Fetch user, feed, and prayer requests
  const buildExcerpt = useCallback((text: string, limit = 220) => {
    if (!text) {
      return "";
    }

    const normalized = text.replace(/\s+/g, " ").trim();

    if (normalized.length <= limit) {
      return normalized;
    }

    const truncated = normalized.slice(0, limit);
    const lastSpace = truncated.lastIndexOf(" ");
    const safeCut = lastSpace > limit * 0.6 ? lastSpace : limit;

    return `${truncated.slice(0, safeCut)}…`;
  }, []);

  const normalizePost = useCallback(
    (p: any): FeedPost => {
      const reactionSource =
        p && typeof p.reaction_counts === "object" && !Array.isArray(p.reaction_counts)
          ? p.reaction_counts
          : {};
      const normalizedReactions: ReactionCounts = {
        heart: 0,
        pray: 0,
        ...reactionSource,
      };

      const userReactions: string[] = Array.isArray(p.user_reactions) ? p.user_reactions : [];
      const authorProfile = p?.author ?? {};
      const authorName =
        typeof authorProfile === "string"
          ? authorProfile
          : authorProfile?.username || authorProfile?.email || "Community member";

      const commentCount =
        typeof p.comment_count === "number"
          ? p.comment_count
          : typeof p.comments === "number"
          ? p.comments
          : 0;

      return {
        id: Number(p.id) || p.id,
        title: p.title,
        content: p.content || "",
        excerpt: buildExcerpt(p.content || ""),
        verse: p.scripture_refs?.[0] || "",
        scriptureRefs: Array.isArray(p.scripture_refs) ? p.scripture_refs : [],
        author: authorName,
        authorId: typeof authorProfile?.id === "number" ? authorProfile.id : Number(authorProfile?.id) || undefined,
        authorIsFollowing: Boolean(authorProfile?.is_following),
        authorIsSelf: Boolean(authorProfile?.is_self),
        time: new Date(p.created_at).toLocaleString(),
        tags: Array.isArray(p.tags) ? p.tags : [],
        imageUrl: p.image_url || p.thumbnail || "",
        reactionCounts: normalizedReactions,
        userReactions,
        comments: commentCount,
        attachments: p.attachments || false,
        hasPrayed: userReactions.includes("pray"),
        shareCount: Number(p.share_count ?? 0),
        hasShared: Boolean(p.has_shared),
      };
    },
    [buildExcerpt]
  );

  const loadFeed = useCallback(async () => {
    try {
      const postsRaw = await apiService.get("posts/posts/");
      const posts: FeedPost[] = Array.isArray(postsRaw)
        ? postsRaw.map((p: any) => normalizePost(p))
        : [];
      setFeed(posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  }, [normalizePost]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await loadFeed();
      } catch (err) {
        console.error('Error fetching data:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, [loadFeed]);

  useEffect(() => {
    if (authUser) {
      setUser({
        displayName: authUser.username,
        avatar: authUser.profile_picture || "",
        verified: authUser.is_verified,
        unreadNotifications: 0, // TODO: Implement notifications
        cached: true,
        isAdmin: false, // TODO: Add admin field to user model
        followerCount: authUser.follower_count ?? 0,
        followingCount: authUser.following_count ?? 0,
      });
    } else {
      setUser(null);
    }
  }, [authUser]);

  // Handlers for quick actions
  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostImageError(null);
    setIsSubmittingPost(true);

    try {
      let uploadedImageUrl = newPost.imageUrl;

      if (postImageFile) {
        try {
          const response = await apiService.uploadPostImage<{ url: string }>(postImageFile);
          uploadedImageUrl = response.url;
        } catch (uploadError: any) {
          const message = uploadError?.message || "Failed to upload image. Please try again.";
          setPostImageError(message);
          setIsSubmittingPost(false);
          return;
        }
      }

      const payload: Record<string, unknown> = {
        title: newPost.title,
        content: newPost.content,
      };

      if (uploadedImageUrl) {
        payload.image_url = uploadedImageUrl;
      }

      if (newPost.tags.length) {
        payload.tags = newPost.tags;
      }

      if (newPost.scriptureRefs.length) {
        payload.scripture_refs = newPost.scriptureRefs;
      }

      await apiService.post("posts/posts/", payload);
      resetPostForm();
      setShowPostModal(false);
      await loadFeed();
    } catch (err) {
      alert("Failed to create post.");
    } finally {
      setIsSubmittingPost(false);
    }
  };

  // ... inside HomePage: React.FC = () => {
  // ... existing handlers

  const handleScriptureSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptureSearchQuery.trim()) return;

    const BIBLE_ID = import.meta.env.VITE_BIBLE_ID;
    // Use the search query to construct the appropriate API call.
    // NOTE: This example uses a *general* search. For specific verses (e.g., "Gen 1:1"),
    // you would typically need a more complex endpoint like /v1/bibles/{bibleId}/search?query=...
    const SEARCH_ENDPOINT = `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/search?query=${encodeURIComponent(
      scriptureSearchQuery
    )}`;

    setIsSearching(true);
    setScriptureError(null);
    setScriptureResults([]);
    setHasSearchedScripture(true);

    try {
      const response = await fetch(SEARCH_ENDPOINT, {
        headers: {
          "api-key": BIBLE_API_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch scripture. Check API key and query.");
      }

      const data = await response.json();
      const potentialResults =
        data?.data?.verses ??
        data?.data?.results ??
        data?.data?.passages ??
        [];

      setScriptureResults(Array.isArray(potentialResults) ? potentialResults : []);
    } catch (error) {
      console.error("Scripture Search Error:", error);
      setScriptureError(
        "Could not perform search. Check the API key or try a different query."
      );
      setScriptureResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddTag = useCallback(() => {
    const normalized = tagInput
      .trim()
      .replace(/^#+/, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-]/g, "")
      .toLowerCase();
    if (!normalized) {
      return;
    }

    let added = false;
    setNewPost((prev) => {
      const exists = prev.tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase());
      if (exists) {
        return prev;
      }

      added = true;
      return {
        ...prev,
        tags: [...prev.tags, normalized],
      };
    });

    if (added) {
      setTagInput("");
    }
  }, [tagInput]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  }, []);

  const handleTagInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        handleAddTag();
      } else if (event.key === "Backspace" && !tagInput) {
        event.preventDefault();
        setNewPost((prev) => {
          if (!prev.tags.length) {
            return prev;
          }

          return {
            ...prev,
            tags: prev.tags.slice(0, -1),
          };
        });
      }
    },
    [handleAddTag, tagInput]
  );

  const handleAddScriptureReference = useCallback((reference: string) => {
    const normalized = reference.trim().replace(/\s+/g, " ");
    if (!normalized) {
      return false;
    }

    let added = false;
    setNewPost((prev) => {
      const exists = prev.scriptureRefs.some(
        (ref) => ref.toLowerCase() === normalized.toLowerCase()
      );
      if (exists) {
        return prev;
      }

      added = true;
      return {
        ...prev,
        scriptureRefs: [...prev.scriptureRefs, normalized],
      };
    });

    return added;
  }, []);

  const handleRemoveScriptureReference = useCallback((reference: string) => {
    setNewPost((prev) => ({
      ...prev,
      scriptureRefs: prev.scriptureRefs.filter((ref) => ref !== reference),
    }));
  }, []);

  const handleScriptureInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        if (handleAddScriptureReference(scriptureInput)) {
          setScriptureInput("");
        }
      } else if (event.key === "Backspace" && !scriptureInput) {
        event.preventDefault();
        setNewPost((prev) => {
          if (!prev.scriptureRefs.length) {
            return prev;
          }

          return {
            ...prev,
            scriptureRefs: prev.scriptureRefs.slice(0, -1),
          };
        });
      }
    },
    [handleAddScriptureReference, scriptureInput]
  );

  const handleAddScriptureFromInput = useCallback(() => {
    if (handleAddScriptureReference(scriptureInput)) {
      setScriptureInput("");
    }
  }, [handleAddScriptureReference, scriptureInput]);

  const resetPostForm = useCallback(() => {
    setNewPost(createEmptyPostState());
    setTagInput("");
    setScriptureInput("");
    setPostImageError(null);
    if (postImagePreview) {
      URL.revokeObjectURL(postImagePreview);
    }
    setPostImageFile(null);
    setPostImagePreview("");
  }, [postImagePreview]);

  const handleOpenPost = (post: FeedPost) => {
    setActivePost(post);
  };

  const handleClosePost = () => {
    setActivePost(null);
  };

  const updatePostState = useCallback((postId: string, updater: (post: FeedPost) => FeedPost) => {
    setFeed((prevFeed) =>
      prevFeed.map((item) => (String(item.id) === postId ? updater(item) : item))
    );
    setActivePost((prevActive) => {
      if (!prevActive || String(prevActive.id) !== postId) {
        return prevActive;
      }

      return updater(prevActive);
    });
  }, []);

  const handleCloseComments = useCallback(() => {
    setShowCommentsModal(false);
    setActiveCommentsPost(null);
    setPostComments([]);
    setCommentsError(null);
    setNewCommentContent("");
    setCommentSubmitting(false);
  }, []);

  const fetchCommentsForPost = useCallback(
    async (postId: number | string) => {
      setCommentsLoading(true);
      setCommentsError(null);
      try {
        const comments = await apiService.get<PostComment[]>(`comments/comments/?post_id=${postId}`);
        if (Array.isArray(comments)) {
          setPostComments(comments);
          updatePostState(String(postId), (item) => ({
            ...item,
            comments: comments.length,
          }));
          setActiveCommentsPost((prev) =>
            prev && String(prev.id) === String(postId)
              ? {
                  ...prev,
                  comments: comments.length,
                }
              : prev
          );
        } else {
          setPostComments([]);
        }
      } catch (error) {
        setCommentsError((error as Error)?.message || "Failed to load comments.");
        setPostComments([]);
      } finally {
        setCommentsLoading(false);
      }
    },
    [updatePostState]
  );

  const handleOpenComments = useCallback(
    async (post: FeedPost) => {
      setActiveCommentsPost(post);
      setNewCommentContent("");
      setPostComments([]);
      setCommentsError(null);
      setShowCommentsModal(isMobileView);
      await fetchCommentsForPost(post.id);
      if (!isMobileView) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => commentInputRef.current?.focus(), 150);
      }
    },
    [fetchCommentsForPost, isMobileView]
  );

  const handleSubmitComment = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!activeCommentsPost) {
        return;
      }

      if (!authUser) {
        alert("Please sign in to comment.");
        return;
      }

      const content = newCommentContent.trim();
      if (!content) {
        return;
      }

      setCommentSubmitting(true);
      try {
        const response = await apiService.post<PostComment>("comments/comments/", {
          post: activeCommentsPost.id,
          content,
        });

        if (response && typeof response === "object") {
          setPostComments((prev) => [...prev, response]);
          setNewCommentContent("");
          commentInputRef.current?.focus();
          updatePostState(String(activeCommentsPost.id), (item) => ({
            ...item,
            comments: (item.comments || 0) + 1,
          }));
          setActiveCommentsPost((prev) =>
            prev
              ? {
                  ...prev,
                  comments: (prev.comments || 0) + 1,
                }
              : prev
          );
        }
      } catch (error) {
        alert((error as Error)?.message || "Failed to submit comment. Please try again.");
      } finally {
        setCommentSubmitting(false);
      }
    },
    [activeCommentsPost, authUser, newCommentContent, updatePostState]
  );

  const handleReactToComment = useCallback(
    async (comment: PostComment) => {
      if (!authUser) {
        alert("Please sign in to react to comments.");
        return;
      }

      try {
        const response = await apiService.post<{ detail?: string; reactions?: Record<string, unknown> }>(
          `comments/comments/${comment.id}/react/`,
          { type: "heart" }
        );

        setPostComments((prev) =>
          prev.map((item) =>
            item.id === comment.id
              ? {
                  ...item,
                  reactions: response?.reactions ?? item.reactions,
                }
              : item
          )
        );
      } catch (error) {
        alert((error as Error)?.message || "Failed to react to comment.");
      }
    },
    [authUser, updateUser, user]
  );

  const handlePrefillReply = useCallback((username: string | undefined) => {
    if (!username) {
      return;
    }

    setNewCommentContent((prev) => {
      const prefix = `@${username} `;
      if (!prev) {
        return prefix;
      }
      return prev.endsWith(" ") ? `${prev}${prefix}` : `${prev} ${prefix}`;
    });
    setTimeout(() => commentInputRef.current?.focus(), 0);
  }, []);

  const renderCommentItems = useCallback(() => {
    return postComments.map((comment) => {
      const authorName = comment.author?.username || comment.author?.email || "Community member";
      const initials = authorName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
      const heartCount = comment.reactions
        ? Object.values(comment.reactions).filter((value) => value === "heart").length
        : 0;
      const createdTime = new Date(comment.created_at).toLocaleString();

      return (
        <div key={comment.id} className="flex gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {comment.author?.profile_picture ? (
              <img
                src={comment.author.profile_picture}
                alt={authorName}
                className="h-full w-full object-cover"
              />
            ) : (
              initials || "👤"
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm font-semibold text-gray-900">{authorName}</div>
              <span className="text-xs text-gray-400">{createdTime}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {comment.content}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <button
                type="button"
                onClick={() => handleReactToComment(comment)}
                className={`inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 transition ${
                  heartCount ? "text-rose-500" : "hover:text-rose-500"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${heartCount ? "fill-current" : ""}`} />
                Like{heartCount ? ` · ${heartCount}` : ""}
              </button>
              <button
                type="button"
                onClick={() => handlePrefillReply(comment.author?.username)}
                className="inline-flex items-center gap-1 rounded-full border border-transparent px-2 py-1 transition hover:text-blue-600"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Reply
              </button>
            </div>
          </div>
        </div>
      );
    });
  }, [handlePrefillReply, handleReactToComment, postComments]);

  const getCommentCountForPost = useCallback(
    (post: FeedPost) => {
      if (activeCommentsPost && String(activeCommentsPost.id) === String(post.id)) {
        return postComments.length;
      }
      return post.comments || 0;
    },
    [activeCommentsPost, postComments.length]
  );

  const handlePostImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (postImagePreview) {
      URL.revokeObjectURL(postImagePreview);
    }

    if (!file) {
      setPostImageFile(null);
      setPostImagePreview("");
      setPostImageError(null);
      setNewPost((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }

    if (file.type && !file.type.startsWith("image/")) {
      setPostImageError("Please select an image file.");
      setPostImageFile(null);
      setPostImagePreview("");
      setNewPost((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPostImageFile(file);
    setPostImagePreview(previewUrl);
    setPostImageError(null);
    setNewPost((prev) => ({ ...prev, imageUrl: "" }));
  };

  const handleRemovePostImage = () => {
    if (postImagePreview) {
      URL.revokeObjectURL(postImagePreview);
    }
    setPostImageFile(null);
    setPostImagePreview("");
    setPostImageError(null);
    setNewPost((prev) => ({ ...prev, imageUrl: "" }));
  };

  // ...

  const handlePrayerRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const shortDescription = newPrayer.shortDescription.trim();
    if (!shortDescription) {
      alert("Please share a short description of your prayer need (max 200 characters).");
      return;
    }

    setCreatingPrayer(true);
    try {
      await prayerWallService.createPrayerRequest({
        shortDescription,
        visibility: newPrayer.visibility,
        category: newPrayer.category.trim(),
      });
      setShowPrayerModal(false);
      setNewPrayer({ shortDescription: "", visibility: "public", category: "" });
      await prayerWallRef.current?.refresh();
    } catch (err) {
      alert((err as Error)?.message || "Failed to submit prayer request.");
    } finally {
      setCreatingPrayer(false);
    }
  };

  const handleReactToPost = useCallback(
    async (post: FeedPost, reactionType: "pray" | "heart") => {
      const postId = post?.id;
      if (!postId && postId !== 0) {
        return;
      }

      if (!authUser) {
        alert("Please sign in to engage with posts.");
        return;
      }

      const idKey = String(postId);
      const setPending = reactionType === "pray" ? setPendingPostPrayerIds : setPendingPostLikeIds;

      setPending((prev) => {
        const updated = new Set(prev);
        updated.add(idKey);
        return updated;
      });

      try {
        const response = await apiService.post<{ detail?: string }>(
          `posts/posts/${postId}/react/`,
          { type: reactionType }
        );

        const detail = response?.detail?.toLowerCase() ?? "";
        const isRemoval = detail.includes("removed");
        const delta = isRemoval ? -1 : 1;

        updatePostState(idKey, (item) => {
          const currentCount = item.reactionCounts?.[reactionType] ?? 0;
          const updatedCount = Math.max(currentCount + delta, 0);
          const nextUserReactions = new Set(item.userReactions ?? []);

          if (isRemoval) {
            nextUserReactions.delete(reactionType);
          } else {
            nextUserReactions.add(reactionType);
          }

          return {
            ...item,
            reactionCounts: {
              ...item.reactionCounts,
              [reactionType]: updatedCount,
            },
            userReactions: Array.from(nextUserReactions),
            hasPrayed: nextUserReactions.has("pray"),
          };
        });
      } catch (error) {
        alert((error as Error).message || "Failed to update reaction. Please try again.");
      } finally {
        setPending((prev) => {
          const updated = new Set(prev);
          updated.delete(idKey);
          return updated;
        });
      }
    },
    [authUser, updatePostState]
  );

  const handlePrayForPost = useCallback(
    (post: FeedPost) => {
      void handleReactToPost(post, "pray");
    },
    [handleReactToPost]
  );

  const handleLikePost = useCallback(
    (post: FeedPost) => {
      void handleReactToPost(post, "heart");
    },
    [handleReactToPost]
  );

  const handleSharePost = useCallback(
    async (post: FeedPost) => {
      const postId = post?.id;
      if (!postId && postId !== 0) {
        return;
      }

      if (!authUser) {
        alert("Please sign in to share posts.");
        return;
      }

      const idKey = String(postId);
      const wasShared = Boolean(post.hasShared);

      setPendingPostShareIds((prev) => {
        const updated = new Set(prev);
        updated.add(idKey);
        return updated;
      });

      try {
        const endpoint = `posts/posts/${postId}/share/`;
        const response = wasShared
          ? await apiService.delete<{ detail?: string; post?: any }>(endpoint)
          : await apiService.post<{ detail?: string; post?: any }>(endpoint, {
              platform: "community",
            });

        if (response?.post) {
          const normalized = normalizePost(response.post);
          updatePostState(idKey, () => normalized);
        } else {
          updatePostState(idKey, (item) => ({
            ...item,
            shareCount: Math.max(item.shareCount + (wasShared ? -1 : 1), 0),
            hasShared: !wasShared,
          }));
        }
      } catch (error) {
        alert((error as Error).message || "Failed to update share.");
      } finally {
        setPendingPostShareIds((prev) => {
          const updated = new Set(prev);
          updated.delete(idKey);
          return updated;
        });
      }
    },
    [authUser, normalizePost, updatePostState]
  );

  const handleToggleFollowAuthor = useCallback(
    async (post: FeedPost) => {
      const authorId = post.authorId;
      if (!authorId) {
        return;
      }

      if (post.authorIsSelf) {
        return;
      }

      if (!authUser) {
        alert("Please sign in to manage follow settings.");
        return;
      }

      setPendingFollowUserIds((prev) => {
        const updated = new Set(prev);
        updated.add(authorId);
        return updated;
      });

      try {
        const endpoint = `users/${authorId}/follow/`;
        const response = post.authorIsFollowing
          ? await apiService.delete<{ user?: any }>(endpoint)
          : await apiService.post<{ user?: any }>(endpoint, {});

        const isFollowingFromResponse = response?.user?.is_following;
        const isFollowing = typeof isFollowingFromResponse === "boolean"
          ? isFollowingFromResponse
          : !post.authorIsFollowing;

        setFeed((prev) =>
          prev.map((item) =>
            item.authorId === authorId
              ? {
                  ...item,
                  authorIsFollowing: isFollowing,
                }
              : item
          )
        );

        setActivePost((prev) =>
          prev && prev.authorId === authorId
            ? {
                ...prev,
                authorIsFollowing: isFollowing,
              }
            : prev
        );

        const delta = isFollowing === post.authorIsFollowing ? 0 : isFollowing ? 1 : -1;
        if (delta !== 0) {
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  followingCount: Math.max(0, (prev.followingCount ?? 0) + delta),
                }
              : prev
          );
          const baseFollowingCount = authUser?.following_count ?? user?.followingCount ?? 0;
          updateUser({
            following_count: Math.max(0, baseFollowingCount + delta),
          });
        }
      } catch (error) {
        alert((error as Error).message || "Failed to update follow status.");
      } finally {
        setPendingFollowUserIds((prev) => {
          const updated = new Set(prev);
          updated.delete(authorId);
          return updated;
        });
      }
    },
    [authUser, updateUser, user]
  );

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;
    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      const headers: Record<string, string> = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );
      setShowUploadModal(false);
      setUploadFile(null);
      alert("File uploaded!");
    } catch (err) {
      alert("Failed to upload file.");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50 flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading your community feed...</span>
            </div>
          </div>
          <Footer />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16">
          <section className="relative overflow-hidden bg-gradient-to-br from-blue-100 via-white to-emerald-100">
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_55%)]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_50%)]"
              aria-hidden="true"
            />
            <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 py-6">
              <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-row items-start gap-4 sm:flex-row">
    
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
                      <span>Community Hub</span>
                      {user?.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
                      )}
                    </div>
                    <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
                      Welcome back, {user?.displayName || "friend"}
                    </h1>
                    <p className="text-sm text-gray-600 sm:text-base">
                      Continue sharing testimonies, praying for friends, and building hope together today.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-2">
                        <Bell className="h-4 w-4 text-blue-500" />
                        {user?.unreadNotifications ?? 0} unread
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="inline-flex items-center gap-2">
                        <Users className="h-4 w-4 text-emerald-600" />
                        {user?.followerCount ?? 0} followers
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="inline-flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-emerald-600" />
                        {user?.followingCount ?? 0} following
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <button
                        onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                        className="inline-flex items-center gap-1 rounded-full border border-blue-100 bg-white/70 px-2 py-1 text-xs font-medium text-blue-700 transition hover:border-blue-200 hover:text-blue-800"
                      >
                        <Globe className="h-4 w-4" />
                        {language === "en" ? "En" : "Swa"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="hidden w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid">
                  <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-gray-600 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-blue-600">Posts shared</p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{feed.length}</p>
                    <p className="text-xs text-gray-500">Moments of encouragement in your feed.</p>
                  </div>
                  <div className="rounded-2xl border border-white/60 bg-white/80 p-4 text-gray-600 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-emerald-600">Prayer requests</p>
                    <p className="mt-2 text-2xl font-semibold text-gray-900">{prayerStats.total}</p>
                    <p className="text-xs text-gray-500">Friends asking for support today.</p>
                  </div>
                  <div className="col-span-1 rounded-2xl border border-white/60 bg-white/80 p-4 text-gray-600 shadow-sm sm:col-span-2">
                    <p className="text-xs uppercase tracking-wide text-indigo-600">Scripture focus</p>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                      “Let your light shine before others, that they may see your good deeds.” — Matthew 5:16
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="px-1 sm:px-3 pt-16 pb-16 -mt-6 md:-mt-10 lg:-mt-12">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="space-y-2">
                  <div className="hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:block">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Quick actions</h2>
                        <p className="text-sm text-gray-500">Encourage the community with a new update, prayer, or resource.</p>
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        <button
                          onClick={() => setShowPostModal(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                        >
                          <Plus className="h-4 w-4" />
                          New post
                        </button>
                        <button
                          onClick={() => setShowPrayerModal(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500/90 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-600"
                        >
                          <Heart className="h-4 w-4" />
                          Prayer request
                        </button>
                        <button
                          onClick={() => setShowUploadModal(true)}
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:text-gray-900"
                        >
                          <FileUp className="h-4 w-4" />
                          Upload resource
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white shadow-sm">
                    <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Public feed</h2>
                        <p className="text-sm text-gray-500">Real-time stories, reflections, and praise reports from your community.</p>
                      </div>
                    </div>
                    {feed.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-3 px-6 py-6 text-center text-gray-500">
                        <BookOpen className="h-12 w-12 text-gray-300" />
                        <p className="text-base font-medium text-gray-400">No posts yet.</p>
                        <p className="text-sm text-gray-500">Be the first to share how God is moving today.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 px-0 py-5 sm:px-0 sm:py-4">
                        {feed.map((post) => {
                          const postIdKey = String(post.id);
                          const isLiked = post.userReactions.includes("heart");
                          const isShared = post.hasShared;
                          const likePending = pendingPostLikeIds.has(postIdKey);
                          const prayPending = pendingPostPrayerIds.has(postIdKey);
                          const sharePending = pendingPostShareIds.has(postIdKey);
                          const followPending = post.authorId ? pendingFollowUserIds.has(post.authorId) : false;

                          return (
                            <div key={post.id} className="space-y-4">
                              <article
                                onClick={() => handleOpenPost(post)}
                                onKeyDown={(event) => {
                                  if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    handleOpenPost(post);
                                  }
                                }}
                                role="button"
                                tabIndex={0}
                                className="overflow-hidden cursor-pointer rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                              >
                                <div className="flex flex-col md:flex-row">
                                  {post.imageUrl ? (
                                    <div className="relative w-full overflow-hidden md:w-2/5">
                                      <div className="relative h-52 w-full md:h-full">
                                        <img
                                          src={post.imageUrl}
                                          alt={`Image for ${post.title}`}
                                          className="absolute inset-0 h-full w-full object-cover"
                                        />
                                      </div>
                                    </div>
                                  ) : null}
                                  <div className={`flex flex-1 flex-col gap-2 px-4 py-3 sm:px-8 ${post.imageUrl ? 'md:w-3/5' : ''}`}>
                                    <div className="flex flex-col items-left gap-1">
                                      <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">{post.title}</h3>
                                      {post.verse && (
                                        <span className="inline-flex items-center rounded-sm px-1 py-1 text-xs font-semibold text-blue-600">
                                          {post.verse}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-600 line-clamp-3">
                                      {post.excerpt}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                      <span>
                                        By{" "}
                                        <span className="font-medium text-gray-700">
                                          {post.author || "Anonymous"}
                                        </span>
                                      </span>
                                      <span className="hidden sm:inline">•</span>
                                      <span>{post.time}</span>
                                      {post.attachments && (
                                        <>
                                          <span className="hidden sm:inline">•</span>
                                          <span className="inline-flex items-center gap-1 text-blue-600">
                                            <FileUp className="h-3.5 w-3.5" />
                                            Attachment included
                                          </span>
                                        </>
                                      )}
                                      {post.authorId && !post.authorIsSelf ? (
                                        <>
                                          <span className="hidden sm:inline">•</span>
                                          <button
                                            type="button"
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              handleToggleFollowAuthor(post);
                                            }}
                                            disabled={followPending}
                                            className={`inline-flex items-center gap-1.5 font-semibold transition ${
                                              post.authorIsFollowing ? "text-emerald-600" : "hover:text-emerald-500"
                                            } ${followPending ? "opacity-70" : ""}`}
                                            aria-label={`${post.authorIsFollowing ? "Unfollow" : "Follow"} ${post.author}`}
                                          >
                                            {followPending ? (
                                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : post.authorIsFollowing ? (
                                              <UserCheck className="h-3.5 w-3.5" />
                                            ) : (
                                              <UserPlus className="h-3.5 w-3.5" />
                                            )}
                                            {post.authorIsFollowing ? "Following" : "Follow"}
                                          </button>
                                        </>
                                      ) : null}
                                    </div>
                                    {post.tags?.length ? (
                                      <div className="flex flex-wrap gap-1">
                                        {post.tags.map((tag) => (
                                          <span
                                            key={tag}
                                            className="rounded-xl text-sm bg-slate-100 px-2 py-0.5 text-gray-600"
                                          >
                                            #{tag}
                                          </span>
                                        ))}
                                      </div>
                                    ) : null}
                                    <div className="flex flex-wrap items-center gap-4 border-t border-gray-100 pt-4 text-sm text-gray-500 sm:justify-between">
                                      <div className="flex flex-wrap items-center gap-4">
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleLikePost(post);
                                          }}
                                          disabled={likePending}
                                          className={`inline-flex items-center gap-2 font-medium transition ${
                                            isLiked ? "text-rose-500" : "hover:text-rose-500"
                                          } ${likePending ? "opacity-70" : ""}`}
                                          aria-label={`${isLiked ? "Unlike" : "Like"} post, currently has ${post.reactionCounts?.heart || 0} likes`}
                                        >
                                          {likePending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                                          )}
                                          {post.reactionCounts?.heart || 0}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleSharePost(post);
                                          }}
                                          disabled={sharePending}
                                          className={`inline-flex items-center gap-2 font-medium transition ${
                                            isShared ? "text-blue-600" : "hover:text-blue-600"
                                          } ${sharePending ? "opacity-70" : ""}`}
                                          aria-label={`${isShared ? "Unshare" : "Share"} post, currently shared ${post.shareCount} times`}
                                        >
                                          {sharePending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <Share2 className="h-4 w-4" />
                                          )}
                                          {post.shareCount}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleOpenComments(post);
                                          }}
                                          className="inline-flex items-center gap-2 font-medium transition hover:text-blue-600"
                                          aria-label={`Open comments for ${post.title}`}
                                        >
                                          <MessageCircle className="h-4 w-4" />
                                        {getCommentCountForPost(post)}
                                        </button>
                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handlePrayForPost(post);
                                          }}
                                          disabled={prayPending}
                                          className={`inline-flex items-center gap-2 font-medium transition ${
                                            post.hasPrayed ? "text-emerald-600" : "hover:text-emerald-500"
                                          } ${prayPending ? "opacity-70" : ""}`}
                                          aria-label={`Pray for post, ${post.reactionCounts?.pray || 0} prayers`}
                                        >
                                          {prayPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : post.hasPrayed ? (
                                            <Check className="h-4 w-4" />
                                          ) : (
                                            <Plus className="h-4 w-4 rotate-45" />
                                          )}
                                          {post.hasPrayed ? "Prayed" : "Pray"} {post.reactionCounts?.pray || 0}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </article>
                              {!isMobileView && activeCommentsPost && activeCommentsPost.id === post.id ? (
                                <div
                                  className="rounded-2xl border border-gray-100 bg-white px-4 py-5 shadow-sm sm:px-8"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        Comments for {activeCommentsPost.title}
                                      </h3>
                                      <p className="text-xs uppercase tracking-wide text-gray-500">
                                        {postComments.length} comment{postComments.length === 1 ? "" : "s"}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => fetchCommentsForPost(activeCommentsPost.id)}
                                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
                                      >
                                        {commentsLoading ? (
                                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                          <RefreshCw className="h-3.5 w-3.5" />
                                        )}
                                        Refresh
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCloseComments}
                                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-rose-300 hover:text-rose-600"
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mt-4 space-y-4">
                                    {commentsError ? (
                                      <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-600">
                                        {commentsError}
                                      </div>
                                    ) : null}
                                    {commentsLoading && !postComments.length ? (
                                      <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading comments...
                                      </div>
                                    ) : null}
                                    {!commentsLoading && !postComments.length && !commentsError ? (
                                      <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
                                        No comments yet. Be the first to encourage the author!
                                      </div>
                                    ) : null}
                                    {renderCommentItems()}
                                  </div>
                                  <form onSubmit={handleSubmitComment} className="mt-6 space-y-3">
                                    <label htmlFor="new-comment" className="block text-sm font-semibold text-gray-700">
                                      Share your encouragement
                                    </label>
                                    <textarea
                                      id="new-comment"
                                      ref={commentInputRef}
                                      value={newCommentContent}
                                      onChange={(event) => setNewCommentContent(event.target.value)}
                                      placeholder={authUser ? "Write a public comment..." : "Sign in to leave a comment."}
                                      rows={3}
                                      className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                      disabled={!authUser}
                                    />
                                    <div className="flex items-center justify-end">
                                      <button
                                        type="submit"
                                        disabled={!authUser || !newCommentContent.trim() || commentSubmitting}
                                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                      >
                                        {commentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                        Post comment
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <aside className="space-y-8">
                  <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Scripture search</h3>
                        <p className="text-sm text-gray-500">Find passages to encourage your community.</p>
                      </div>
                    </div>
                    <form onSubmit={handleScriptureSearch} className="mt-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Psalm 23 or hope"
                        value={scriptureSearchQuery}
                        onChange={(e) => setScriptureSearchQuery(e.target.value)}
                        className="input-field flex-1"
                        aria-label="Search for Bible verse or topic"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                        aria-label="Execute search"
                        disabled={isSearching || !scriptureSearchQuery.trim()}
                      >
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      </button>
                    </form>
                    <div className="mt-4 space-y-3 text-sm text-gray-600">
                      {isSearching && <p className="text-blue-600">Searching...</p>}
                      {scriptureError && <p className="text-rose-500">{scriptureError}</p>}
                      {!isSearching && !scriptureError && limitedScriptureResults.length > 0 && (
                        <div className="space-y-3">
                          {limitedScriptureResults.map((verse, index) => (
                            <div
                              key={verse?.id ?? verse?.reference ?? index}
                              className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-3"
                            >
                              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                                {verse?.reference || verse?.human || "Verse"}
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-gray-700">
                                {(verse?.text || verse?.content || "").replace(/<[^>]+>/g, "")}
                              </p>
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const referenceLabel =
                                      verse?.reference || verse?.human || verse?.id || "";
                                    if (!referenceLabel) {
                                      return;
                                    }

                                    const added = handleAddScriptureReference(referenceLabel);
                                    if (added && !showPostModal) {
                                      setShowPostModal(true);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-200"
                                >
                                  <Plus className="h-3 w-3" />
                                  Add to post
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {!isSearching && !scriptureError && hasSearchedScripture && limitedScriptureResults.length === 0 && (
                        <p className="text-gray-500">No passages found. Try another keyword or book reference.</p>
                      )}
                      {!isSearching && !scriptureError && !hasSearchedScripture && (
                        <p className="text-gray-500">Search for a book, chapter, or topic to get started.</p>
                      )}
                    </div>
                  </div>

                  <PrayerWall ref={prayerWallRef} onStatsChange={setPrayerStats} />
                </aside>
              </div>
            </div>
          </section>
        </main>

        <div
          ref={floatingActionsRef}
          className="fixed z-40 flex flex-col items-end gap-2 md:hidden"
          style={{ right: `${floatingPosition.right}px`, bottom: `${floatingPosition.bottom}px` }}
        >
          <div
            className="flex cursor-grab items-center justify-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-md shadow-slate-400/30 backdrop-blur-sm touch-none"
            onPointerDown={handleFloatingPointerDown}
            onPointerMove={handleFloatingPointerMove}
            onPointerUp={handleFloatingPointerUp}
            onPointerCancel={handleFloatingPointerUp}
            role="button"
            tabIndex={0}
            aria-label="Drag quick actions"
          >
            Drag
          </div>
          <div className="flex gap-2 rounded-full bg-white/95 p-2 shadow-lg shadow-slate-500/30 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setShowPostModal(true)}
              onPointerDown={(event) => event.stopPropagation()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30"
              aria-label="Create post"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowPrayerModal(true)}
              onPointerDown={(event) => event.stopPropagation()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500 text-white shadow-md shadow-rose-500/30"
              aria-label="New prayer request"
            >
              <Heart className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              onPointerDown={(event) => event.stopPropagation()}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white shadow-md shadow-slate-900/30"
              aria-label="Upload resource"
            >
              <FileUp className="h-5 w-5" />
            </button>
          </div>
        </div>

        {activePost && (
          <div className="fixed inset-0 z-[65]">
            <div
              className="absolute inset-0 bg-slate-900/65 backdrop-blur-sm"
              onClick={handleClosePost}
              aria-hidden="true"
            />
            <div className="relative mx-auto flex h-full max-h-full w-full max-w-3xl px-4 py-6 md:py-12">
              <article className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
                <button
                  type="button"
                  onClick={handleClosePost}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label="Close post"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 pb-10 pt-14 sm:px-10">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
                      <span>Community Story</span>
                      {activePost.verse && (
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[0.7rem] font-semibold text-blue-600 tracking-normal">
                          Anchor: {activePost.verse}
                        </span>
                      )}
                    </div>
                    <h2 className="mt-5 text-2xl font-semibold text-gray-900 sm:text-3xl">
                      {activePost.title}
                    </h2>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span>
                        By{" "}
                        <span className="font-medium text-gray-700">{activePost.author || "Anonymous"}</span>
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span>{activePost.time}</span>
                    </div>
                    {activePost.scriptureRefs.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {activePost.scriptureRefs.map((reference) => (
                          <span
                            key={reference}
                            className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
                          >
                            {reference}
                          </span>
                        ))}
                      </div>
                    )}
                    {activePost.tags?.length ? (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {activePost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {activePost.imageUrl && (
                      <div className="mt-6 overflow-hidden rounded-3xl border border-gray-100 bg-gray-50">
                        <img
                          src={activePost.imageUrl}
                          alt={`Image for ${activePost.title}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    {activePost.attachments && (
                      <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50/70 px-3 py-2 text-xs font-semibold text-amber-600">
                        <FileUp className="h-4 w-4" />
                        Attachment available with this post
                      </div>
                    )}
                    <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-700 whitespace-pre-line">
                      {activePost.content.trim() || "This post has no additional content."}
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100 bg-slate-50/60 px-6 py-4 sm:px-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-gray-500">
                      Continue the encouragement — share a prayer or comment below.
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <button
                        type="button"
                        onClick={() => handleLikePost(activePost)}
                        disabled={activePostLikePending}
                        className={`inline-flex items-center gap-2 font-semibold transition ${
                          activePostIsLiked ? "text-rose-500" : "hover:text-rose-500"
                        } ${activePostLikePending ? "opacity-70" : ""}`}
                        aria-label={`${activePostIsLiked ? "Unlike" : "Like"} post`}
                      >
                        {activePostLikePending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Heart className={`h-4 w-4 ${activePostIsLiked ? "fill-current" : ""}`} />
                        )}
                        {activePost.reactionCounts?.heart || 0}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSharePost(activePost)}
                        disabled={activePostSharePending}
                        className={`inline-flex items-center gap-2 font-semibold transition ${
                          activePostIsShared ? "text-blue-600" : "hover:text-blue-600"
                        } ${activePostSharePending ? "opacity-70" : ""}`}
                        aria-label={`${activePostIsShared ? "Unshare" : "Share"} post`}
                      >
                        {activePostSharePending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Share2 className="h-4 w-4" />
                        )}
                                      {activePost.shareCount}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenComments(activePost)}
                        className="inline-flex items-center gap-2 rounded-full border border-blue-100 px-3 py-1 font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {getCommentCountForPost(activePost)}
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrayForPost(activePost)}
                        disabled={activePostPrayPending}
                        className={`inline-flex items-center gap-2 rounded-full border border-amber-200 px-3 py-1 font-semibold transition ${
                          activePost.hasPrayed
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : "text-amber-600 hover:bg-amber-50"
                        } ${activePostPrayPending ? "opacity-70" : ""}`}
                      >
                        {activePostPrayPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : activePost.hasPrayed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4 rotate-45" />
                        )}
                        {activePost.hasPrayed ? "Prayed" : "Pray"} {activePost.reactionCounts?.pray || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        )}

        <Footer />

        {showPostModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 px-4 py-10 backdrop-blur">
            <div className="mx-auto flex w-full max-w-lg items-stretch justify-center">
              <form
                onSubmit={handleNewPost}
                className="w-full max-h-[calc(100vh-5rem)] space-y-4 overflow-y-auto rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
              >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create new post</h2>
                <p className="text-sm text-gray-500">Share a testimony, encouragement, or community update.</p>
              </div>
              <input
                type="text"
                placeholder="Post title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="input-field"
                required
              />
              <textarea
                placeholder="What's on your heart today?"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="input-field"
                rows={5}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Post image</label>
                {postImagePreview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-gray-200">
                    <img
                      src={postImagePreview}
                      alt="Selected post preview"
                      className="h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemovePostImage}
                      className="absolute right-3 top-3 inline-flex items-center justify-center rounded-full bg-slate-900/75 px-3 py-1 text-xs font-semibold text-white transition hover:bg-slate-900"
                    >
                      Remove image
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePostImageChange}
                    className="w-full cursor-pointer rounded-xl border border-dashed border-gray-300 bg-slate-50 px-4 py-3 text-sm text-gray-600 transition hover:border-blue-400 hover:bg-blue-50/40"
                  />
                )}
                {postImageError && <p className="text-sm text-rose-500">{postImageError}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Tags</label>
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-slate-50/70 px-3 py-2 transition focus-within:border-blue-400 focus-within:bg-white">
                  {newPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-500 transition hover:text-blue-700"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Add a tag"
                    className="flex-1 min-w-[120px] border-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    aria-label="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!tagInput.trim()}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500">Press Enter or comma after each tag. Tags are formatted automatically to keep them consistent.</p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Scripture references</label>
                <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-slate-50/70 px-3 py-2 transition focus-within:border-emerald-400 focus-within:bg-white">
                  {newPost.scriptureRefs.map((reference) => (
                    <span
                      key={reference}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600"
                    >
                      {reference}
                      <button
                        type="button"
                        onClick={() => handleRemoveScriptureReference(reference)}
                        className="text-emerald-500 transition hover:text-emerald-700"
                        aria-label={`Remove scripture reference ${reference}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={scriptureInput}
                    onChange={(event) => setScriptureInput(event.target.value)}
                    onKeyDown={handleScriptureInputKeyDown}
                    placeholder="e.g. John 3:16"
                    className="flex-1 min-w-[140px] border-none bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-0"
                    aria-label="Add scripture reference"
                  />
                  <button
                    type="button"
                    onClick={handleAddScriptureFromInput}
                    disabled={!scriptureInput.trim()}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Plus className="h-3 w-3" />
                    Add
                  </button>
                </div>
                <p className="text-xs text-gray-500">Add references manually or use Scripture search to insert verses directly.</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetPostForm();
                    setShowPostModal(false);
                  }}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  disabled={isSubmittingPost}
                >
                  {isSubmittingPost ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSubmittingPost ? "Publishing..." : "Publish post"}
                </button>
              </div>
              </form>
            </div>
          </div>
        )}

        {showCommentsModal && activeCommentsPost ? (
          <div
            className="fixed inset-0 z-[75] flex flex-col bg-slate-900/60 backdrop-blur-sm md:hidden"
            onClick={handleCloseComments}
          >
            <div
              className="mt-auto w-full max-h-[85vh] rounded-t-3xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mx-auto w-full max-w-lg">
                <div className="flex flex-col gap-3 px-5 pt-4 pb-3">
                  <div className="mx-auto h-1.5 w-12 rounded-full bg-gray-300" aria-hidden="true" />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          Comments ({postComments.length})
                        </h3>
                        <p className="text-xs text-gray-500">{activeCommentsPost.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseComments}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:text-gray-700"
                      aria-label="Close comments"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-4 overflow-y-auto px-5 pb-4">
                  {commentsError ? (
                    <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-rose-600">
                      {commentsError}
                    </div>
                  ) : null}
                  {commentsLoading && !postComments.length ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading comments...
                    </div>
                  ) : null}
                  {!commentsLoading && !postComments.length && !commentsError ? (
                    <div className="rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-500">
                      No comments yet. Be the first to share your thoughts!
                    </div>
                  ) : null}
                  {renderCommentItems()}
                </div>
                <form onSubmit={handleSubmitComment} className="border-t border-gray-100 px-5 py-4">
                  <div className="flex flex-col gap-3">
                    <textarea
                      ref={commentInputRef}
                      value={newCommentContent}
                      onChange={(event) => setNewCommentContent(event.target.value)}
                      placeholder={authUser ? "Write a comment..." : "Sign in to comment."}
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm transition focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      disabled={!authUser}
                    />
                    <div className="flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => fetchCommentsForPost(activeCommentsPost.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:text-blue-600"
                      >
                        {commentsLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="h-3.5 w-3.5" />
                        )}
                        Refresh
                      </button>
                      <button
                        type="submit"
                        disabled={!authUser || !newCommentContent.trim() || commentSubmitting}
                        className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {commentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Post
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : null}

        {showPrayerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
            <form
              onSubmit={handlePrayerRequest}
              className="w-full max-w-lg space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">New prayer request</h2>
                <p className="text-sm text-gray-500">Share how the community can pray with and for you. You can choose to post publicly or keep your name hidden.</p>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                  Prayer request
                </label>
                <textarea
                  placeholder="Describe your prayer need in 200 characters or fewer"
                  value={newPrayer.shortDescription}
                  onChange={(e) => setNewPrayer({ ...newPrayer, shortDescription: e.target.value.slice(0, 200) })}
                  className="mt-2 w-full rounded-2xl border border-rose-100 bg-rose-50/60 px-4 py-3 text-sm text-gray-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  rows={4}
                  maxLength={200}
                  required
                />
                <div className="mt-1 text-xs text-gray-500">
                  {200 - newPrayer.shortDescription.trim().length} characters remaining
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    Category (optional)
                  </label>
                  <input
                    type="text"
                    value={newPrayer.category}
                    onChange={(e) => setNewPrayer({ ...newPrayer, category: e.target.value.slice(0, 40) })}
                    className="rounded-full border border-rose-100 bg-rose-50/60 px-4 py-2 text-sm text-gray-800 focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                    placeholder="e.g. Healing, Exams, Family"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    Visibility
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { key: "public", label: "Public", description: "Visible to everyone" },
                        { key: "friends", label: "Friends", description: "Visible to people you follow" },
                        { key: "anonymous", label: "Anonymous", description: "Share without your name" },
                      ] as Array<{ key: PrayerVisibility; label: string; description: string }>
                    ).map((option) => (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setNewPrayer({ ...newPrayer, visibility: option.key })}
                        className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                          newPrayer.visibility === option.key
                            ? "border-rose-500 bg-rose-500 text-white"
                            : "border-rose-100 bg-rose-50/40 text-rose-600 hover:border-rose-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {newPrayer.visibility === "public"
                      ? "Your name and profile will be shown."
                      : newPrayer.visibility === "friends"
                      ? "Shown to the people you follow and who follow you back."
                      : "Request is public but your identity stays hidden."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPrayerModal(false)}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingPrayer}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creatingPrayer ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Submit request
                </button>
              </div>
            </form>
          </div>
        )}

        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4 backdrop-blur">
            <form
              onSubmit={handleUploadFile}
              className="w-full max-w-lg space-y-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
            >
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Upload resource</h2>
                <p className="text-sm text-gray-500">Share study guides, devotionals, or helpful PDFs with the community.</p>
              </div>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600"
                >
                  Upload file
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
