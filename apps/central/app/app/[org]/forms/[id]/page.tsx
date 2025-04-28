'use client'

import { useParams } from "next/navigation"

export default function FormPage() {
    const params = useParams()
    const id = params.id as string

    return (
        <div>
            <h1>{id}</h1>
        </div>
    )
}