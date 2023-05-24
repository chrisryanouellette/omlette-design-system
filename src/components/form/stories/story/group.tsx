import { FC, useState } from "react";
import { bindTemplate } from "@Storybook/types";
import { DateInput } from "@Components/inputs/date";
import {
  Button,
  FinishEvent,
  FinishFailedEvent,
  Form,
  FormField,
  FormFields,
  FormGroup,
  IconButton,
  TextInput,
  ValidationAddError,
} from "@Components/index";
import { FormControls } from "../form.stories";

type Experience = {
  jobTitle: string;
  startData: string;
};

type GroupForm = {
  experience: FormFields<FormGroup<Experience>>;
};

function validation(
  field: FormField<string>,
  addError: ValidationAddError
): void {
  if (!field.value) {
    return addError("This field is required.");
  }
}

type ExperienceProps = {
  id: number;
  handleRemove: (id: number) => void;
};

function Experience({ handleRemove, id }: ExperienceProps): JSX.Element {
  return (
    <div className="flex flex-col">
      <Form.Group>
        <div className="flex gap-x-4 items-center">
          <Form.Item
            name="jobTitle"
            defaultValue="Test"
            validation={validation}
            wrapperProps={{ className: "flex-1" }}
          >
            <TextInput label="Job Title" />
          </Form.Item>
          <IconButton
            name="ri-close-circle-line"
            className="h-12 mt-6"
            onClick={(): void => handleRemove(id)}
          />
        </div>
        <Form.Item name="startDate" validation={validation}>
          <DateInput label="Start Date" />
        </Form.Item>
      </Form.Group>
    </div>
  );
}

export const GroupFormStory = bindTemplate<FC<FormControls<GroupForm>>>(
  ({ onFinish, onFinishFailed }): JSX.Element => {
    const [experienceCount, setExperienceCount] = useState<Set<number>>(
      new Set()
    );

    function handleAddExperience(): void {
      setExperienceCount(
        new Set(experienceCount.add(Math.round(Math.random() * 10000)))
      );
    }

    function handleRemoveExperience(id: number): void {
      experienceCount.delete(id);
      setExperienceCount(new Set(experienceCount));
    }

    function handleFinish(...rest: Parameters<FinishEvent<GroupForm>>): void {
      console.log(...rest);
      onFinish(...rest);
    }

    function handleFinishFailed(
      ...rest: Parameters<FinishFailedEvent<GroupForm>>
    ): void {
      console.log(...rest);
      onFinishFailed(...rest);
    }

    return (
      <main className="mt-4 md:mx-8">
        <h1 className="text-2xl">Enter your experience below</h1>
        <Form onFinish={handleFinish} onFinishFailed={handleFinishFailed}>
          <Form.Item name="experience">
            <Form.Group>
              <Form.Item
                name="jobTitle"
                defaultValue="Test"
                validation={validation}
                wrapperProps={{ className: "flex-1" }}
              >
                <TextInput label="Job Title" />
              </Form.Item>
              <Form.Item name="startDate" validation={validation}>
                <DateInput label="Start Date" />
              </Form.Item>
            </Form.Group>
            {Array.from(experienceCount).map(function renderExperience(id) {
              return (
                <Experience
                  key={id}
                  id={id}
                  handleRemove={handleRemoveExperience}
                />
              );
            })}
            <Button size="lg" type="button" onClick={handleAddExperience}>
              Add Experience
            </Button>
          </Form.Item>
          <Button size="lg">Submit</Button>
        </Form>
      </main>
    );
  }
);
