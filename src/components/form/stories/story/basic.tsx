import { FC } from "react";
import { bindTemplate } from "@Storybook/types";
import { Form, useForm, Validation } from "@Components/form";
import {
  Checkbox,
  TextInput,
  NumberInput,
  SelectInput,
  FileInput,
} from "@Components/inputs";
import { Button } from "@Components/button";
import { Container } from "@Components/container";
import { DateInput } from "@Components/inputs/date";
import { FormControls } from "../form.stories";

type BasicForm = {
  firstName: string;
  password: string;
  amount: number;
  date: string;
  select: string;
  multi: string[];
  group: [number, number];
  termsAndConditions: boolean;
  file: FileList;
  bpm: number[];
};

const firstNameValidation: Validation<BasicForm["firstName"]> = (
  field,
  addError
) => {
  if (!field.value) {
    addError("A value is required for field.");
  }
};

const passwordValidation: Validation<BasicForm["password"]> = (
  field,
  addError
) => {
  if (!field.value || field.value?.length < 5) {
    addError("The requirements where not met.");
  }
  if (!/[!@#$%^&*()]/g.test(field.value)) {
    addError("The requirements where not met.");
  }
};

const selectValidation: Validation<BasicForm["select"]> = (field, addError) => {
  if (!field.value) {
    addError("This field is required.");
  }
};

const termsAndConditionsValidation: Validation<
  BasicForm["termsAndConditions"]
> = (field, addError) => {
  if (field.value !== true) {
    addError("The terms must be agreed to.");
  }
};

const BasicFormStory = bindTemplate<FC<FormControls<BasicForm>>>((props) => {
  const form = useForm<BasicForm>();

  return (
    <Container placement="center">
      <Form {...props} form={form} className="light w-96">
        <div>
          <Form.Item
            required
            name="firstName"
            defaultValue="Omlette"
            validation={firstNameValidation}
          >
            <TextInput label="First Name" />
          </Form.Item>
        </div>
        <Form.Item required name="password" validation={passwordValidation}>
          <TextInput
            label="Password"
            inputProps={{ type: "password" }}
            helper={[
              "Must be at least 5 characters.",
              "Must contain a special character",
            ]}
          />
        </Form.Item>
        <Form.Item name="amount">
          <NumberInput label="Age" inputProps={{ min: 0, max: 99 }} />
        </Form.Item>
        <Form.Item name="date">
          <DateInput label="Start Date" />
        </Form.Item>
        <Form.Item name="select" required validation={selectValidation}>
          <SelectInput label="Favorite Animal">
            <SelectInput.Option value="dog">Dog</SelectInput.Option>
            <SelectInput.Option value="cat">Cat</SelectInput.Option>
            <SelectInput.Option value="parrot">Parrot</SelectInput.Option>
          </SelectInput>
        </Form.Item>
        <Form.Item name="multi">
          <SelectInput multiple label="Fun Programming Languages">
            <SelectInput.Option value="js">JS</SelectInput.Option>
            <SelectInput.Option value="dotnet">DotNet</SelectInput.Option>
            <SelectInput.Option value="groovy">Groovy</SelectInput.Option>
          </SelectInput>
        </Form.Item>
        <Form.Item name="file">
          <FileInput label="File Upload" disableClear />
        </Form.Item>
        <Form.Item
          required
          inline
          name="termsAndConditions"
          validation={termsAndConditionsValidation}
        >
          <Checkbox label="Terms and conditions" />
        </Form.Item>
        <Button
          type="submit"
          variant="secondary"
          size="md"
          className="w-full mt-8"
        >
          Submit
        </Button>
      </Form>
    </Container>
  );
});

export { BasicFormStory };
