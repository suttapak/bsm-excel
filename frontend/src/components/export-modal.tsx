import { useExporter } from "@/hooks/use-exporter";
import { Button, DateInput, DatePicker, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Download } from "lucide-react";
import { parseAbsolute, getLocalTimeZone, parseDate, CalendarDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { useState } from "react";

const ExportModal = () => {
  const { mutate: exporter, isPending: isLoadingExport } = useExporter();
  let formatterDateOnly = useDateFormatter({
    dateStyle: "short",
    timeZone: getLocalTimeZone(),
  });
  const date = new Date();
  const [value, setValue] = useState<CalendarDate | null>(new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate()));

  const { onOpen, ...modal } = useDisclosure();

  return (
    <div>
      <Button isLoading={isLoadingExport} onPress={onOpen} startContent={<Download />}>
        ส่งออกข้อมูล
      </Button>
      <Modal {...modal}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>ส่งออกข้อมูล</ModalHeader>
              <ModalBody>
                <DatePicker value={value} onChange={setValue} label="เลือกวันที่ดาวโหลด" />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  isLoading={isLoadingExport}
                  onPress={() => {
                    exporter(value?.toDate(getLocalTimeZone()) || new Date());
                    onClose();
                  }}
                >
                  ส่งออก
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ExportModal;
