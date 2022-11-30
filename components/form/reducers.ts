import { FormFields, GenericFields } from "./useForm";

export enum ReducerActions {
  register = "register",
  unregister = "unregister",
  set = "set",
  validate = "validate",
}

type RegisterFieldAction = {
  action: ReducerActions.register;
  value: {
    name: string;
    value: unknown;
    defaultValue: unknown;
  };
};

const register = (
  fields: FormFields<GenericFields>,
  action: RegisterFieldAction
): FormFields<GenericFields> => {
  return {
    ...fields,
    [action.value.name]: {
      value: action.value.value,
      defaultValue: action.value.defaultValue || null,
      touched: false,
      errors: new Set<string>(),
    },
  };
};

type UnRegisterFieldAction = {
  action: ReducerActions.unregister;
  value: {
    name: string;
  };
};

const unregister = (
  fields: FormFields<GenericFields>,
  action: UnRegisterFieldAction
): FormFields<GenericFields> => {
  if (!(action.value.name in fields)) {
    throw new Error(
      `Field "${action.value.name}" was unregistered but the fields does not exist.`
    );
  }
  delete fields[action.value.name];
  return { ...fields };
};

type SetFieldAction = {
  action: ReducerActions.set;
  value: {
    name: string;
    value: unknown;
  };
};

const set = (
  fields: FormFields<GenericFields>,
  action: SetFieldAction
): FormFields<GenericFields> => {
  const field = fields[action.value.name];

  if (!field) {
    throw new Error(
      `Field "${action.value.name}" was set but the field does not exist.`
    );
  }

  field.value = action.value.value;
  field.touched = true;

  return {
    ...fields,
    [action.value.name]: field,
  };
};

type ValidateFieldAction = {
  action: ReducerActions.validate;
  value: {
    name: string;
    errors: Set<string>;
  };
};

const validate = (
  fields: FormFields<GenericFields>,
  action: ValidateFieldAction
): FormFields<GenericFields> => {
  const field = fields[action.value.name];

  if (!field) {
    throw new Error(
      `Field "${action.value.name}" was set but the field does not exist.`
    );
  }

  field.errors = action.value.errors;

  return {
    ...fields,
    [action.value.name]: field,
  };
};

export type FormFieldsActions =
  | RegisterFieldAction
  | SetFieldAction
  | UnRegisterFieldAction
  | ValidateFieldAction;

const reducers: {
  [K in ReducerActions]: (
    fields: FormFields<GenericFields>,
    action: Extract<FormFieldsActions, { action: K }>
  ) => FormFields<GenericFields>;
} = {
  [ReducerActions.register]: register,
  [ReducerActions.unregister]: unregister,
  [ReducerActions.set]: set,
  [ReducerActions.validate]: validate,
};

export const fieldsReducer = <Fields extends GenericFields>(
  fields: FormFields<Fields>,
  action: FormFieldsActions
): FormFields<Fields> => {
  if (action.action in reducers) {
    const reducer = reducers[action.action] as (
      fields: FormFields<Fields>,
      action: FormFieldsActions
    ) => FormFields<Fields>;
    return reducer(fields, action);
  }
  throw new Error(
    `Action "${action.action}" is not a valid form fields reducer action.`
  );
};
