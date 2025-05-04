import { $createParagraphNode, $createTextNode } from "lexical";
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createHorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { CustomData } from "./types";
import { BookOpenIcon, EyeClosedIcon, Heading1Icon, Heading2Icon, Heading3Icon, Heading4Icon, Heading5Icon, Heading6Icon, QuoteIcon, RadioIcon, SlashIcon, TextCursorInputIcon, TextIcon } from "lucide-react";
import lorem from "@/lib/lorem";
import { faker } from '@faker-js/faker';
import { $createPageBreakNode } from "../PageBreakNode";
import { $createInputNode } from "../InputNode";
import { $createHiddenFieldNode } from "../HiddenFieldNode";
import { $createRadioOptionNode } from "../RadioOptionNode";


export const groups = [
    {
        key: "headings",
        name: "Headings",
    },
    {
        key: "paragraphs",
        name: "Paragraphs",
    },
    {
        key: "questions",
        name: "Questions",
    },
    {
        key: "utility",
        name: "Utilities",
    },
]

export const customData: CustomData[] = [
    {
        key: "h1",
        metadata: {
            id: "1",
            group: "headings",
            icon: <Heading1Icon />,
            name: "H1",
            description: "Heading 1",
            onSelect: () => {
                const headingNode = $createHeadingNode("h1");
                headingNode.append($createTextNode("New Title"));

                return {
                    node: headingNode,
                    atTopLevel: true,
                    insertEmpty: true,
                };
            }
        }
    },
    {
        key: "h2",
        metadata: {
            id: "2",
            group: "headings",
            icon: <Heading2Icon />,
            name: "H2",
            description: "Heading 2",
            onSelect: () => {
                const headingNode = $createHeadingNode("h2");
                headingNode.append($createTextNode("New Title"));

                return {
                    node: headingNode,
                    atTopLevel: true,
                };
            }
        }
    },
    {
        key: "h3",
        metadata: {
            id: "3",
            group: "headings",
            icon: <Heading3Icon />,
            name: "H3",
            description: "Heading 3",
            onSelect: () => {
                const headingNode = $createHeadingNode("h3");
                headingNode.append($createTextNode("New Title"));

                return headingNode;
            }
        }
    },
    {
        key: "h4",
        metadata: {
            id: "4",
            group: "headings",
            icon: <Heading4Icon />,
            name: "H4",
            description: "Heading 4",
            onSelect: () => {
                const headingNode = $createHeadingNode("h4");
                headingNode.append($createTextNode("New Title"));

                return headingNode;
            }
        }
    },
    {
        key: "h5",
        metadata: {
            id: "5",
            group: "headings",
            icon: <Heading5Icon />,
            name: "H5",
            description: "Heading 5",
            onSelect: () => {
                const headingNode = $createHeadingNode("h5");
                headingNode.append($createTextNode("New Title"));

                return headingNode;
            }
        }
    },
    {
        key: "h6",
        metadata: {
            id: "6",
            group: "headings",
            icon: <Heading6Icon />,
            name: "H6",
            description: "Heading 6",
            onSelect: () => {
                const headingNode = $createHeadingNode("h6");
                headingNode.append($createTextNode("New Title"));

                return headingNode;
            }
        }
    },
    {
        key: "p",
        metadata: {
            id: "7",
            group: "paragraphs",
            icon: <TextIcon />,
            name: "Paragraph",
            description: "A short paragraph of text",
            onSelect: () => {
                const paragraphNode = $createParagraphNode();
                paragraphNode.append($createTextNode(lorem.generateSentences(3)));

                return paragraphNode;
            }
        }
    },
    {
        key: "blockquote",
        metadata: {
            id: "8",
            group: "paragraphs",
            icon: <QuoteIcon />,
            name: "Blockquote",
            description: "A large block of text that is quoted from another source.",
            onSelect: () => {
                const quoteNode = $createQuoteNode();
                quoteNode.append($createTextNode(lorem.generateParagraphs(1) + "\n\n - " + faker.person.fullName()));

                return quoteNode;
            }
        }
    },
    {
        key: "short-answer",
        metadata: {
            id: "9",
            group: "questions",
            icon: <TextCursorInputIcon />,
            name: "Short Answer",
            description: "A short answer question",
            onSelect: () => {
                const inputNode = $createInputNode("Label", "Placeholder");
                return inputNode;
            }
        }
    },
    {
        key: "long-answer",
        metadata: {
            id: "10",
            group: "questions",
            icon: <TextIcon />,
            name: "Long Answer",
            description: "A long answer question, useful for paragraphs of text.",
            onSelect: () => {
                const inputNode = $createInputNode("Label", "Placeholder", "long-answer");
                return inputNode;
            }
        }
    },
    {
        key: "hr",
        metadata: {
            id: "10",
            group: "utility",
            icon: <SlashIcon />,
            name: "Horizontal Rule",
            description: "A horizontal rule",
            onSelect: () => {
                const hrNode = $createHorizontalRuleNode();
                return {
                    node: hrNode,
                    atTopLevel: true,
                    insertEmpty: true,
                };
            }
        }
    },
    {
        key: "page-break",
        metadata: {
            id: "11",
            group: "utility",
            icon: <BookOpenIcon />,
            name: "Page Break",
            description: "A page break",
            onSelect: () => {
                const pageBreakNode = $createPageBreakNode();
                return {
                    node: pageBreakNode,
                    atTopLevel: true,
                    insertEmpty: true,
                };
            }
        }
    },
    {
        key: "hidden-field",
        metadata: {
            id: "12",
            group: "utility",
            icon: <EyeClosedIcon />,
            name: "Hidden Field",
            description: "A hidden field used to grab search parameters.",
            onSelect: () => {
                const hiddenFieldNode = $createHiddenFieldNode();
                return {
                    node: hiddenFieldNode,
                    atTopLevel: true,
                    insertEmpty: true,
                };
            }
        }
    },
    {
        key: "radio-option",
        metadata: {
            id: "13",
            group: "questions",
            icon: <RadioIcon />,
            name: "Radio Option",
            description: "A radio option question",
            onSelect: () => {
                const radioOptionNode = $createRadioOptionNode("Label", ["Option 1", "Option 2"]);
                return radioOptionNode;
            }
        }
    }
];