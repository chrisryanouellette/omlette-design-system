import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  Form,
  FormField,
  TextInput,
  ValidationAddError,
} from "@Components/index";

const finishMock = jest.fn();
const finishFailedMock = jest.fn();
const validationMock = jest.fn(
  (field: FormField<string>, addError: ValidationAddError) => {
    if (field.value === "ERROR") {
      addError("Error Message");
    }
  }
);
const validationMockTwo = jest.fn(
  (field: FormField<string>, addError: ValidationAddError) => {
    if (field.value === "ERROR") {
      addError("Second failure message");
    }
  }
);

beforeEach(() => {
  finishMock.mockClear();
  finishFailedMock.mockClear();
  validationMock.mockClear();
  validationMockTwo.mockClear();
});

describe("Form component", () => {
  test("can have a defaultValue", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item defaultValue="Name" name="test">
          <TextInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": "Name",
          "errors": Set {},
          "touched": false,
          "value": "Name",
        },
      }
    `);
  });

  test("can be submitted", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item name="test">
          <TextInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "Name");
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": "Name",
        },
      }
    `);
  });

  test("can fail to submit", async () => {
    render(
      <Form onFinish={finishMock} onFinishFailed={finishFailedMock}>
        <Form.Item name="test" validation={validationMock}>
          <TextInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));
    await screen.findByText("Error Message");
    expect(screen.getByText("Error Message")).toBeInTheDocument();
  });

  test("can fail with multiple validation function", async () => {
    render(
      <Form onFinish={finishMock} onFinishFailed={finishFailedMock}>
        <Form.Item name="test" validation={[validationMock, validationMockTwo]}>
          <TextInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));
    await screen.findByText("Error Message");
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(screen.getByText("Second failure message")).toBeInTheDocument();
  });

  test("can fail to submit then succeed to submit", async () => {
    render(
      <Form onFinish={finishMock} onFinishFailed={finishFailedMock}>
        <Form.Item name="test" validation={validationMock}>
          <TextInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));
    await screen.findByText("Error Message");
    expect(screen.getByText("Error Message")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/test/i), "Name");
    await userEvent.click(screen.getByRole("button"));

    expect(screen.queryByText("Error Message")).not.toBeInTheDocument();
  });
});
