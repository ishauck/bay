import {
    LexicalTypeaheadMenuPlugin,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { TextNode } from "lexical";
import { JSX, useCallback, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useBasicTypeaheadTriggerMatch } from "./useBasicTypeaheadTriggerMatch";
import CustomTypeaheadOption from "./option";
import { SuggestionItem } from "./item";
import { CustomData } from "./types";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { customData, groups } from "./data";

// Add logging utility
const log = (...args: unknown[]): void => {
    if (typeof window !== 'undefined') {
        console.log('[Typeahead]', ...args);
    }
};

export default function CustomDataSuggestionPlugin(): JSX.Element | null {
    const [editor] = useLexicalComposerContext();
    const [queryString, setQueryString] = useState<string | null>(null);
    const [showCustomDataSuggestions, setShowCustomDataSuggestions] = useState(true);

    const checkForTriggerMatch = useBasicTypeaheadTriggerMatch("/", {
        minLength: 0,
    });

    const checkForCustomDataTriggerMatch = useCallback(
        (text: string) => {
            const match = checkForTriggerMatch(text, editor);
            if (match !== null) {
                setShowCustomDataSuggestions(true);
            }
            return match;
        },
        [checkForTriggerMatch, editor]
    );

    const onSelectOption = useCallback(
        (
            selectedOption: CustomTypeaheadOption,
            nodeToReplace: TextNode | null,
            closeMenu: () => void
        ) => {
            editor.update(() => {
                const customNode = selectedOption.metadata.onSelect(editor);
                if (nodeToReplace && customNode) {
                    nodeToReplace.replace(customNode);
                }
                closeMenu();
            });
        },
        [editor]
    );

    const createFilteredOptions = (
        options: CustomData[],
        queryString: string | RegExp | null
    ) => {
        if (queryString === null) {
            log('Query is null, returning first 10 options', options);
            return options;
        }

        const regex = new RegExp(queryString, "gi");
        const filtered = options.filter((option) => regex.test(option.key) || regex.test(option.metadata.name) || (option.metadata.description && regex.test(option.metadata.description)));
        log('Filtering options with query', queryString, 'Filtered:', filtered.length, filtered);
        return filtered;
    };

    const options: CustomTypeaheadOption[] = useMemo(
        () => {
            const filtered = createFilteredOptions(customData, queryString);
            log('Options after filtering and mapping', filtered.length, filtered);
            return filtered.map(
                (data) => new CustomTypeaheadOption(data.key, data.metadata)
            );
        },
        [queryString]
    );

    const renderSuggestionsMenu = (
        anchorElementRef: { current: Element | DocumentFragment | null },
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }: { selectedIndex: number | null, selectOptionAndCleanUp: (option: CustomTypeaheadOption) => void, setHighlightedIndex: (index: number) => void }
    ) => {
        log('Rendering suggestions menu', {
            showCustomDataSuggestions,
            anchor: anchorElementRef.current,
            optionsLength: options.length,
            options,
            queryString
        });
        if (
            !showCustomDataSuggestions ||
            anchorElementRef.current == null ||
            options.length === 0
        ) {
            return null;
        }

        const groupOptions = groups.map((group) => {
            return {
                key: group.key,
                name: group.name,
                options: options.filter((option) => option.metadata.group === group.key),
            };
        });

        return anchorElementRef.current && options.length
            ? createPortal(
                <div className="bg-popover text-popover-foreground rounded-md overflow-hidden shadow gap-0.5 overflow-y-auto w-fit min-w-60 max-w-screen-sm! max-h-48 md:max-h-64 no-scrollbar animate-in fade-in-80 zoom-in-90 slide-in-from-top-2 slide-in-from-left-2 duration-300" >
                    <ul>
                        {(() => {
                            let globalIndex = 0;
                            return groupOptions.map((group) => (
                                <div data-item-count={group.options.length} className="group" key={group.key}>
                                    <span className="text-xs text-muted-foreground px-2 group-data-[item-count=0]:hidden">{group.name}</span>
                                    {group.options.map((option) => {
                                        const currentIndex = globalIndex++;
                                        return (
                                            <SuggestionItem
                                                index={currentIndex}
                                                key={option.key}
                                                isSelected={selectedIndex === currentIndex}
                                                onClick={() => {
                                                    setHighlightedIndex(currentIndex);
                                                    selectOptionAndCleanUp(option);
                                                }}
                                                onMouseEnter={() => {
                                                    setHighlightedIndex(currentIndex);
                                                }}
                                                option={option}
                                            />
                                        );
                                    })}
                                </div>
                            ));
                        })()}
                    </ul>
                </div>,
                anchorElementRef.current
            )
            : null;
    };

    return (
        <LexicalTypeaheadMenuPlugin<CustomTypeaheadOption>
            onQueryChange={setQueryString}
            onSelectOption={onSelectOption}
            triggerFn={checkForCustomDataTriggerMatch}
            options={options}
            anchorClassName="z-[10000]"
            menuRenderFn={renderSuggestionsMenu}
        />
    );
}