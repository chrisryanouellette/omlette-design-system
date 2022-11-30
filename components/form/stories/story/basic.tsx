import { FC } from "react";
import { FormControls } from "../form.stories";
import { bindTemplate } from "@Storybook/types";
import { Form, useForm, Validation } from "@Components/form";

type BasicForm = {
  firstName: string;
  lastName: string;
  termsAndConditions: boolean;
};

const firstNameValidation: Validation<BasicForm["firstName"]> = (
  field,
  addError
) => {
  if (!field.value) {
    addError("A value is required for field");
  }
  if (!field.value || field.value?.length < 5) {
    addError("Minimum length is 5 characters");
  }
};

const BasicFormStory = bindTemplate<FC<FormControls>>(() => {
  const form = useForm<BasicForm>();

  return (
    <Form form={form}>
      <Form.Item name="firstName" validation={firstNameValidation}>
        <label>Test</label>
        <input className="border border-red-500 m-4" />
      </Form.Item>
      <Form.Item name="lastName">
        <input className="border border-red-500 m-4" />
      </Form.Item>
      <Form.Item name="termsAndConditions">
        <input type="checkbox" />
      </Form.Item>
      <button type="submit">Submit</button>
    </Form>
  );
});

export { BasicFormStory };
