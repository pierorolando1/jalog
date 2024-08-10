import { NextUIProvider } from "@nextui-org/system";
import { useNavigate } from "react-router-dom";
import { useModal } from "./stores/stores";

import { Modal, ModalContent } from "@nextui-org/modal"
import {Spinner} from "@nextui-org/spinner";


export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const { isOpen } = useModal()

  return (

    <NextUIProvider navigate={navigate}>
    {
      children
    }
    <Modal hideCloseButton backdrop="blur" isOpen={isOpen} onOpenChange={()=>{}}>
      <ModalContent>
      {() => (
        <div className="w-full h-full flex items-center justify-center" style={{ padding: '5rem' }}>
         <Spinner />
        </div>
      )}
      </ModalContent>
    </Modal>
    </NextUIProvider>
  );
}
