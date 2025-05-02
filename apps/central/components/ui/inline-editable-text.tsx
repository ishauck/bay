import { useState, useRef, useCallback } from "react";
import { Pencil, Loader2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Button } from "./button";

interface InlineEditableTextProps {
  value: string;
  onSave: (val: string) => void;
  isLoading?: boolean;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  as?: "h1" | "p";
}

export function InlineEditableText({
  value,
  onSave,
  isLoading,
  editable = true,
  placeholder,
  className,
  as = "p",
}: InlineEditableTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = useCallback(() => {
    if (!editable || isLoading) return;
    setDraft(value);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, [editable, isLoading, value]);

  const save = useCallback(() => {
    if (draft !== value) onSave(draft);
    setEditing(false);
  }, [draft, value, onSave]);

  const cancel = useCallback(() => {
    setDraft(value);
    setEditing(false);
  }, [value]);

  if (editing) {
    if (isLoading) {
      return (
        <div className={cn("flex items-center gap-2 opacity-60 pointer-events-none select-none", className)} aria-busy="true">
          <Loader2 className="animate-spin size-2" />
        </div>
      );
    }
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          disabled={isLoading}
          placeholder={placeholder}
          aria-label="Edit text"
          className="border border-primary/40 bg-background/80 focus:border-primary/80"
        />
        <Button onClick={save} disabled={isLoading} size="iconSm" className="hover:bg-green-100/50" variant="outline" aria-label="Save">
          <Check />
        </Button>
        <Button onClick={cancel} disabled={isLoading} size="iconSm" variant="ghost" aria-label="Cancel">
          <X />
        </Button>
      </div>
    );
  }

  const Tag = as;
  return (
    <Tag
      className={cn(
        "group flex items-center gap-2 cursor-pointer transition-colors",
        isLoading && "opacity-60 pointer-events-none select-none",
        className
      )}
      tabIndex={editable && !isLoading ? 0 : -1}
      onClick={startEdit}
      onKeyDown={e => (e.key === "Enter" ? startEdit() : undefined)}
      aria-label="Edit text"
      role="button"
      aria-busy={isLoading ? "true" : undefined}
    >
      {value || <span className="text-muted-foreground">{placeholder}</span>}
      {editable && !isLoading && (
        <Button variant="ghost" size="iconSm" onClick={startEdit} aria-label="Edit text">
          <Pencil className="opacity-60 group-hover:opacity-100 transition-opacity" />
        </Button>
      )}
      {isLoading && <Loader2 className="animate-spin ml-2 size-4" />}
    </Tag>
  );
} 