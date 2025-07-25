import type React from "react"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authenticate = async () => {
    const { userId } = await auth()

    // If the user isn't authenticated, redirect to the sign-in page
    if (!userId) {
      redirect("/sign-in")
    }
  }

  authenticate()

  return <div>{children}</div>
}
