import { useEffect, useMemo, useRef } from "react";
import useIsMac from "./use-mac";

export const Modifier = {
    Meta: 'Meta',
    Control: 'Control',
    Option: 'Option',
    Shift: 'Shift'
} as const

type Modifier = typeof Modifier[keyof typeof Modifier];

type CallbackFn = (event: KeyboardEvent) => unknown | void;

interface KeybindOptions {
    modifiers?: Modifier[];
    preventDefault?: boolean;
    allowInputs?: boolean;
    timeout?: number; // Timeout in ms for sequence keybinds
}

const FORM_ELEMENTS = ['INPUT', 'TEXTAREA', 'SELECT', 'OPTION', 'BUTTON'] as const;
const SEQUENCE_TIMEOUT = 5000; // Default timeout for sequence keybinds

// Map of string modifiers to Modifier enum
const MODIFIER_MAP: Record<string, Modifier> = {
    'meta': Modifier.Meta,
    'cmd': Modifier.Meta,
    'command': Modifier.Meta,
    'ctrl': Modifier.Control,
    'control': Modifier.Control,
    'alt': Modifier.Option,
    'option': Modifier.Option,
    'shift': Modifier.Shift
};

interface ParsedKeybind {
    modifiers: Modifier[];
    key: string;
}

function parseKeybindString(keybind: string): ParsedKeybind[] {
    const sequences = keybind.split(',').map(s => s.trim());
    return sequences.map(sequence => {
        const parts = sequence.split('+').map(p => p.trim().toLowerCase());
        const modifiers: Modifier[] = [];
        let key = '';

        for (const part of parts) {
            if (MODIFIER_MAP[part]) {
                modifiers.push(MODIFIER_MAP[part]);
            } else {
                key = part;
            }
        }

        if (!key) {
            throw new Error(`Invalid keybind: ${sequence} - missing key`);
        }

        return { modifiers, key };
    });
}

function isInputElement(element: EventTarget | null): boolean {
    if (!element) return false;

    const target = element as HTMLElement;

    // Check if element is a form element
    if (FORM_ELEMENTS.includes(target.tagName as typeof FORM_ELEMENTS[number])) {
        return true;
    }

    // Check if element is contentEditable or has textbox role
    if (target.contentEditable === "true" || target.role === "textbox") {
        return true;
    }

    // Check parent elements
    let current: HTMLElement | null = target;
    while (current) {
        if (current.contentEditable === "true" || current.role === "textbox") {
            return true;
        }
        current = current.parentElement;
    }

    return false;
}

function checkModifiers(event: KeyboardEvent, modifiers: Modifier[], isMac: boolean): boolean {
    const meta = isMac ? event.metaKey : event.ctrlKey;

    return (
        meta === (isMac ? modifiers.includes(Modifier.Meta) : modifiers.includes(Modifier.Control)) &&
        event.ctrlKey === modifiers.includes(Modifier.Control) &&
        event.shiftKey === modifiers.includes(Modifier.Shift) &&
        event.altKey === modifiers.includes(Modifier.Option)
    );
}

export default function useKeybind(key: string | string[], callback: CallbackFn, options: KeybindOptions = {}) {
    const isMac = useIsMac();
    const currentIndexRef = useRef(0);
    const lastKeyTimeRef = useRef<number | null>(null);
    const timeout = options.timeout ?? SEQUENCE_TIMEOUT;
    
    // Parse keybind string if it's a string
    const parsedKeybinds = useMemo(() => {
        if (typeof key === 'string') {
            return parseKeybindString(key);
        }
        return key.map(k => ({
            modifiers: options.modifiers || [],
            key: k.toLowerCase() === "space" ? " " : k
        }));
    }, [key, options.modifiers]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!options.allowInputs && isInputElement(event.target)) {
                return;
            }

            const now = Date.now();
            if (lastKeyTimeRef.current && now - lastKeyTimeRef.current > timeout) {
                currentIndexRef.current = 0;
            }
            lastKeyTimeRef.current = now;

            for (const { modifiers, key } of parsedKeybinds) {
                const normalizedKey = key.toLowerCase() === "space" ? " " : key;
                const formattedKey = modifiers.includes(Modifier.Shift)
                    ? normalizedKey.toUpperCase()
                    : normalizedKey.toLowerCase();

                if ((event.key === formattedKey || event.key === normalizedKey.toLowerCase()) &&
                    checkModifiers(event, modifiers, isMac)) {
                    if (options.preventDefault ?? true) {
                        event.preventDefault();
                    }

                    if (parsedKeybinds.length > 1) {
                        // Handle sequence keybind
                        if (currentIndexRef.current === parsedKeybinds.length - 1) {
                            callback(event);
                            currentIndexRef.current = 0;
                        } else {
                            currentIndexRef.current += 1;
                        }
                    } else {
                        // Handle single keybind
                        callback(event);
                    }
                    return;
                }
            }
            currentIndexRef.current = 0;
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [callback, isMac, parsedKeybinds, options, timeout]);

    return callback;
}