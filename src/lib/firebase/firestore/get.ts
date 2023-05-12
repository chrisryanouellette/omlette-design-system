import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  collection,
  doc,
  getFirestore,
} from "firebase/firestore";
import { firebaseClient } from "../initialize";

export function getFirestoreCollection<T extends DocumentData>(
  collectionName: string
): CollectionReference<T> {
  const db = getFirestore(firebaseClient);
  return collection(db, collectionName) as CollectionReference<T>;
}

export function getFirestoreDoc<T extends DocumentData>(
  name: string,
  id?: string
): DocumentReference<T> {
  const db = getFirestore(firebaseClient);
  return (id ? doc(db, name, id) : doc(db, name)) as DocumentReference<T>;
}
