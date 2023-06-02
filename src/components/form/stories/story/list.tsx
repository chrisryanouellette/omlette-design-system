import { FC, useEffect, useState } from "react";
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

export const ListFormStory = bindTemplate<FC<FormControls<ListForm>>>(
  ({ onFinish, onFinishFailed }): JSX.Element => {
    const form = Form.useForm<ListForm>();
    const list = Form.useFormList(form, "items");

    function handleFinish(...rest: Parameters<FinishEvent<ListForm>>): void {
      console.log(...rest);
      onFinish(...rest);
    }

    function handleFinishFailed(
      ...rest: Parameters<FinishFailedEvent<ListForm>>
    ): void {
      console.log(...rest);
      onFinishFailed(...rest);
    }

    return (
      <Container className="mt-4 md:mx-auto">
        <h1 className="text-2xl">Checklist</h1>
        <Form
          form={form}
          className="flex flex-col gap-y-4"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <Form.List name="items" defaultValue={[""]}>
            {list.map((item: string) => (
              <div key={item} className="flex w-full items gap-x-4 items-end">
                <Form.ListItem validation={validation}>
                  <TextInput label="Item" />
                </Form.ListItem>
                <ChildOrNull condition={list.items.size > 1}>
                  <IconButton
                    name="ri-close-circle-line"
                    size="sm"
                    className="mb-1"
                    onClick={(): void => list.remove(item)}
                  />
                </ChildOrNull>
              </div>
            ))}
          </Form.List>
          <Button size="lg" type="button" onClick={list.add}>
            Add Item
          </Button>
          <Button size="lg">Submit</Button>
        </Form>
      </Container>
    );
  }
);
