import { FinishEvent, FinishFailedEvent, GenericFields } from "../useForm";
import { BasicFormStory as Basic } from "./story/basic";

export type FormControls<Fields extends GenericFields> = {
  onFinish: FinishEvent<Fields>;
  onFinishFailed: FinishFailedEvent<Fields>;
};

const commonArgs = {
  onFinish: { action: "onFinish", table: { disable: true } },
  onFinishFailed: { action: "onFinishFailed", table: { disable: true } },
};

export default {
  title: "Components/Form",
  parameters: { controls: { sort: "alpha" } },
};

Basic.argTypes = {
  ...commonArgs,
};
export { Basic };
