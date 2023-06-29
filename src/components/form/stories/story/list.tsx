import { FC, MouseEvent } from "react";
import { bindTemplate } from "@Storybook/types";
import {
  Button,
  ChildOrNull,
  Container,
  FinishEvent,
  FinishFailedEvent,
  Form,
  FormField,
  IconButton,
  TextInput,
  ValidationAddError,
} from "@Components/index";
import { FormControls } from "../form.stories";

type ListForm = {
  items: string[];
};

function validation(
  field: FormField<boolean>,
  addError: ValidationAddError
): void {
  if (!field.value) {
    return addError("This field is required.");
  }
}

const initial = ["A", "B"];

export const ListFormStory = bindTemplate<FC<FormControls<ListForm>>>(
  ({ onFinish, onFinishFailed }): JSX.Element => {
    const form = Form.useForm<ListForm>();

    function handleRemove(e: MouseEvent<HTMLButtonElement>): void {
      // list.remove(e.currentTarget.id);
    }

    function handleFinish(...rest: Parameters<FinishEvent<ListForm>>): void {
      console.log(...rest);
      onFinish?.(...rest);
    }

    function handleFinishFailed(
      ...rest: Parameters<FinishFailedEvent<ListForm>>
    ): void {
      console.log(...rest);
      onFinishFailed?.(...rest);
    }

    return (
      <Container className="mt-4 md:mx-auto">
        <h1 className="text-2xl">Checklist</h1>
        <Form
          form={form}
          className="flex flex-col gap-y-2"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <Form.List name="items" defaultValue={initial}>
            {({ fields, id }): JSX.Element => (
              <div key={id} className="flex w-full items gap-x-4 items-start">
                <Form.ListItem validation={validation}>
                  <TextInput label="Item" />
                </Form.ListItem>
                <ChildOrNull condition={Object.values(fields).length > 1}>
                  <IconButton
                    id={id}
                    name="ri-close-circle-line"
                    size="sm"
                    className="mt-6"
                    onClick={handleRemove}
                  />
                </ChildOrNull>
              </div>
            )}
            {/* <Button size="lg" type="button" onClick={list.add}>
            Add Item
          </Button> */}
          </Form.List>

          <Button size="lg">Submit</Button>
        </Form>
      </Container>
    );
  }
);
