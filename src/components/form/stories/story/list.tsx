import { FC, MouseEvent, useState } from "react";
import { bindTemplate } from "@Storybook/types";
import {
  Button,
  Container,
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
  field: FormField<string | null>,
  addError: ValidationAddError
): void {
  if (!field.value) {
    return addError("This field is required.");
  }
}

export const ListFormStory = bindTemplate<FC<FormControls<ListForm>>>(
  ({ onFinish, onFinishFailed }): JSX.Element => {
    const form = Form.useForm<ListForm>();
    const [defaultState, setDefaultState] = useState<(string | null)[]>([
      "A",
      "B",
      "C",
    ]);

    function handleAdd(): void {
      setDefaultState([...defaultState, null]);
    }

    function handleRemove(e: MouseEvent<HTMLButtonElement>): void {
      const index = Number(e.currentTarget.dataset.index);
      if (isNaN(index)) {
        throw new Error(`Cannot remove list item at index "${index}"`);
      }
      defaultState.splice(index, 1);
      setDefaultState([...defaultState]);
    }

    return (
      <Container className="mt-4 md:mx-auto">
        <h1 className="text-2xl">Checklist</h1>
        <Form
          className="flex flex-col gap-y-2"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.List name="a">
            <Form.List name="b">
              <Form.List name="c-1">
                {defaultState.map((i, index) => (
                  <div className="flex gap-4" key={i}>
                    <Form.ListItem
                      defaultValue={i}
                      validation={validation}
                      wrapperProps={{ className: "flex-1" }}
                    >
                      <TextInput label={`Nested ${i}`} />
                    </Form.ListItem>
                    <IconButton
                      className="mt-6 h-9 w-9"
                      data-index={index}
                      name="ri-close-circle-line"
                      size="sm"
                      type="button"
                      onClick={handleRemove}
                    />
                  </div>
                ))}
                <Button type="button" onClick={handleAdd}>
                  Add
                </Button>
              </Form.List>
              <Form.List name="c-2">
                <Form.ListItem>
                  <TextInput label="Nested" />
                </Form.ListItem>
              </Form.List>
            </Form.List>
          </Form.List>
          <Button size="lg">Submit</Button>
        </Form>
      </Container>
    );
  }
);
