import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Button,
  Checkbox,
  Form,
  NumberInput,
  TextInput,
  SelectInput,
  DateInput,
} from "@Components/index";

const finishMock = jest.fn();

beforeEach(() => {
  finishMock.mockClear();
});

describe("Form input components", () => {
  test("text input", async () => {
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

  test("number input", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item name="test">
          <NumberInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "123");
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": 123,
        },
      }
    `);
  });

  test("date input", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item name="test">
          <DateInput label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.type(screen.getByLabelText(/test/i), "2000-01-01");
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": "2000-01-01",
        },
      }
    `);
  });

  test("checkbox input", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item name="test">
          <Checkbox label="Test" />
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.click(screen.getByLabelText("Test"));
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": true,
        },
      }
    `);
  });

  test("select input", async () => {
    render(
      <Form onFinish={finishMock}>
        <Form.Item name="test">
          <SelectInput label="Select">
            <SelectInput.Option value="option">Option</SelectInput.Option>
            <SelectInput.Option value="other">Other</SelectInput.Option>
          </SelectInput>
        </Form.Item>
        <Button>Submit</Button>
      </Form>
    );

    await userEvent.selectOptions(screen.getByLabelText("Select"), "option");
    await userEvent.click(screen.getByRole("button"));
    expect(finishMock.mock.calls.length).toBe(1);
    expect(finishMock.mock.calls[0][0]).toMatchInlineSnapshot(`
      {
        "test": {
          "defaultValue": null,
          "errors": Set {},
          "touched": true,
          "value": "option",
        },
      }
    `);
  });
});
