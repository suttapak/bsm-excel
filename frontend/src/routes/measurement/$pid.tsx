import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
  Input,
  Chip,
  Button,
  Tooltip,
  BreadcrumbItem,
  Breadcrumbs,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
} from "@heroui/react";
import { useDataStore, useFindAllMeasurement, useFindByID, useUpdatePatienID, useUpdatePatienName } from "@/hooks/use-data";
import { formatShortDateOnly, formatShortTimeOnly } from "@/date/formater";
import { ArrowRight } from "lucide-react";
import { useExporter, useExporterPatient } from "@/hooks/use-exporter";
import ExportModal from "@/components/export-modal";
import { useMemo } from "react";
import ExportPatientModal from "@/components/export-patient-modal";
import { useGetConfig } from "@/hooks/use-setting";
export const Route = createFileRoute("/measurement/$pid")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pid } = Route.useParams();
  const { data, isLoading, isError } = useFindByID(pid);
  const { full_name, patien_id } = useMemo(() => {
    const result = {
      patien_id: "",
      full_name: "",
    };
    data.forEach((item) => {
      if (result.patien_id === "") {
        result.patien_id = item.patient_id;
      }
      if (result.full_name === "") {
        result.full_name = item.full_name;
      }
      if (result.full_name !== "" && result.patien_id === "") return;
    });
    return result;
  }, [data]);

  const { mutate, isPending } = useUpdatePatienName(pid);
  const { data: config, isLoading: isLoadingConfig } = useGetConfig();

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs>
        <BreadcrumbItem href="/">ตารางข้อมูลวัดผล</BreadcrumbItem>
        <BreadcrumbItem>{pid}</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end">
        <ExportPatientModal full_name={full_name} patien_id={patien_id} />
      </div>
      <Card>
        <CardHeader className="flex items-center justify-center">
          บันทึกข้อมูลการตรวจวัด น้ำหนักส่วนสูง และ ค่าดัชนีมวลกาย เครื่องชั่งน้ำหนักวัดส่วนสูงอัตโนมัติ ยี่ห้อ Inbody รุ่น BSM370
        </CardHeader>
        <CardBody className="gap-2">
          <Input isReadOnly labelPlacement="outside" label={"หมายเลขประจำตัวผู้รับบริการ"} value={patien_id} />
          <Input
            labelPlacement="outside"
            label={"ชื่อ-นามสกุลผู้รับบริการ"}
            onValueChange={(value) => mutate({ id: patien_id, name: value })}
            defaultValue={full_name}
            endContent={isPending && <Spinner />}
          />
          {isLoadingConfig ? (
            <>
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </>
          ) : (
            <>
              <Input labelPlacement="outside" defaultValue={config?.name} label={"โรงพยาบาล"} />
              <Input labelPlacement="outside" defaultValue={config?.department} label={"หน่วยงาน"} />
            </>
          )}
        </CardBody>
      </Card>
      <Table aria-label="ตารางข้อมูลวัดผล">
        <TableHeader>
          <TableColumn key="id">ลำดับ</TableColumn>
          <TableColumn key="date">วันที่</TableColumn>
          <TableColumn key="time">เวลา</TableColumn>
          <TableColumn key="patient_id">หมายเลขประจำตัว</TableColumn>

          <TableColumn width={90} align="center" key="weight">
            น้ำหนัก (kg)
          </TableColumn>
          <TableColumn width={90} align="center" key="height">
            ส่วนสูง (cm)
          </TableColumn>
          <TableColumn width={90} align="center" key="bmi">
            BMI
          </TableColumn>
          <TableColumn width={40} align="center" key="goto">
            ดูเพิ่มเติม
          </TableColumn>
        </TableHeader>
        <TableBody emptyContent={"ไม่พบข้อมูล"} loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={data || []}>
          {(item) => (
            <TableRow key={item.ID}>
              <TableCell>{item.ID}</TableCell>
              <TableCell>{formatShortDateOnly(item.CreatedAt as string)}</TableCell>
              <TableCell>{formatShortTimeOnly(item.CreatedAt as string)}</TableCell>
              <TableCell>
                <Input defaultValue={item.patient_id} />
              </TableCell>
              <TableCell>
                <Chip>{item.weight.toFixed(2)}</Chip>
              </TableCell>
              <TableCell>
                <Chip>{item.height.toFixed(2)}</Chip>
              </TableCell>
              <TableCell>
                <Chip>{item.bmi.toFixed(2)}</Chip>
              </TableCell>
              <TableCell>
                <Tooltip content={`ดูเพิ่มเติมสำหรับหมายเลขประจำตัว [${item.patient_id}]`}>
                  <Button as={Link} to={`/measurement/${item.patient_id}`} isIconOnly size="sm" color="secondary" variant="light">
                    <ArrowRight size={18} />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
