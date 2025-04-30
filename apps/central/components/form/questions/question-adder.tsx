import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PlusIcon } from "lucide-react"
import { useState } from "react"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { QuestionType } from "@/types/api/form-questions"
import { PopoverProps } from "@radix-ui/react-popover"
import { questionTypes } from "@/lib/question-types"
interface Props extends PopoverProps {
    children?: React.ReactNode;
    onSelect: (type: QuestionType) => void;
    hoverCardSide?: "left" | "right" | "top" | "bottom";
}

export function QuestionAdder({ children, onSelect, ...props }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <Popover {...props} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {children ? children : (
                    <Button
                        variant="outline"
                        size="icon"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a question"
                    >
                        <PlusIcon className="size-4" />
                        <span className="sr-only">Add Question</span>
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[250px] p-0">
                <Command loop>
                    <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                        <CommandInput placeholder="Search Questions..." />
                        <CommandEmpty>No Questions found.</CommandEmpty>
                        {questionTypes.map((type) => (
                            <CommandItem
                                key={type.type}
                                onSelect={() => {
                                    setOpen(false)
                                    onSelect(type.type)
                                }}
                                className="data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground group/item"
                            >
                                <div className="size-8 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                                    {type.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="font-medium">
                                        {type.name}
                                    </span>
                                    <span className="text-xs group-data-[selected=true]/item:text-muted text-muted-foreground">
                                        {type.description}
                                    </span>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}