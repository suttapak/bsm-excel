import { useGetPorts } from "@/hooks/use-setting";
import { Alert, Button, Card, CardBody, CardHeader, Select, SelectItem, Skeleton, Tooltip } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/setting")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading, isError, refetch } = useGetPorts();
  const ports = useMemo(() => {
    return data?.map((data) => ({
      port: data,
    }));
  }, [data]);
  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader className="flex flex-row gap-2 justify-between">
          <span>พอร์ตการเชื่อมต่อ</span>
          <Tooltip content={"รีโหลด"}>
            <Button onPress={() => refetch()} size="sm" isIconOnly>
              <RefreshCw size={18} />
            </Button>
          </Tooltip>
        </CardHeader>
        <CardBody>
          {isLoading && <Skeleton className="h-14 rounded" />}
          {data && (
            <Select items={ports} label="พอร์ตการเชื่อมต่อ" placeholder="เลือกพอร์ตการเชื่อมต่อ">
              {(port) => <SelectItem key={port.port}>{port.port}</SelectItem>}
            </Select>
          )}
          {!isLoading && !data && <Alert color="danger">ไม่พบพอร์ตการเชื่อมต่อ</Alert>}
        </CardBody>
      </Card>
    </div>
  );
}
