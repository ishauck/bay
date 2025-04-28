import { Metadata } from "next"

export const metadata: Metadata = {
    title: "New Form",
    description: "Create a new form on Bay",
}

export default function NewFormLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}