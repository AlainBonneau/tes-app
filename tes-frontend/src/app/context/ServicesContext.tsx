"use client";

import { createContext, useContext, useMemo } from "react";
import { appServices, type AppServices } from "@/app/services";

const ServicesContext = createContext<AppServices>(appServices);

export function ServicesProvider({ children }: { children: React.ReactNode }) {
  const services = useMemo(() => appServices, []);
  return (
    <ServicesContext.Provider value={services}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices(): AppServices {
  return useContext(ServicesContext);
}

