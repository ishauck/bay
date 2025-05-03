import { MenuOption } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { CustomData } from "./types";

type Metadata = CustomData["metadata"];

class CustomTypeaheadOption extends MenuOption {
  key: string;
  metadata: Metadata;

  constructor(
    key: string,
    metadata: Metadata
  ) {
    super(key);
    this.key = key;
    this.metadata = metadata;
  }
}

export default CustomTypeaheadOption;
