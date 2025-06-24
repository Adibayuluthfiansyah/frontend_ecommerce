"use client"

import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx" // optional, tapi sangat berguna untuk conditional class

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className={clsx(
                "min-w-8 duration-200 ease-linear",
                pathname === "/dashboard-full"
                  ? "bg-muted text-primary"
                  : "hover:bg-primary/90 text-muted-foreground"
              )}
              asChild
            >
              <Link href="/dashboard-full">
                <IconCirclePlusFilled className="size-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  className={clsx(
                    isActive
                      ? "bg-blue-100 text-primary font-semibold"
                      : "hover:bg-muted text-muted-foreground",
                    "duration-150 ease-in-out"
                  )}
                  asChild
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="size-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
