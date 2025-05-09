'use client'
import { signOut } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { SearchParams } from "@/lib/utils"
import { useEffect } from "react"
export default function Logout({ searchParams }: { searchParams: SearchParams }) {
    const redirectUrl = searchParams["redirect_uri"]?.toString() || "/login"

    useEffect(() => {
        signOut().then(() => {
            redirect(redirectUrl)
        })
    }, [redirectUrl])

    return (
        <></>
    )
}