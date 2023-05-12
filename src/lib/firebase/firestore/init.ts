import { getFirestore, Firestore } from "firebase/firestore";

import { firebaseClient, subscribeToFirebaseClientInit } from "../initialize";

/** A database instance that is set once the client is initialized */
export let firestore: Firestore;

subscribeToFirebaseClientInit(() => {
  firestore = getFirestore(firebaseClient);
});
