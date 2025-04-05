"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const launchesItems = [
  {
    title: "Coming Soon",
    href: "/launches/coming-soon",
    description: "Check out launches that are coming soon",
  },
  {
    title: "Product Questions",
    href: "/launches/questions",
    description: "Answer the most interesting questions",
  },
  {
    title: "Launch Archive",
    href: "/launches/archive",
    description: "Most-loved launches by the community",
  },
  {
    title: "Newsletter",
    href: "/launches/newsletter",
    description: "The best of Bird, everyday",
  },
]

const communityItems = [
  {
    title: "Discussions",
    href: "/community/discussions",
    description: "Check out launches that are coming soon",
  },
  {
    title: "Stories",
    href: "/community/stories",
    description: "Tech news, interviews and tips from makers",
  },
  {
    title: "Visit Streaks",
    href: "/community/streaks",
    description: "The most active community members",
  },
]

const aboutItems = [
  {
    title: "About Us",
    href: "/about",
    description: "Learn more about our company",
  },
  {
    title: "Careers",
    href: "/careers",
    description: "Join our team",
  },
  {
    title: "Apps",
    href: "/apps",
    description: "Download our applications",
  },
  {
    title: "FAQs",
    href: "/faqs",
    description: "Frequently asked questions",
  },
  {
    title: "Legal",
    href: "/legal",
    description: "Legal information and policies",
  },
]

export function Menu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>

        <NavigationMenuItem>
          <Link href="/hire-talent" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Hire Talent
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/find-jobs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Find Jobs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
