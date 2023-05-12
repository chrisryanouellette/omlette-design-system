import { useCallback, useEffect } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { isUniqueSet } from "@Utilities/index";
import {
  Button,
  ChildOrNull,
  FinishEvent,
  Form,
  FormField,
  FormFields,
  Icon,
  TextInput,
  ValidationAddError,
} from "@Components/index";
import {
  FirestoreDocument,
  initClientEmulators,
  initializeFirebaseClient,
  useFirestoreCollection,
  useFirestoreDoc,
  useFirestoreCollectionStatus,
  collection,
} from "@Lib";

try {
  /* Initialization would normally be handled in the root of the app */
  initializeFirebaseClient({
    apiKey: process.env.PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
  });

  if (window.location.hostname === "localhost") {
    initClientEmulators({ enableAuth: true, enableFirestore: true });
  } else {
    throw new Error(
      `Testing and developing the Firestore API can only be done locally.`
    );
  }
} catch (error) {
  console.warn("Unable to setup local emulators. See error below");
  console.error(error);
}

type User = {
  name: string;
};

const collections = {
  users: "users",
} as const;

const usersCollection = collection<User>(collections.users);

function validateNameField(
  field: FormField<string>,
  addError: ValidationAddError
): void {
  if (!field.value?.trim()) {
    return addError(`The name field is required.`);
  }
}

function handleFinish(fields: FormFields<User>): void {
  usersCollection.create({ name: fields.name.value });
}

function NewUser(): JSX.Element {
  const form = Form.useForm<User>();

  return (
    <Form form={form} onFinish={handleFinish}>
      <h2>Create new user</h2>
      <Form.Item name="name" validation={validateNameField}>
        <TextInput label="Name" />
      </Form.Item>
      <Button size="lg" className="mt-2">
        Create
      </Button>
    </Form>
  );
}

type UserProps = {
  id: string;
};

function User({ id }: UserProps): JSX.Element {
  const doc = useFirestoreDoc<User>(collections.users, id);

  const handleDelete = useCallback<() => void>(() => {
    usersCollection.delete(id);
  }, [id]);

  const handleFinish = useCallback<FinishEvent<User>>(
    (fields) => {
      usersCollection.update(id, { name: fields.name.value });
    },
    [id]
  );

  return (
    <Form className="mb-4" onFinish={handleFinish}>
      <h2>Edit user {id}</h2>
      <Form.Item
        name="name"
        defaultValue={doc.name}
        wrapperProps={{ className: "mb-2" }}
        validation={validateNameField}
      >
        <TextInput label="Name" />
      </Form.Item>
      <Button size="lg">Update</Button>
      <Button type="button" size="lg" className="ml-4" onClick={handleDelete}>
        Delete
      </Button>
    </Form>
  );
}

function collectionSelector(
  state: FirestoreDocument<User>,
  prev: Set<string> | null
): Set<string> {
  const ids = new Set(Object.keys(state));
  if (!prev || isUniqueSet(ids, prev)) {
    return new Set(ids);
  }
  return prev;
}

function Firestore(): JSX.Element {
  const ids = useFirestoreCollection(collections.users, collectionSelector);
  const status = useFirestoreCollectionStatus(collections.users);

  useEffect(() => {
    return usersCollection.subscribe();
  }, []);

  if (window.location.hostname !== "localhost") {
    return (
      <p className="flex text-xl items-center gap-4">
        <Icon name="ri-error-warning-line" />
        Testing the Firestore API can only be done locally.
      </p>
    );
  }

  return (
    <div>
      <ChildOrNull condition={status === "loading"}>
        <p>Loading</p>
      </ChildOrNull>
      <ChildOrNull condition={status === "error"}>
        <p>Error</p>
      </ChildOrNull>
      <ChildOrNull condition={!ids.size && status === "success"}>
        <p>No users found</p>
      </ChildOrNull>
      {Array.from(ids).map((id) => (
        <User key={id} id={id} />
      ))}
      <NewUser />
    </div>
  );
}

const meta = {
  title: "Libraries/Firebase/Firestore",
  component: Firestore,
  parameters: { controls: { sort: "alpha" } },
} satisfies Meta<typeof Firestore>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Example: Story = {};
