import {
  OverviewParams,
  OverviewPlannerResponse,
  OverviewResponse,
} from "@/app/(types)/overview.type";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CustomAxiosError } from "../(types)/error.type";
import api from "../(utils)/axios";

export const overviewQueryData = {
  getOverview: "GET_OVERVIEW",
  getOverviewPlanner: "GET_OVERVIEW_PLANNER",
};

const overviewService = {
  getOverview: async (
    params: OverviewParams & { periodId?: string }
  ): Promise<OverviewResponse> => {
    const response = await api.post<OverviewResponse>(
      "/overview/dashboard",
      params
    );
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
  params: OverviewParams & { periodId?: string },
  options?: UseQueryOptions<
    OverviewResponse,
    CustomAxiosError,
    OverviewResponse
  >
) => {
  return useQuery<OverviewResponse, CustomAxiosError, OverviewResponse>({
    queryKey: [overviewQueryData.getOverview, params],
    queryFn: () => overviewService.getOverview(params),
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
