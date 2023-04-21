import {
  ChangeEvent,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";
import { IconButton } from "@Components/index";
import { Input, InputProps } from "../standard";
import { Errors, ErrorsProps, Label, LabelProps } from "../utilities";
import { concat } from "@Utilities";

import "./file.input.css";

export type FileInputProps = {
  label?: ReactNode;
  helper?: LabelProps["helper"];
  disableClear?: boolean;
  containerProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: LabelProps;
  inputProps?: InputProps;
  errorProps?: ErrorsProps;
};

const FileInput = ({
  containerProps,
  disableClear,
  errorProps,
  helper,
  inputProps,
  label = "Browse files",
  labelProps,
}: FileInputProps): JSX.Element => {
  const [fileName, setFileName] = useState<string>("No file selected");
  const ref = useRef<HTMLInputElement>(null);

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    const fileNames =
      Array.from(e.target.files ?? [])
        .map((file) => file.name)
        .join(", ") || "No file selected";
    setFileName(fileNames);
    return inputProps?.onChange?.(e);
  }

  const clearInput = useCallback(function (): void {
    if (ref.current) {
      ref.current.value = "";
      ref.current.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, []);

  return (
    <>
      <Label hidden {...labelProps} helper={helper}>
        {label}
      </Label>
      <div
        {...containerProps}
        className={concat(
          "omlette-file-input-container",
          containerProps?.className
        )}
      >
        <Input {...inputProps} ref={ref} onChange={handleChange} type="file" />
        <span aria-hidden className="omlette-file-input-name">
          {fileName}
        </span>
        {!disableClear ? (
          <IconButton
            aria-label="clear file input"
            name="ri-close-fill"
            size="sm"
            className="omlette-file-input-button-clear"
            onClick={clearInput}
          ></IconButton>
        ) : null}
      </div>
      <Errors {...errorProps} />
    </>
  );
};

FileInput.displayName = "FileInput";

export { FileInput };
