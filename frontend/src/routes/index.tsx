import { createFileRoute } from "@tanstack/react-router";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Skeleton, Spinner, Input, Chip } from "@heroui/react";
import { useDataStore, useFindAllMeasurement } from "@/hooks/use-data";
import { parseAbsolute } from "@internationalized/date";
import { formatShortDateFromString } from "@/date/formater";
export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = useFindAllMeasurement();
  const { setPage, setSort, sort, sort_by } = useDataStore();

  return (
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
        <TableColumn key="patient_id">รหัสประจำตัว</TableColumn>

        <TableColumn width={160} align="center" key="weight">
          H/W/BMI
        </TableColumn>
        <TableColumn align="center" key="weight">
          เวลาการวัด
        </TableColumn>
      </TableHeader>
      <TableBody loadingState={isLoading ? "loading" : "idle"} loadingContent={<Spinner />} items={data?.data || []}>
        {(item) => (
          <TableRow key={item.ID}>
            <TableCell>
              <Input defaultValue={item.patient_id} />
            </TableCell>
            <TableCell>
              <Chip>
                {item.height}/{item.weight}/{item.bmi}
              </Chip>
            </TableCell>
            <TableCell>{formatShortDateFromString(item.CreatedAt)}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
