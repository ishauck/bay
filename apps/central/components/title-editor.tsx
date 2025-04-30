'use client'

import { useState, useRef, useEffect } from 'react'
import { Loader2, Pencil } from 'lucide-react'

interface TitleEditorProps {
    title: string
    onTitleChange: (newTitle: string) => void
    className?: string
    isLoading?: boolean
}

export function TitleEditor({ title, onTitleChange, isLoading, className = '' }: TitleEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editedTitle, setEditedTitle] = useState(title)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            // Select all text when editing starts
            inputRef.current.setSelectionRange(0, inputRef.current.value.length)
        }
    }, [isEditing])

    const handleBlur = () => {
        setIsEditing(false)
        if (editedTitle.trim() !== title) {
            onTitleChange(editedTitle.trim())
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            inputRef.current?.blur()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            setEditedTitle(title)
            setIsEditing(false)
        }
    }

    return (
        <div data-is-loading={isLoading} className={`group relative ${className}`}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent text-xl font-semibold outline-none border-none focus:ring-0 p-0"
                />
            ) : (
                <div className="flex items-center gap-2">
                    <h1 
                        className="text-xl font-semibold cursor-text"
                        onDoubleClick={() => !isLoading && setIsEditing(true)}
                    >
                        {title}
                    </h1>
                    <button
                        onClick={() => setIsEditing(true)}
                        disabled={isLoading}
                        className="opacity-0 group-data-[is-loading=true]:opacity-70 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1 hover:bg-muted disabled:hover:bg-transparent rounded-md"
                    >
                        {isLoading ? <Loader2 className="size-4 text-muted-foreground animate-spin" /> : <Pencil className="size-4 text-muted-foreground" />}
                    </button>
                </div>
            )}
        </div>
    )
} 