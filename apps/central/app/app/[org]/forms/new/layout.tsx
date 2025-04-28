import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Creating... Form",
    description: "Creating a new form on Bay",
}

export default function NewFormLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}