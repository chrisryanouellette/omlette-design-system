import { createContext, useContext } from "react";
import { UseCollapse } from "./useCollapse";

type CollapseContextType = UseCollapse;

const CollapseContext = createContext<CollapseContextType | null>(null);

const useCollapseContext = (): CollapseContextType => {
  const context = useContext(CollapseContext);

  if (!context) {
    throw new Error(
      "useCollapseContext must be used within a <CollapseContext.Provider>"
    );
  }

  return context;
};

export { CollapseContext, useCollapseContext };
