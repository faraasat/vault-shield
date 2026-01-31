"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { StorageService } from "@/services/storage";

interface IdentityContextType {
  identity: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const IdentityContext = createContext<IdentityContextType | undefined>(
  undefined,
);

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<string | null>(null);

  // Check if session persisted
  useEffect(() => {
    const saved = localStorage.getItem("vs_connected");
    if (saved === "true") {
      StorageService.getProfile().then((p) => {
        if (p?.name) setIdentity(p.name);
      });
    }
  }, []);

  const connect = async () => {
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 800));
    const profile = await StorageService.getOrInitIdentity();
    if (profile.name) {
      setIdentity(profile.name);
      localStorage.setItem("vs_connected", "true");
    }
  };

  const disconnect = () => {
    setIdentity(null);
    localStorage.removeItem("vs_connected");
  };

  return (
    <IdentityContext.Provider
      value={{ identity, isConnected: !!identity, connect, disconnect }}
    >
      {children}
    </IdentityContext.Provider>
  );
}

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (context === undefined) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }
  return context;
}
