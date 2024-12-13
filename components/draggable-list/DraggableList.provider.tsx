import { createContext, useState } from "react";

const DraggableListContext = createContext({});

export const DraggableListProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState([]);
  return (
    <DraggableListContext.Provider value={{ data, setData }}>
      {children}
    </DraggableListContext.Provider>
  );
};
