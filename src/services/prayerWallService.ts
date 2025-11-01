import apiService from "./apiService";

export type PrayerVisibility = "public" | "friends" | "anonymous";
export type PrayerStatus = "active" | "answered";

export interface PrayerUserProfile {
  id: number;
  username: string;
  email?: string;
  profile_picture?: string | null;
  display_name?: string;
  follower_count?: number;
  following_count?: number;
  is_following?: boolean;
  is_self?: boolean;
}

export interface PrayerEncouragement {
  id: string;
  message: string;
  createdAt: string;
  user: PrayerUserProfile | null;
}

export interface PrayerRequest {
  id: string;
  shortDescription: string;
  category: string;
  visibility: PrayerVisibility;
  status: PrayerStatus;
  answeredNote: string;
  answeredScripture: string;
  answeredAt: string | null;
  createdAt: string;
  updatedAt: string;
  userProfile: PrayerUserProfile | null;
  prayerCount: number;
  encouragementCount: number;
  isPrayedByCurrentUser: boolean;
  isOwner: boolean;
  recentEncouragements: PrayerEncouragement[];
}

export interface FetchPrayerRequestParams {
  sort?: "newest" | "most_prayed" | "answered";
  status?: PrayerStatus;
  category?: string;
}

interface RawPrayerEncouragement {
  id: string;
  message: string;
  created_at: string;
  user: PrayerUserProfile | null;
}

interface RawPrayerRequest {
  id: string;
  short_description: string;
  category?: string;
  visibility: PrayerVisibility;
  status: PrayerStatus;
  answered_note?: string;
  answered_scripture?: string;
  answered_at?: string | null;
  created_at: string;
  updated_at: string;
  user_profile?: PrayerUserProfile | null;
  prayer_count?: number;
  encouragement_count?: number;
  is_prayed_by_current_user?: boolean;
  is_owner?: boolean;
  recent_encouragements?: RawPrayerEncouragement[];
}

const mapEncouragement = (raw: RawPrayerEncouragement): PrayerEncouragement => ({
  id: String(raw.id),
  message: raw.message,
  createdAt: raw.created_at,
  user: raw.user
    ? {
        ...raw.user,
        display_name: raw.user.display_name ?? raw.user.username,
      }
    : null,
});

const mapPrayerRequest = (raw: RawPrayerRequest): PrayerRequest => ({
  id: String(raw.id),
  shortDescription: raw.short_description ?? "",
  category: raw.category ?? "",
  visibility: raw.visibility,
  status: raw.status,
  answeredNote: raw.answered_note ?? "",
  answeredScripture: raw.answered_scripture ?? "",
  answeredAt: raw.answered_at ?? null,
  createdAt: raw.created_at,
  updatedAt: raw.updated_at,
  userProfile: raw.user_profile
    ? {
        ...raw.user_profile,
        display_name: raw.user_profile.display_name ?? raw.user_profile.username,
      }
    : null,
  prayerCount: Number(raw.prayer_count ?? 0),
  encouragementCount: Number(raw.encouragement_count ?? 0),
  isPrayedByCurrentUser: Boolean(raw.is_prayed_by_current_user),
  isOwner: Boolean(raw.is_owner),
  recentEncouragements: Array.isArray(raw.recent_encouragements)
    ? raw.recent_encouragements.map(mapEncouragement)
    : [],
});

const buildQueryString = (params?: FetchPrayerRequestParams): string => {
  if (!params) {
    return "";
  }

  const search = new URLSearchParams();
  if (params.sort) {
    search.set("sort", params.sort);
  }
  if (params.status) {
    search.set("status", params.status);
  }
  if (params.category) {
    search.set("category", params.category);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
};

const fetchPrayerRequests = async (
  params?: FetchPrayerRequestParams
): Promise<PrayerRequest[]> => {
  const response = await apiService.get<RawPrayerRequest[] | { results: RawPrayerRequest[] }>(
    `prayer_requests/prayer_requests/${buildQueryString(params)}`
  );

  const data = Array.isArray(response)
    ? response
    : Array.isArray(response?.results)
    ? response.results
    : [];

  return data.map(mapPrayerRequest);
};

const createPrayerRequest = async (payload: {
  shortDescription: string;
  visibility: PrayerVisibility;
  category?: string;
}) => {
  return apiService.post<RawPrayerRequest>("prayer_requests/prayer_requests/", {
    short_description: payload.shortDescription.trim(),
    visibility: payload.visibility,
    category: payload.category?.trim() || "",
  });
};

const togglePrayer = async (
  id: string,
  isCurrentlyPrayed: boolean
): Promise<{ prayerCount: number }> => {
  if (isCurrentlyPrayed) {
    const response = await apiService.delete<{ prayer_count?: number }>(
      `prayer_requests/prayer_requests/${id}/pray/`
    );
    return { prayerCount: Number(response?.prayer_count ?? 0) };
  }

  const response = await apiService.post<{ prayer_count?: number }>(
    `prayer_requests/prayer_requests/${id}/pray/`,
    {}
  );
  return { prayerCount: Number(response?.prayer_count ?? 0) };
};

const fetchEncouragements = async (id: string): Promise<PrayerEncouragement[]> => {
  const response = await apiService.get<RawPrayerEncouragement[] | { results: RawPrayerEncouragement[] }>(
    `prayer_requests/prayer_requests/${id}/encouragements/`
  );

  const data = Array.isArray(response)
    ? response
    : Array.isArray(response?.results)
    ? response.results
    : [];

  return data.map(mapEncouragement);
};

const submitEncouragement = async (id: string, message: string) => {
  const response = await apiService.post<RawPrayerEncouragement>(
    `prayer_requests/prayer_requests/${id}/encouragements/`,
    { message }
  );
  return mapEncouragement(response);
};

const markAnswered = async (
  id: string,
  payload: { answeredNote?: string; answeredScripture?: string }
) => {
  const response = await apiService.post<RawPrayerRequest>(
    `prayer_requests/prayer_requests/${id}/mark-answered/`,
    {
      answered_note: payload.answeredNote?.trim() || "",
      answered_scripture: payload.answeredScripture?.trim() || "",
    }
  );

  return mapPrayerRequest(response);
};

const fetchPrayedUsers = async (
  id: string
): Promise<PrayerUserProfile[]> => {
  const response = await apiService.get<Array<{ id: number; username: string; display_name?: string; avatar?: string | null; prayed_at: string }>>(
    `prayer_requests/prayer_requests/${id}/prayed-users/`
  );

  if (!Array.isArray(response)) {
    return [];
  }

  return response.map((item) => ({
    id: item.id,
    username: item.username,
    display_name: item.display_name ?? item.username,
    profile_picture: item.avatar ?? null,
  }));
};

export const prayerWallService = {
  fetchPrayerRequests,
  createPrayerRequest,
  togglePrayer,
  fetchEncouragements,
  submitEncouragement,
  markAnswered,
  fetchPrayedUsers,
};

export type PrayerWallService = typeof prayerWallService;


