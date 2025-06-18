import { useMutation } from "@tanstack/react-query";
import { ExportToExcel } from "#/go/main/Exporter";

export const useExporter = () => {
  return useMutation({
    mutationFn: (condition: Date) => ExportToExcel(condition.toISOString()),
  });
};
