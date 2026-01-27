import { useEffect, useState } from "react";

import {
  getThemeClustersApi,
  getThemeClusterDetailsApi,
} from "../../lib/api/clusters";

import type { ClusterFeedbackItem, ThemeCluster } from "../../lib/types/clusters";

export function useClusters() {
  const [clusters, setClusters] = useState<ThemeCluster[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const [themeFeedbacks, setThemeFeedbacks] = useState<ClusterFeedbackItem[]>([]);
  const [themeTotal, setThemeTotal] = useState<number>(0);

  const [loadingClusters, setLoadingClusters] = useState(false);
  const [loadingTheme, setLoadingTheme] = useState(false);

  const [errorClusters, setErrorClusters] = useState("");
  const [errorTheme, setErrorTheme] = useState("");

  const fetchClusters = async () => {
    setLoadingClusters(true);
    setErrorClusters("");

    try {
      const res = await getThemeClustersApi();
      setClusters(res.clusters);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to load clusters";
      setErrorClusters(errorMessage);
    } finally {
      setLoadingClusters(false);
    }
  };

  const fetchThemeDetails = async (theme: string, limit = 20) => {
    setLoadingTheme(true);
    setErrorTheme("");

    try {
      const res = await getThemeClusterDetailsApi(theme, limit);
      setSelectedTheme(res.theme);
      setThemeFeedbacks(res.feedbacks);
      setThemeTotal(res.total);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Failed to load theme feedbacks";
      setErrorTheme(errorMessage);
    } finally {
      setLoadingTheme(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  return {
    clusters,
    selectedTheme,
    themeFeedbacks,
    themeTotal,

    loadingClusters,
    loadingTheme,

    errorClusters,
    errorTheme,

    fetchClusters,
    fetchThemeDetails,
    setSelectedTheme,
  };
}
