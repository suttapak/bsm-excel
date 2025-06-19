import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetSerialPort, GetMonitors, SelectMonitor } from "#/go/main/App";
import { GetConfig, SetDepartment, SetName } from "#/go/main/Config";

export const keys = {
  ports: ["ports"],
  monitors: ["monitors"],
  config: ["config"],
};

export const useGetPorts = () => {
  return useQuery({
    queryKey: keys.ports,
    queryFn: () => GetSerialPort(),
  });
};

export const useSelectMonitor = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (port: string) => SelectMonitor(port),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.monitors });
    },
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

export const useGetConfig = () => {
  return useQuery({
    queryKey: keys.config,
    queryFn: () => GetConfig(),
  });
};

export const useSetName = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => SetName(name),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.config });
    },
  });
};

export const useSetDepartment = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => SetDepartment(name),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: keys.config });
    },
  });
};
