import { useMutation } from "@tanstack/react-query";
import { ExportPatientToExcel, ExportToExcel } from "#/go/main/Exporter";

export const useExporter = () => {
  return useMutation({
    mutationFn: (condition: Date) => ExportToExcel(condition.toISOString()),
  });
};

export const useExporterPatient = (pid: string) => {
  return useMutation({
    mutationFn: () => ExportPatientToExcel(pid),
  });
};
