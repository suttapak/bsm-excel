import { Badge, Button, Skeleton, Spinner, Tooltip } from "@heroui/react";
import { MonitorPlay, MonitorStop } from "lucide-react";
import React from "react";
export type RunningLedProps = {
  isRunning: boolean;
  isLoading?: boolean;
  badge?: React.ReactNode | string;
};
const RunningLed = (props: RunningLedProps) => {
  const { isRunning, isLoading, badge } = props;
  if (isLoading) return <Skeleton className="h-8 w-8 rounded" />;
  return (
    <React.Fragment>
      <Tooltip
        content={
          isRunning
            ? `กำลังอ่านข้อมูลอยู่ ${badge} เครื่อง`
            : "ไม่มีการเชื่อต่อ"
        }
      >
        s
        <Button isIconOnly size="sm" color={isRunning ? "success" : "default"}>
          {isRunning ? (
            <>
              <Spinner color="danger" size="sm" variant="simple" />
            </>
          ) : (
            <MonitorStop size={18} />
          )}
        </Button>
      </Tooltip>
    </React.Fragment>
  );
};
export default RunningLed;
