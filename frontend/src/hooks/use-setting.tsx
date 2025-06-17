import { useQuery } from "@tanstack/react-query";
import { GetSerialPort } from "#/go/main/App";

export const keys = {
  ports: ["ports"],
};

export const useGetPorts = () => {
  return useQuery({
    queryKey: keys.ports,
    queryFn: () => GetSerialPort(),
  });
};
