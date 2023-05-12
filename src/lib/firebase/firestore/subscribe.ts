import { FirestoreError, onSnapshot } from "firebase/firestore";
import { getFirestoreCollection } from "./get";
import {
  firestoreStore,
  getStoredFirestoreCollection,
  initializeFirestoreCollection,
} from "./store";

/**
 * Subscribes to all changes in a collection.
 *
 * @example
 * const userCollection = collection<User>("users");
 * userCollection.subscribe();
 */
export function subscribeToCollection(
  name: string,
  onError?: (error: FirestoreError) => void
): () => void {
  initializeFirestoreCollection(name, "loading");
  return onSnapshot(
    getFirestoreCollection(name),
    function handleSnapshotUpdate(updates) {
      const collection = getStoredFirestoreCollection(name);
      collection.status = "success";
      updates.docChanges().forEach((update) => {
        console.log(update.doc.id, update.type);
        if (update.type === "added") {
          collection.data[update.doc.id] = update.doc.data();
        } else if (update.type === "modified") {
          collection.data[update.doc.id] = update.doc.data();
        } else {
          delete collection.data[update.doc.id];
        }
      });
      firestoreStore.set({ [name]: collection });
    },
    function handleSnapshotError(error) {
      const collection = getStoredFirestoreCollection(name);
      collection.status = "error";
      firestoreStore.set({ [name]: collection });
      onError?.(error);
    }
  );
}
