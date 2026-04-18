import { createContext, useContext, useState } from 'react';

const NexContext = createContext(null);

export function NexProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <NexContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </NexContext.Provider>
  );
}

export function useNex() {
  return useContext(NexContext);
}
