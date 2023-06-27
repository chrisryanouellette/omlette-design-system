import { useEffect, useState } from "react";
import { DocumentData } from "firebase/firestore";
import { SelectorFn, createGlobalStore, useStore } from "@Utilities/index";

type Status = "idle" | "loading" | "success" | "error";

export type FirestoreDocument<T extends DocumentData> = {
  [id: string]: T;
};

export type FirestoreCollection<T extends DocumentData> = {
  data: FirestoreDocument<T>;
  status: Status;
};

type FirestoreData = {
  [index: string]: FirestoreCollection<any>;
};

export const firestoreStore = createGlobalStore<FirestoreData>({});

export function initializeFirestoreCollection(
  name: string,
  status: Status = "idle"
): void {
  const state = firestoreStore.get();
  if (!state[name]) {
    firestoreStore.set({ [name]: { data: {}, status: status } });
  }
}

/** Returns a reference to a collection in Firestore */
export function getStoredFirestoreCollection<T extends DocumentData>(
  name: string
): FirestoreCollection<T> {
  const collection = firestoreStore.get()[name];

  if (!collection) {
    throw new Error(`Firestore store does not container collection "${name}"`);
  }

  return collection;
}

/** Listens to changes on an entire collection of documents */
export function useFirestoreCollection<
  State extends DocumentData,
  Selected = FirestoreCollection<State>
>(
  name: string,
  selector: SelectorFn<FirestoreDocument<State>, Selected>
): Selected {
  initializeFirestoreCollection(name);
  return useStore<FirestoreData, Selected>(
    firestoreStore,
    function selectFirebaseCollection(state: FirestoreData, prev): Selected {
      const collection = state[name];
      return selector
        ? selector(collection.data, prev)
        : (collection as Selected);
    }
  );
}

export function useFirestoreCollectionStatus<State extends DocumentData>(
  name: string
): Status {
  initializeFirestoreCollection(name);
  return useStore(
    firestoreStore,
    function selectFirebaseCollectionError(): Status {
      const collection = getStoredFirestoreCollection<State>(name);
      return collection.status;
    }
  );
}

/** Listens to changes on a singular firestore document */
export function useFirestoreDoc<State extends DocumentData, Selected = State>(
  name: string,
  id: string,
  selector?: SelectorFn<State, Selected>
): Selected {
  const [state, setState] = useState<State | Selected>(
    function useFirestoreDocStateInitializer() {
      const doc = getStoredFirestoreCollection<State>(name).data[id];
      return selector ? selector(doc, null) : doc;
    }
  );

  useEffect(
    function setupCollectionSubscription() {
      return firestoreStore.subscribe(function handleCollectionUpdate(
        collections
      ) {
        const update = collections[name].data[id];
        setState(function handleUpdateDocumentState(prev) {
          return selector ? selector(update, prev as Selected) : update;
        });
      });
    },
    [id, name, selector]
  );

  return state as Selected;
}
