import React from "react";
import { useGetPorts } from "@/hooks/use-setting";
import { addToast, Alert, Button, Card, CardBody, CardFooter, CardHeader, Select, Selection, SelectItem, Skeleton, Tooltip } from "@heroui/react";
import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { SelectMonitor } from "#/go/main/App";
import toast from "react-hot-toast";
import { toastMessage } from "@/constant/toast-message";

const PortSelection = () => {
  const { data, isLoading, isError, refetch } = useGetPorts();
  const ports = useMemo(() => {
    return data?.map((data) => ({
      port: data,
    }));
  }, [data]);
  const [port, setPort] = useState<string | null>(null);
  return (
    <Card>
      <CardHeader className="flex flex-row gap-2 justify-between">
        <span>พอร์ตการเชื่อมต่อ {port}</span>
        <Tooltip content={"รีโหลด"}>
          <Button onPress={() => refetch()} size="sm" isIconOnly>
            <RefreshCw size={18} />
          </Button>
        </Tooltip>
      </CardHeader>
      <CardBody>
        {isLoading && <Skeleton className="h-14 rounded" />}
        {data && (
          <Select
            selectedKeys={port ? [port] : []}
            items={ports}
            onSelectionChange={(keys: Selection) => {
              if (keys === "all") return;
              const keyList = Array.from(keys);
              if (keyList.length <= 0) {
                setPort(null);
                return;
              }
              setPort(keyList[0] as string);
            }}
            label="พอร์ตการเชื่อมต่อ"
            placeholder="เลือกพอร์ตการเชื่อมต่อ"
          >
            {(port) => <SelectItem key={port.port}>{port.port}</SelectItem>}
          </Select>
        )}
        {!isLoading && !data && <Alert color="danger">ไม่พบพอร์ตการเชื่อมต่อ</Alert>}
        {isError && <Alert color="danger">เกิดข้อผิดพลาดในการโหลดพอร์ตการเชื่อมต่อ</Alert>}
      </CardBody>
      <CardFooter>
        <Button
          isDisabled={!port}
          onPress={() => {
            if (!port) return;
            toast.promise(() => SelectMonitor(port), toastMessage);
          }}
        >
          เลือกพอร์ต
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortSelection;
