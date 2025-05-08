'use client'
import { CheckCircle2, FileWarningIcon } from "lucide-react";
import Tilt from "react-parallax-tilt";

type TiltElemProps = {
    variant?: "default" | "success";
}

export default function TiltElem({ variant = "default" }: TiltElemProps) {
    return (
        <Tilt
            perspective={500}
            glareEnable={true}
            glareMaxOpacity={0.45}
            scale={1.02}
            className="transform-3d rounded-xl p-4 size-20 bg-muted overflow-hidden"
        >
            {variant === "default" ? (
                <FileWarningIcon className="size-12 translate-z-50 text-destructive" />
            ) : (
                <CheckCircle2 className="size-12 translate-z-50 text-green-600" />
            )}
        </Tilt>
    )
}