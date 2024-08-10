import { create } from "zustand";

type Store = {
  isOpen: boolean 
  toogle: () => void
  open: () => void
  close: () => void
}

export const useModal = create<Store>((set) => ({
  isOpen: false,
  toogle: () => set((state) => ({ isOpen: !state.isOpen })),
  open: () => set(() => ({ isOpen: true })),
  close: () => set(() => ({ isOpen: false}))
}))

