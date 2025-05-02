import React from "react";
import { contrast } from "@/lib/contrast";

export default function useContrast(value: string) {
    return React.useMemo(() => {
        return contrast(value);
    }, [value]);
}