import { useGetConfig, useSetDepartment, useSetName } from "@/hooks/use-setting";
import { Card, CardBody, CardHeader, Input, Skeleton, Spinner } from "@heroui/react";
import React from "react";

const CustomerInfoCardSetting = () => {
  const { data, isLoading } = useGetConfig();
  const { mutate: setName, isPending: isPendingSetName } = useSetName();
  const { mutate: setDepartment, isPending: isPendingSetDepartment } = useSetDepartment();
  return (
    <Card>
      <CardHeader>ข้อมูลหน่วยงาน</CardHeader>
      <CardBody className="gap-2">
        {isLoading ? (
          <>
            <Skeleton className="h-8" />
            <Skeleton className="h-8" />
          </>
        ) : (
          <>
            <Input
              labelPlacement="outside"
              defaultValue={data?.name}
              label={"โรงพยาบาล"}
              onValueChange={(value) => setName(value)}
              endContent={isPendingSetName && <Spinner />}
            />
            <Input
              labelPlacement="outside"
              defaultValue={data?.department}
              label={"หน่วยงาน"}
              onValueChange={(value) => setDepartment(value)}
              endContent={isPendingSetDepartment && <Spinner />}
            />
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default CustomerInfoCardSetting;
