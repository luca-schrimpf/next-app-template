import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import React from "react";

const OpenHintDialog = ({ hintText }: { hintText: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        className="mt-4 text-muted"
        size="sm"
        variant="bordered"
        startContent={<QuestionMarkCircleIcon className="h-5 w-5 text-muted" />}
        onPress={onOpen}
      >
        Hinweis anzeigen
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-end gap-1 ">
                <QuestionMarkCircleIcon className="w-6 h-6 mb-0.5" /> Hinweis
              </ModalHeader>
              <ModalBody>
                <p className="text-muted">{hintText}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Schließen
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OpenHintDialog;
