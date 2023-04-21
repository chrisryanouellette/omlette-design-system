import { Meta, StoryObj } from "@storybook/react";
import { ControlTypes } from "@Storybook/types";
import {
  Button,
  FileInput,
  FileInputProps,
  Form,
  FormProps,
} from "@Components/index";

type ExampleForm = {
  file: FileList;
};

type FileUploadStoryProps = {
  label: FileInputProps["label"];
  onFinish: FormProps<ExampleForm>["onFinish"];
  onFinishFailed: FormProps<ExampleForm>["onFinishFailed"];
};

function FileUploadStory({
  onFinish,
  onFinishFailed,
  ...rest
}: FileUploadStoryProps): JSX.Element {
  return (
    <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
      <Form.Item name="file">
        <FileInput {...rest} />
      </Form.Item>
      <Button size="lg">Submit</Button>
    </Form>
  );
}

const meta = {
  title: "Components/Inputs/File",
  component: FileUploadStory,
  parameters: { controls: { sort: "alpha" } },
} satisfies Meta<typeof FileUploadStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const File: Story = {
  argTypes: {
    label: {
      control: { type: ControlTypes.String },
    },
    onFinish: { action: "onFinish", table: { disable: true } },
    onFinishFailed: { action: "onFinishFailed", table: { disable: true } },
  },
  args: {
    label: "Upload a file",
  } as FileUploadStoryProps,
};
