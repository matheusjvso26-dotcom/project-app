import { requireUser } from "@/lib/auth-utils"

export default async function SettingsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // This entirely protects the /settings route and sub-routes for USER
    await requireUser()

    return <>{children}</>
}
