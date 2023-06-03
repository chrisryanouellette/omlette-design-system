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

beforeEach(() => {
  finishMock.mockClear();
  finishFailedMock.mockClear();
  validationMock.mockClear();
});

describe("Form group component", () => {
  test("group can submit", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item name="outer">
          <Form.Group>
            <Form.Item name="inner">
              <TextInput label="Test" />
            </Form.Item>
          </Form.Group>
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "Name");
    await userEvent.click(screen.getByRole("button"));

    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "outer": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": {
            ":r2:": {
              "inner": {
                "defaultValue": null,
                "errors": Set {},
                "touched": true,
                "value": "Name",
              },
            },
          },
        },
      }
    `);
  });

  test("group can fail to submit", async () => {
    render(
      <Form>
        <Form.Item name="outer">
          <Form.Group>
            <Form.Item name="inner" validation={validationMock}>
              <TextInput label="Test" />
            </Form.Item>
          </Form.Group>
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));

    await screen.findByText("Error Message");
    expect(screen.getByText("Error Message")).toBeInTheDocument();
  });
});
