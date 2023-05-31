import { FC, useEffect, useState } from "react";
import { bindTemplate } from "@Storybook/types";
import {
  Button,
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
    const [itemCount, setItemCount] = useState<Set<number>>(new Set());

    function handleAdd(): void {
      setItemCount(new Set(itemCount.add(Math.round(Math.random() * 10000))));
    }

    function handleRemove(id: number): void {
      itemCount.delete(id);
      setItemCount(new Set(itemCount));
    }

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

    useEffect(() => {
      if (form.fields.get().items) {
        form.setDefault("items", ["Hello", "From", "Lists"]);
        const ids = [true, true].map(() => Math.round(Math.random() * 10000));
        setItemCount(new Set(ids));
      }
    }, [form]);

    return (
      <Container className="mt-4 md:mx-auto">
        <h1 className="text-2xl">Checklist</h1>
        <Form
          form={form}
          className="flex flex-col gap-y-4"
          onFinish={handleFinish}
          onFinishFailed={handleFinishFailed}
        >
          <Form.List name="items">
            <Form.ListItem validation={validation}>
              <TextInput label="Item 1" />
            </Form.ListItem>
            {Array.from(itemCount).map(function renderItem(id, index) {
              return (
                <div key={id} className="flex w-full items gap-x-4">
                  <Form.ListItem
                    validation={validation}
                    wrapperProps={{ className: "flex-1" }}
                  >
                    <TextInput label={`Item ${index + 2}`} />
                  </Form.ListItem>
                  <IconButton
                    name="ri-close-circle-line"
                    size="sm"
                    onClick={(): void => handleRemove(id)}
                  />
                </div>
              );
            })}
            <Button size="lg" type="button" onClick={handleAdd}>
              Add Item
            </Button>
          </Form.List>
          <Button size="lg">Submit</Button>
        </Form>
      </Container>
    );
  }
);
