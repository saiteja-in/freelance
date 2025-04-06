import { ArrowUpRight, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

const jobs = [
  {
    id: 1,
    title: "Senior UX Designer",
    description:
      "Looking for an experienced UX designer to lead our product design team and create intuitive user experiences.",
    skills: ["UI/UX", "Figma", "User Research"],
    budget: "$80-100/hr",
    postedAt: "2 hours ago",
    company: "TechVision",
  },
  {
    id: 2,
    title: "Full Stack Developer",
    description:
      "Seeking a skilled full stack developer with experience in React and Node.js to build modern web applications.",
    skills: ["React", "Node.js", "MongoDB"],
    budget: "$70-90/hr",
    postedAt: "5 hours ago",
    company: "WebSolutions",
  },
  {
    id: 3,
    title: "Content Writer",
    description:
      "Need a creative content writer to produce engaging blog posts, articles, and marketing copy for our SaaS platform.",
    skills: ["Copywriting", "SEO", "Marketing"],
    budget: "$40-60/hr",
    postedAt: "1 day ago",
    company: "ContentHub",
  },
]

export function FeaturedJobs() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Card
          key={job.id}
          className="group overflow-hidden border border-gray-200 hover:border-violet-300 hover:shadow-md transition-all duration-300"
        >
          <CardHeader className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold group-hover:text-violet-600 transition-colors">{job.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{job.company}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ArrowUpRight className="h-4 w-4" />
                <span className="sr-only">View Job</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="bg-violet-50 text-violet-700 hover:bg-violet-100">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex justify-between items-center">
            <p className="font-medium text-violet-600">{job.budget}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              {job.postedAt}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

