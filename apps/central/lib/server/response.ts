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
  // Parse and validate the response array using the Response schema
  const schema = Response.parse(response);
  // Get the form's children (fields/questions) from the serialized state
  const { error, data } = getChildren(form);
  if (error) throw new Error(error);
  // Filter children to only include those with allowed field types
  const children = data?.filter((child) =>
    FIELD_TYPES.includes(child.getType())
  );
  if (!children) throw new Error("No children found");

  // Map to associate question IDs with their index in the children array
  const idToIndex = new Map<string, number>();
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
    } else continue;
  }

  // Validate each response against the corresponding form field
  for (const response of schema) {
    const questionId = response.questionId;
    const index = idToIndex.get(questionId);
    if (index === undefined) {
      // If the response's questionId doesn't match any form field, throw an error
      throw new Error(`Response questionId '${questionId}' does not match any form field.`);
    }
    const child = children[index];
    const childType = child.getType();
    switch (childType) {
      case "input": {
        // For input fields, check that the response type matches the expected input type
        const inputNode = child as InputNode;
        if (
          (response.type !== "short-answer" && response.type !== "long-answer") ||
          response.type !== inputNode.__inputType
        ) {
          throw new Error(
            `Response for questionId '${questionId}' must be of type '${inputNode.__inputType}', got '${response.type}'.`
          );
        }
        break;
      }
      case "radio-option": {
        // For radio fields, response type must be 'radio'
        if (response.type !== "radio") {
          throw new Error(
            `Response for questionId '${questionId}' must be of type 'radio', got '${response.type}'.`
          );
        }
        break;
      }
      case "hidden-field": {
        // For hidden fields, response type must be 'hidden'
        if (response.type !== "hidden") {
          throw new Error(
            `Response for questionId '${questionId}' must be of type 'hidden', got '${response.type}'.`
          );
        }
        break;
      }
      default:
        // If the field type is unknown, throw an error
        throw new Error(`Unknown field type '${childType}' for questionId '${questionId}'.`);
    }
  }

  // If all checks pass, return true
  return true;
}
