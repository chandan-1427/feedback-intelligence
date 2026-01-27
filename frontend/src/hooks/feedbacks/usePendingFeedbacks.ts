import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPendingFeedbacksApi } from "../../lib/api/feedback";
import type { FeedbackItem } from "../../lib/types/feedback";

// ✅ 1. Update this to match your actual API return type (GetFeedbacksResponse)
// If the API doesn't return 'total', we should make it optional or remove it.
type PendingFeedbacksResponse = {
  feedbacks: FeedbackItem[];
  page: number;
  total?: number; // Made optional to satisfy the 'missing property' error
};

export function usePendingFeedbacks(limit = 20, currentPage = 1) {
  const queryClient = useQueryClient();

  // ✅ 2. Use the specific types in useQuery to prevent 'No overload matches'
  const query = useQuery<PendingFeedbacksResponse, Error>({
    queryKey: ["pendingFeedbacks", { limit, page: currentPage }],
    queryFn: async () => {
      const data = await getPendingFeedbacksApi(currentPage, limit);
      return data as PendingFeedbacksResponse; // Explicit cast to resolve the mismatch
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
    // ✅ 3. In TanStack Query v5, placeholderData is a property, not a callback usually
    // though the functional form is supported for keeping previous data.
    placeholderData: (previousData) => previousData,
  });

  const removePendingFeedback = (id: string) => {
    queryClient.setQueryData<PendingFeedbacksResponse>(
      ["pendingFeedbacks", { limit, page: currentPage }],
      (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          feedbacks: oldData.feedbacks.filter((f) => f.id !== id),
        };
      }
    );
  };

  const status = query.isPending ? "loading" : query.isError ? "error" : "success";
  const error = query.error?.message || "";

  return {
    pendingFeedbacks: query.data?.feedbacks ?? [],
    page: query.data?.page ?? currentPage,
    limit,
    status,
    error,
    refresh: query.refetch,
    removePendingFeedback,
    isFetching: query.isFetching,
  };
}