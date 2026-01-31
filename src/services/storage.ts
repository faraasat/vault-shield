import { openDB, DBSchema, IDBPDatabase } from "idb";

interface UserProfile {
  id: string; // 'default'
  name?: string;
  hasRedactedDocs: number;
  balanceProofGenerated: boolean;
  createdAt: number;
}

interface UserAsset {
  id: string;
  type: "proof" | "document";
  content: unknown; // Encrypted blob or Proof object
  createdAt: number;
}

interface VaultSchema extends DBSchema {
  profile: {
    key: string;
    value: UserProfile;
  };
  assets: {
    key: string;
    value: UserAsset;
    indexes: { "by-date": number };
  };
}

const DB_NAME = "vault-shield-db";
const DB_VERSION = 1;

export const initDB = async (): Promise<IDBPDatabase<VaultSchema>> => {
  return openDB<VaultSchema>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("profile")) {
        db.createObjectStore("profile", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("assets")) {
        const assetStore = db.createObjectStore("assets", { keyPath: "id" });
        assetStore.createIndex("by-date", "createdAt");
      }
    },
  });
};

export const StorageService = {
  async getProfile(): Promise<UserProfile | undefined> {
    const db = await initDB();
    return db.get("profile", "default");
  },

  // Generates a random "0x" address if one doesn't exist
  async getOrInitIdentity(): Promise<UserProfile> {
    const db = await initDB();
    let profile = await db.get("profile", "default");

    if (!profile) {
      // Simulate a wallet address
      const randomWallet =
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16),
        ).join("");

      const newProfile: UserProfile = {
        id: "default",
        name: randomWallet, // Use wallet as name
        hasRedactedDocs: 0,
        balanceProofGenerated: false,
        createdAt: Date.now(),
      };
      await db.put("profile", newProfile);
      return newProfile;
    }

    return profile;
  },

  async saveProfile(profile: Partial<UserProfile>) {
    const db = await initDB();
    const existing = await db.get("profile", "default");
    const updated: UserProfile = {
      id: "default",
      createdAt: Date.now(),
      hasRedactedDocs: 0,
      balanceProofGenerated: false,
      ...existing,
      ...profile,
    };
    await db.put("profile", updated);
    return updated;
  },

  async addAsset(asset: UserAsset) {
    const db = await initDB();
    await db.put("assets", asset);
  },

  async getAssets() {
    const db = await initDB();
    return db.getAllFromIndex("assets", "by-date");
  },

  async getAssetsByType(type: "proof" | "document") {
    const assets = await this.getAssets();
    return assets.filter((a) => a.type === type);
  },
};
