import Image from "next/image"
import { ArrowUpRight, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const talents = [
  {
    id: 1,
    name: "Alex Morgan",
    title: "UI/UX Designer",
    skills: ["UI Design", "User Research", "Prototyping"],
    rating: 4.9,
    reviews: 56,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Jamie Chen",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript"],
    rating: 4.8,
    reviews: 42,
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Sam Wilson",
    title: "Content Strategist",
    skills: ["Copywriting", "SEO", "Content Planning"],
    rating: 4.7,
    reviews: 38,
    image: "/placeholder.svg?height=400&width=400",
  },
]

export function TalentShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {talents.map((talent) => (
        <Card
          key={talent.id}
          className="group overflow-hidden border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300"
        >
          <CardHeader className="p-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-violet-100">
                  <Image src={talent.image || "/placeholder.svg"} alt={talent.name} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold group-hover:text-violet-600 transition-colors">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground">{talent.title}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span className="sr-only">View Profile</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex flex-wrap gap-2">
              {talent.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-violet-50 text-violet-700 hover:bg-violet-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex items-center">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-medium">{talent.rating}</span>
              <span className="text-muted-foreground text-sm ml-1">({talent.reviews})</span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

