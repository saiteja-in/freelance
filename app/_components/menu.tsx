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
          <NavigationMenuTrigger>Launches</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {launchesItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/categories" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Categories
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Community</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {communityItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <Link href="/advertise" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Advertise
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {aboutItems.map((item) => (
                <ListItem
                  key={item.title}
                  title={item.title}
                  href={item.href}
                >
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
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
