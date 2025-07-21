import {
  OverviewPlannerResponse,
  OverviewResponse,
} from "@/app/(types)/overview";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CustomAxiosError } from "../(types)/error";
import api from "../(utils)/axios";

export const overviewQueryData = {
  getOverview: "GET_OVERVIEW",
  getOverviewPlanner: "GET_OVERVIEW_PLANNER",
};

const overviewService = {
  getOverview: async (): Promise<OverviewResponse> => {
    const response = await api.get<OverviewResponse>("/overview/dashboard");
    return response.data;
  },

  getOverviewPlanner: async (): Promise<OverviewPlannerResponse> => {
    const response = await api.get<OverviewPlannerResponse>(
      "/overview/planner"
    );
    return response.data;
  },
};

export const GetOverviewRequest = (
  options?: UseQueryOptions<
    OverviewResponse,
    CustomAxiosError,
    OverviewResponse
  >
) => {
  return useQuery<OverviewResponse, CustomAxiosError, OverviewResponse>({
    queryKey: [overviewQueryData.getOverview],
    queryFn: overviewService.getOverview,
    staleTime: Infinity,
    ...options,
  });
};

export const GetOverviewPlannerRequest = (
  options?: UseQueryOptions<
    OverviewPlannerResponse,
    CustomAxiosError,
    OverviewPlannerResponse
  >
) => {
  return useQuery<
    OverviewPlannerResponse,
    CustomAxiosError,
    OverviewPlannerResponse
  >({
    queryKey: [overviewQueryData.getOverviewPlanner],
    queryFn: overviewService.getOverviewPlanner,
    staleTime: Infinity,
    ...options,
  });
};
