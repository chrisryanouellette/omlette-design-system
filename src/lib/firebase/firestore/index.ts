import { DocumentData } from "firebase/firestore";
import { createDoc, setDoc, deleteDoc, updateDoc } from "./mutate";
import { subscribeToCollection } from "./subscribe";

export * from "./init";
export * from "./store";
export { subscribeToCollection };
export { createDoc, setDoc, deleteDoc, updateDoc };

type CollectionMethods<T extends DocumentData> = {
  subscribe: () => ReturnType<typeof subscribeToCollection>;
  create: (data: T) => ReturnType<typeof createDoc>;
  update: (id: string, data: T) => ReturnType<typeof updateDoc>;
  delete: (id: string) => ReturnType<typeof deleteDoc>;
};

export function collection<T extends DocumentData>(
  name: string
): CollectionMethods<T> {
  return {
    subscribe: function (): ReturnType<typeof subscribeToCollection> {
      return subscribeToCollection(name);
    },
    create: function (data: T): ReturnType<typeof createDoc> {
      return createDoc<T>(name, data);
    },
    update: function (id: string, data: T): ReturnType<typeof updateDoc> {
      return updateDoc<T>(name, id, data);
    },
    delete: function (id: string): ReturnType<typeof deleteDoc> {
      return deleteDoc(name, id);
    },
  };
}
