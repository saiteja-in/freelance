import Link from "next/link"
import { Code, Lightbulb, LineChart, Palette, Pencil, Video } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const categories = [
  {
    icon: Code,
    name: "Development & IT",
    count: 1200,
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Palette,
    name: "Design & Creative",
    count: 850,
    color: "bg-violet-50 text-violet-600",
  },
  {
    icon: Pencil,
    name: "Writing & Translation",
    count: 620,
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: LineChart,
    name: "Sales & Marketing",
    count: 940,
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Lightbulb,
    name: "Business & Consulting",
    count: 510,
    color: "bg-fuchsia-50 text-fuchsia-600",
  },
  {
    icon: Video,
    name: "Video & Animation",
    count: 730,
    color: "bg-red-50 text-red-600",
  },
]

export function PopularCategories() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link key={category.name} href={`/categories/${category.name.toLowerCase().replace(/\s+/g, "-")}`}>
          <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}>
                <category.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} jobs</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

