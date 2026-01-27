import { useQuery } from "@tanstack/react-query";
import { getPendingFeedbackCountApi } from "../../lib/api/feedback";

// Define the response type based on your API
type PendingCountResponse = {
  total: number;
};

export function usePendingFeedbackCount() {
  const query = useQuery<PendingCountResponse>({
    queryKey: ["pendingFeedbackCount"],
    queryFn: getPendingFeedbackCountApi,
    staleTime: 30_000, // ✅ Data stays fresh for 30 seconds
    refetchInterval: 60_000, // ✅ Auto-refresh every minute
  });

  // Map TanStack Query states to your existing UI states
  const status = query.isPending ? "loading" : query.isError ? "error" : "success";
  
  // Safely extract the error message
  const error = query.error instanceof Error ? query.error.message : "";

  return {
    pendingCount: query.data?.total ?? 0,
    status,
    error,
    refreshPendingCount: query.refetch,
    // You get these for free with TanStack Query:
    isFetching: query.isFetching,
    lastUpdated: query.dataUpdatedAt,
  };
}