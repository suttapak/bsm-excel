import { useGetMonitors } from "@/hooks/use-setting";
import { createFileRoute } from "@tanstack/react-router";

import PortSelection from "@/components/port-selection";
import { BreadcrumbItem, Breadcrumbs, Card, CardBody, CardHeader, Listbox, ListboxItem, Skeleton } from "@heroui/react";

export const Route = createFileRoute("/setting")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError } = useGetMonitors();
  return (
    <div className="flex flex-col gap-2">
      <Breadcrumbs>
        <BreadcrumbItem href="/">ตารางข้อมูลวัดผล</BreadcrumbItem>
        <BreadcrumbItem>ตั้งค่าการรับข้อมูล</BreadcrumbItem>
      </Breadcrumbs>
      <PortSelection />
      <Card>
        <CardHeader>เครื่องที่เชื่อมต่ออยู่</CardHeader>
        <CardBody>
          {isLoading && <Skeleton className="h-14 rounded" />}
          {data && (
            <Listbox aria-label="Dynamic Actions" items={data} onAction={(key) => alert(key)}>
              {(item) => <ListboxItem key={item.id.toString()}>{item.port}</ListboxItem>}
            </Listbox>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
