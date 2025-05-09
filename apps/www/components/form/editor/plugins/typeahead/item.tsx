import React, { JSX } from "react";
import CustomTypeaheadOption from "./option";

export function SuggestionItem({
    index,
    isSelected,
    onClick,
    onMouseEnter,
    option,
}: {
    index: number;
    isSelected: boolean;
    onClick: () => void;
    onMouseEnter: () => void;
    option: CustomTypeaheadOption;
}): JSX.Element {
    return (
        <li
            key={option.key}
            tabIndex={-1}
            className={`cursor-pointer relative bg-popover text-popover-foreground py-2 px-3 text-xs flex items-center gap-2 group`}
            ref={option.setRefElement}
            role="option"
            aria-selected={isSelected}
            id={"typeahead-item-" + index}
            data-is-selected={isSelected}
            onMouseEnter={onMouseEnter}
            onClick={onClick}
        >
            <div className="flex items-center gap-2 z-10">
                <div className="size-8 bg-muted text-muted-foreground rounded-md [&>svg]:size-4 flex items-center justify-center">
                    {option.metadata.icon}
                </div>
                <div className="flex flex-col flex-1">
                    <span className="popper__reference font-semibold group-data-[is-selected=true]:text-primary-foreground">{option.metadata.name}</span>
                    <span className="popper__reference text-muted-foreground group-data-[is-selected=true]:text-primary-foreground text-xs">{option.metadata.description}</span>
                </div>
            </div>
            <div className="group-data-[is-selected=true]:bg-primary group-data-[is-selected=true]:text-primary-foreground absolute inset-0 rounded-md w-[97%] h-[97%] mx-auto" />
        </li>
    );
}