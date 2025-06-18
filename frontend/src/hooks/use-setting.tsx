import { useQuery } from "@tanstack/react-query";
import { GetSerialPort, GetMonitors } from "#/go/main/App";

export const keys = {
  ports: ["ports"],
  monitors: ["monitors"],
};

export const useGetPorts = () => {
  return useQuery({
    queryKey: keys.ports,
    queryFn: () => GetSerialPort(),
  });
};
export const useGetMonitors = () => {
  return useQuery({
    queryKey: keys.monitors,
    queryFn: () => GetMonitors(),
  });
};

export const useGetInstantRunning = () => {
  const { data, isLoading, isError } = useGetMonitors();
  return {
    isLoading,
    isError,
    isRunning: (data?.length && data.length > 0) || false,
    len: data?.length || 0,
  };
};
