import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { motion, AnimatePresence, LayoutGroup } from "motion/react"
import { Organization } from "@/types/org"
import { FormPartial } from "@/types/api/forms"
import { Badge } from "../ui/badge"

const TABS = [
  { label: "Editor", id: "editor" },
  { label: "Responses", id: "responses" },
  { label: "Settings", id: "settings" },
]

const transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
}

function getTabIndexFromPath(path: string, orgSlug: string, formId: string) {
    if (path.endsWith("/responses")) return 1
    if (path.endsWith("/settings")) return 2
    // Default to editor if matches /app/org/forms/form-id
    if (path === `/app/${orgSlug}/forms/${formId}`) return 0
    return 0
}

function getTabPath(tabIndex: number, orgSlug: string, formId: string) {
    switch (tabIndex) {
        case 0:
            return `/app/${orgSlug}/forms/${formId}`
        case 1:
            return `/app/${orgSlug}/forms/${formId}/responses`
        case 2:
            return `/app/${orgSlug}/forms/${formId}/settings`
        default:
            return `/app/${orgSlug}/forms/${formId}`
    }
}

export function FormNav({ org, form }: { org: Organization | null | undefined, form: FormPartial | null }) {
    const router = useRouter()
    const pathname = usePathname()

    // Move hooks above early return
    const orgSlug = org?.slug ?? ''
    const formId = form?.id ?? ''
    const responseCount = form?.responseCount ?? 0
    const tabIndex = getTabIndexFromPath(pathname, orgSlug, formId)
    const [selectedTab, setSelectedTab] = useState(tabIndex)
    const [hoveredTab, setHoveredTab] = useState<number | null>(null)

    useEffect(() => {
        const idx = getTabIndexFromPath(pathname, orgSlug, formId)
        if (idx !== selectedTab) {
            setSelectedTab(idx)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname, orgSlug, formId])

    if (!org || !form) return null

    const handleTabClick = (i: number) => {
        setSelectedTab(i)
        router.push(getTabPath(i, orgSlug, formId))
    }

    return (
        <nav className="flex-1 flex items-center justify-center">
            <motion.nav className="flex flex-shrink-0 justify-center items-center relative z-0 py-2" onHoverEnd={() => setHoveredTab(null)}>
                <LayoutGroup id="tabs">
                    {TABS.map((item, i) => (
                        <motion.button
                            key={i}
                            className={`text-md relative rounded-md flex items-center h-8 px-4 text-sm text-muted-foreground cursor-pointer select-none transition-colors ${hoveredTab === i || selectedTab === i ? "text-foreground" : ""}`}
                            onHoverStart={() => setHoveredTab(i)}
                            onFocus={() => setHoveredTab(i)}
                            onClick={() => handleTabClick(i)}
                        >
                            <span className="z-20 flex items-center gap-2">
                                {item.label}
                                {item.id === "responses" && (
                                    <Badge>
                                        {responseCount}
                                        <span className="sr-only">responses</span>
                                    </Badge>
                                )}
                            </span>
                            {i === selectedTab ? (
                                <motion.div
                                    transition={transition}
                                    layoutId="underline"
                                    className="absolute z-10 h-0.5 left-2 right-2 -bottom-2 bg-primary"
                                />
                            ) : null}
                            <AnimatePresence>
                                {i === hoveredTab ? (
                                    <motion.div
                                        className="absolute bottom-0 left-0 right-0 top-0 z-10 rounded-md bg-muted"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={transition}
                                        layoutId="hover"
                                    />
                                ) : null}
                            </AnimatePresence>
                        </motion.button>
                    ))}
                </LayoutGroup>
            </motion.nav>
        </nav>
    )
}