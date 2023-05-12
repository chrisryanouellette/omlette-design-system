import {
  DocumentData,
  DocumentReference,
  SetOptions,
  addDoc,
  doc,
  setDoc as firestoreSetDoc,
  deleteDoc as deleteFirestoreDoc,
} from "firebase/firestore";
import { getFirestoreCollection } from "./get";

export async function createDoc<T extends DocumentData>(
  name: string,
  data: T
): Promise<DocumentReference<T>> {
  const collection = getFirestoreCollection<T>(name);
  return await addDoc<T>(collection, data);
}

export async function setDoc<T extends DocumentData>(
  name: string,
  id: string,
  data: T,
  option: SetOptions = {}
): Promise<void> {
  const collection = getFirestoreCollection<T>(name);
  return await firestoreSetDoc<T>(doc(collection, id), data, option);
}

export async function updateDoc<T extends DocumentData>(
  name: string,
  id: string,
  data: T,
  option: SetOptions = {}
): Promise<void> {
  const collection = getFirestoreCollection<T>(name);
  return await firestoreSetDoc<T>(doc(collection, id), data, {
    ...option,
    merge: true,
  });
}

export async function deleteDoc(name: string, id: string): Promise<void> {
  const collection = getFirestoreCollection(name);
  return await deleteFirestoreDoc(doc(collection, id));
}
