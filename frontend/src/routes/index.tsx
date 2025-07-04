import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Skeleton,
  Spinner,
  Input,
  Chip,
  Button,
  Tooltip,
  BreadcrumbItem,
  Breadcrumbs,
} from "@heroui/react";
import { useDataStore, useFindAllMeasurement, useUpdatePatienID } from "@/hooks/use-data";
import { formatShortDateOnly, formatShortTimeOnly } from "@/date/formater";
import { ArrowRight } from "lucide-react";
import { useExporter } from "@/hooks/use-exporter";
import ExportModal from "@/components/export-modal";
import { pid } from "process";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useFindAllMeasurement();
  const { setPage, setSort, sort, sort_by, search } = useDataStore();

  const { mutate, isPending } = useUpdatePatienID();

  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs>
        <BreadcrumbItem href="/">ตารางข้อมูลวัดผล</BreadcrumbItem>
      </Breadcrumbs>
      <div className="flex justify-end">
        <ExportModal />
      </div>
      <Table
        aria-label="ตารางข้อมูลวัดผล"
        onSortChange={setSort}
        sortDescriptor={{ column: sort_by, direction: sort }}
        bottomContent={
          <>
            {isLoading && <Skeleton className="h-10 rounded" />}
            {!!data && (
              <div className="flex w-full justify-center">
                <Pagination isCompact showControls showShadow color="secondary" page={data.meta.page} total={data.meta.total_page} onChange={setPage} />
              </div>
            )}
          </>
        }
      >
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
        <TableBody
          emptyContent={search ? `ไม่พบข้อมูลสำหรับ [${search}]` : "ไม่พบข้อมูล"}
          loadingState={isLoading ? "loading" : "idle"}
          loadingContent={<Spinner />}
          items={data?.data || []}
        >
          {(item) => (
            <TableRow key={item.ID}>
              <TableCell>{item.ID}</TableCell>
              <TableCell>{formatShortDateOnly(item.CreatedAt as string)}</TableCell>
              <TableCell>{formatShortTimeOnly(item.CreatedAt as string)}</TableCell>
              <TableCell>
                <Input
                  onValueChange={(value) => mutate({ id: item.ID, pId: value.trim() })}
                  defaultValue={item.patient_id}
                  endContent={isPending && <Spinner />}
                />
              </TableCell>
              <TableCell>
                <Chip>
                  {Intl.NumberFormat("th-TH", {
                    style: "unit",
                    unit: "kilogram",
                    minimumFractionDigits: 2,
                  }).format(item.weight)}{" "}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip>
                  {Intl.NumberFormat("th-TH", {
                    style: "unit",
                    unit: "centimeter",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(item.height)}
                </Chip>
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
