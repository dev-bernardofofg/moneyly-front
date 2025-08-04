import { PeriodsResponse } from "@/app/(types)/period";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { CustomAxiosError } from "../(types)/error";
import api from "../(utils)/axios";

export const periodQueryData = {
  getPeriods: "GET_PERIODS",
};

const periodService = {
  getPeriods: async (): Promise<PeriodsResponse> => {
    const response = await api.post<PeriodsResponse>("/overview/periods");
    return response.data;
  },
};

export const GetPeriodsRequest = (
  options?: UseQueryOptions<PeriodsResponse, CustomAxiosError, PeriodsResponse>
) => {
  return useQuery<PeriodsResponse, CustomAxiosError, PeriodsResponse>({
    queryKey: [periodQueryData.getPeriods],
    queryFn: periodService.getPeriods,
    staleTime: 5 * 60 * 1000, // 5 minutos
    ...options,
  });
};
