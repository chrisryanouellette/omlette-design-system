import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  Form,
  FormField,
  FormList,
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
      addError("Second error message");
    }
  }
);
const listValidationMock = jest.fn(
  (field: FormField<FormList<string>>, addError: ValidationAddError) => {
    if (field.value[0].value === "ERROR") {
      addError("Error Message");
    }
  }
);

beforeEach(() => {
  finishMock.mockClear();
  finishFailedMock.mockClear();
  validationMock.mockClear();
});

describe("Form list component", () => {
  test("list can submit", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.List name="test">
          <Form.ListItem>
            <TextInput label="Test" />
          </Form.ListItem>
        </Form.List>
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
          "value": [
            {
              "defaultValue": null,
              "errors": Set {},
              "touched": true,
              "value": "Name",
            },
          ],
        },
      }
    `);
  });

  test("list can fail to submit when validating input", async () => {
    render(
      <Form>
        <Form.List name="test">
          <Form.ListItem validation={validationMock}>
            <TextInput label="Test" />
          </Form.ListItem>
        </Form.List>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));

    await screen.findByText("Error Message");
    expect(screen.getByText("Error Message")).toBeInTheDocument();
  });

  test("list item can have multiple validate functions", async () => {
    const validationMocks = [validationMock, validationMockTwo];
    render(
      <Form>
        <Form.List name="test">
          <Form.ListItem validation={validationMocks}>
            <TextInput label="Test" />
          </Form.ListItem>
        </Form.List>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));
    await screen.findByText("Error Message");
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(screen.getByText("Second error message")).toBeInTheDocument();
  });

  test("list can fail to submit when validating list", async () => {
    render(
      <Form onFinishFailed={finishFailedMock}>
        <Form.List name="test" validation={listValidationMock}>
          <Form.ListItem>
            <TextInput label="Test" />
          </Form.ListItem>
        </Form.List>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "ERROR");
    await userEvent.click(screen.getByRole("button"));

    expect(listValidationMock.mock.calls.length).toBe(1);
    expect(finishFailedMock.mock.calls.length).toBe(1);
    expect(finishFailedMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      [
        "test",
      ]
    `);
    expect(finishFailedMock.mock.calls[0][1]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": null,
          "errors": Set {
            "Error Message",
          },
          "touched": true,
          "value": [
            {
              "defaultValue": null,
              "errors": Set {},
              "touched": true,
              "value": "ERROR",
            },
          ],
        },
      }
    `);
  });

  test("can have nested lists", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.List name="outer">
          <Form.List name="inner">
            <Form.ListItem>
              <TextInput label="Test" />
            </Form.ListItem>
          </Form.List>
        </Form.List>
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
          "value": [
            {
              "defaultValue": null,
              "errors": Set {},
              "touched": true,
              "value": [
                {
                  "defaultValue": null,
                  "errors": Set {},
                  "touched": true,
                  "value": "Name",
                },
              ],
            },
          ],
        },
      }
    `);
  });

  test("can have default value", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.List name="outer">
          <Form.ListItem defaultValue="DEFAULT">
            <TextInput label="Test" />
          </Form.ListItem>
        </Form.List>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByLabelText("Test")).toHaveValue("DEFAULT");
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "outer": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": [
            {
              "defaultValue": "DEFAULT",
              "errors": Set {},
              "touched": false,
              "value": "DEFAULT",
            },
          ],
        },
      }
    `);
  });

  test("can have default value set via the form hook", async () => {
    const { result } = renderHook(() => Form.useForm());
    render(
      <Form form={result.current} onFinish={finishMock}>
        <Form.List name="outer">
          <Form.ListItem>
            <TextInput label="Test" />
          </Form.ListItem>
          <Form.ListItem>
            <TextInput label="Test Two" />
          </Form.ListItem>
        </Form.List>
        <Button>Submit</Button>
      </Form>
    );

    act(() => result.current.setDefault("outer", ["a", "b"]));
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "outer": {
          "defaultValue": [
            "a",
            "b",
          ],
          "errors": Set {},
          "touched": true,
          "value": [
            {
              "defaultValue": "a",
              "errors": Set {},
              "touched": false,
              "value": "a",
            },
            {
              "defaultValue": "b",
              "errors": Set {},
              "touched": false,
              "value": "b",
            },
          ],
        },
      }
    `);
  });

  it("can have default value set via the form hook with nested lists", async () => {
    const { result } = renderHook(() => Form.useForm());
    render(
      <Form form={result.current} onFinish={finishMock}>
        <Form.List name="outer">
          <Form.List name="inner">
            <Form.ListItem>
              <TextInput label="Test" />
            </Form.ListItem>
            <Form.ListItem>
              <TextInput label="Test Two" />
            </Form.ListItem>
          </Form.List>
        </Form.List>
        <Button>Submit</Button>
      </Form>
    );

    act(() => result.current.setDefault("outer", [["a", "b"]]));
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "outer": {
          "defaultValue": [
            [
              "a",
              "b",
            ],
          ],
          "errors": Set {},
          "touched": true,
          "value": [
            {
              "defaultValue": [
                "a",
                "b",
              ],
              "errors": Set {},
              "touched": true,
              "value": [
                {
                  "defaultValue": "a",
                  "errors": Set {},
                  "touched": false,
                  "value": "a",
                },
                {
                  "defaultValue": "b",
                  "errors": Set {},
                  "touched": false,
                  "value": "b",
                },
              ],
            },
          ],
        },
      }
    `);
  });
});
