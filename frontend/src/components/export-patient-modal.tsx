import { useExporter, useExporterPatient } from "@/hooks/use-exporter";
import { Button, DateInput, DatePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Download } from "lucide-react";
import { parseAbsolute, getLocalTimeZone, parseDate, CalendarDate } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
import { useState } from "react";

export type ExportPatientModalProps = {
  patien_id: string;
  full_name: string;
};

const ExportPatientModal = ({ patien_id, full_name }: ExportPatientModalProps) => {
  const { mutate: exporter, isPending: isLoadingExport } = useExporterPatient(patien_id);

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
                <Input isReadOnly labelPlacement="outside" label={"หมายเลขประจำตัวผู้รับบริการ"} value={patien_id} />
                <Input labelPlacement="outside" label={"ชื่อ-นามสกุลผู้รับบริการ"} value={full_name} />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  isLoading={isLoadingExport}
                  onPress={() => {
                    exporter();
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

export default ExportPatientModal;
