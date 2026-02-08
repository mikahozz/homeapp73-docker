import { useQuery } from "@tanstack/react-query";

export interface WeatherData {
  temperature: number;
  datetime: string;
}

export default function useWeatherNow() {
  return useQuery<WeatherData[]>({
    queryKey: ["weatherNow"],
    queryFn: async () => {
      console.log("Fetching weathernow...");
      const response = await fetch("/api/weathernow");
      const data = await response.json();
      return data;
    },
    staleTime: 60 * 60 * 1000, // 1 hour in ms
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
