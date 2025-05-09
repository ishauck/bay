import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import {
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
  $isTextNode,
  KEY_ENTER_COMMAND,
  COMMAND_PRIORITY_LOW,
  LexicalNode,
} from "lexical";

export function AllowNewlineAtEndPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      () => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return false;
        const anchorNode = selection.anchor.getNode();
        if (!anchorNode) return false;
        // Only trigger if not a text node
        if ($isTextNode(anchorNode)) return false;
        // Find the top-level node (block)
        let topLevel: LexicalNode | null = anchorNode;
        while (topLevel && topLevel.getParent() && !$getRoot().isParentOf(topLevel)) {
          topLevel = topLevel.getParent();
        }
        if (!topLevel) return false;
        // Only proceed if at the end of the document
        const root = $getRoot();
        const children = root.getChildren();
        if (children.length === 0) return false;
        const last = children[children.length - 1];
        if (topLevel.getKey() !== last.getKey()) return false;
        // Insert a new paragraph after the current node
        const newParagraph = $createParagraphNode();
        last.insertAfter(newParagraph);
        newParagraph.select();
        return true;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
} 