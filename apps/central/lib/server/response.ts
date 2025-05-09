import { SerializedLexicalState } from "@/types/form-data";
import { Response } from "@/types/response";
import { getChildren } from "../children";
import { FIELD_TYPES } from "@/constants/lexical/shared";
import { TYPES_TO_NODES } from "@/constants/lexical/lexical.server";
import { HiddenFieldNode } from "@/components/form/editor/plugins/HiddenFieldNode.server";
import { InputNode } from "@/components/form/editor/plugins/InputNode.server";
import { RadioOptionNode } from "@/components/form/editor/plugins/RadioOptionNode.server";

/**
 * Verifies that a response conforms to the expected schema.
 *
 * This function validates that the provided response array contains only allowed
 * response types (ShortAnswerResponse, LongAnswerResponse, RadioResponse, or HiddenResponse)
 * and that each response follows its type-specific validation rules.
 *
 * @param response - An array of response objects to validate
 * @param form - The serialized lexical state representing the form schema
 * @returns The validated response array if valid
 * @throws Will throw an error if the response doesn't match the expected schema
 */
export function verifyResponse(
  response: Response,
  form: SerializedLexicalState
): true {
  console.log("[verifyResponse] Called with response:", response);
  console.log("[verifyResponse] Called with form:", form);
  // Parse and validate the response array using the Response schema
  const schema = Response.parse(response);
  // Get the form's children (fields/questions) from the serialized state
  const { error, data } = getChildren(form);
  if (error) {
    console.error("[verifyResponse] Error getting children:", error);
    throw new Error(error);
  }
  // Filter children to only include those with allowed field types
  const children = data?.filter((child) =>
    FIELD_TYPES.includes(child.getType())
  );
  if (!children) {
    console.error("[verifyResponse] No children found");
    throw new Error("No children found");
  }
  console.log("[verifyResponse] Filtered children:", children);

  // Map to associate question IDs with their index in the children array
  const idToIndex = new Map<string, number>();
  // Also keep a map of questionId to child node for required check
  const idToChild = new Map<string, import("lexical").LexicalNode>();
  for (const [index, child] of children.entries()) {
    let questionId: string | undefined = undefined;

    // Only process nodes that are recognized in TYPES_TO_NODES
    if (TYPES_TO_NODES[child.getType()]) {
      switch (child.getType()) {
        case "hidden-field":
          // Extract questionId from HiddenFieldNode
          questionId = (child as HiddenFieldNode).__questionId;
          break;
        case "input":
          // Extract questionId from InputNode
          questionId = (child as InputNode).__questionId;
          break;
        case "radio-option":
          // Extract questionId from RadioOptionNode
          questionId = (child as RadioOptionNode).__questionId;
          break;
      }
    } else continue;

    // Map the questionId to its index for quick lookup
    if (questionId) {
      idToIndex.set(questionId, index);
      idToChild.set(questionId, child);
      console.log(
        `[verifyResponse] Mapped questionId '${questionId}' to index ${index} and child`,
        child
      );
    } else continue;
  }

  // Check for required questions (excluding hidden-field)
  for (const [questionId, child] of idToChild.entries()) {
    const childType = child.getType();
    if (childType === "hidden-field") continue;
    let required = false;
    if (childType === "input") {
      required = (child as InputNode).__required;
    } else if (childType === "radio-option") {
      required = (child as RadioOptionNode).__required;
    }
    if (required) {
      const hasResponse = schema.some((resp) => resp.questionId === questionId);
      console.log(
        `[verifyResponse] Checking required questionId '${questionId}': hasResponse =`,
        hasResponse
      );
      if (!hasResponse) {
        throw new Error(
          `Missing response for required questionId '${questionId}'.`
        );
      }
    }
  }

  // Validate each response against the corresponding form field
  for (const response of schema) {
    const questionId = response.questionId;
    const index = idToIndex.get(questionId);
    if (index === undefined) {
      // If the response's questionId doesn't match any form field, throw an error
      console.error(
        `[verifyResponse] Response questionId '${questionId}' does not match any form field.`
      );
      throw new Error(
        `Response questionId '${questionId}' does not match any form field.`
      );
    }
    const child = children[index];
    const childType = child.getType();
    console.log(
      `[verifyResponse] Validating response for questionId '${questionId}' of type '${childType}':`,
      response
    );
    switch (childType) {
      case "input": {
        // For input fields, check that the response type matches the expected input type
        const inputNode = child as InputNode;
        if (
          (response.type !== "short-answer" &&
            response.type !== "long-answer" &&
            response.type !== "email" &&
            response.type !== "phone" &&
            response.type !== "number") ||
          response.type !== inputNode.__inputType
        ) {
          console.error(
            `[verifyResponse] Type mismatch for questionId '${questionId}': expected '${inputNode.__inputType}', got '${response.type}'.`
          );
          throw new Error(
            `Response for questionId '${questionId}' must be of type '${inputNode.__inputType}', got '${response.type}'.`
          );
        }
        break;
      }
      case "radio-option": {
        if (response.type !== "radio") {
          console.error(
            `[verifyResponse] Type mismatch for questionId '${questionId}': expected 'radio', got '${response.type}'.`
          );
          throw new Error(
            `Response for questionId '${questionId}' must be of type 'radio', got '${response.type}'.`
          );
        }
        break;
      }
      case "hidden-field": {
        // For hidden fields, response type must be 'hidden'
        if (response.type !== "hidden") {
          console.error(
            `[verifyResponse] Type mismatch for questionId '${questionId}': expected 'hidden', got '${response.type}'.`
          );
          throw new Error(
            `Response for questionId '${questionId}' must be of type 'hidden', got '${response.type}'.`
          );
        }
        break;
      }
      default:
        // If the field type is unknown, throw an error
        console.error(
          `[verifyResponse] Unknown field type '${childType}' for questionId '${questionId}'.`
        );
        throw new Error(
          `Unknown field type '${childType}' for questionId '${questionId}'.`
        );
    }
  }

  // If all checks pass, return true
  console.log("[verifyResponse] All checks passed. Returning true.");
  return true;
}
