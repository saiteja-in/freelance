import React from "react";
import NavBar from "../_components/navbar";
import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/schemas";
import HomePage from "./_components/HomePage";
import { getActiveProducts } from "@/lib/server-actions";
import ActiveProducts from "../_components/active-products";
import Link from "next/link"
import { ArrowRight, Search, Sparkles, TrendingUp, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FeaturedJobs } from "@/components/featured-jobs"
import { PopularCategories } from "@/components/popular-categories"
import { TalentShowcase } from "@/components/talent-showcase"
import AISearch from "./_components/AISearch";

const Home = async () => {
  const user = (await currentUser()) as ExtendedUser;
  console.log(user);
  const activeProducts = await getActiveProducts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-200">
      <NavBar />
      {/* <HomePage /> */}
      <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-600 py-20 md:py-32">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-10 bg-cover bg-center mix-blend-overlay" />
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                <span>Connect with top talent and opportunities</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Where Talent Meets Opportunity
              </h1>
              <p className="max-w-[700px] text-white/80 md:text-xl">
                Find your next gig or hire exceptional talent. One platform, endless possibilities.
              </p>
              <div className="w-full max-w-2xl relative mt-6">
                <AISearch />
                <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm text-white/70">
                  <span>Popular:</span>
                  <Link href="#" className="hover:text-white transition-colors">
                    Web Development
                  </Link>
                  <Link href="#" className="hover:text-white transition-colors">
                    UI/UX Design
                  </Link>
                  <Link href="#" className="hover:text-white transition-colors">
                    Content Writing
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild size="lg" className="bg-white text-violet-600 hover:bg-white/90">
                  <Link href="/find-jobs">Find Jobs</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/hire-talent">Hire Talent</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-violet-600">10k+</h3>
                <p className="text-muted-foreground">Active Freelancers</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-violet-600">5k+</h3>
                <p className="text-muted-foreground">Jobs Posted</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-violet-600">98%</h3>
                <p className="text-muted-foreground">Client Satisfaction</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-violet-600">$10M+</h3>
                <p className="text-muted-foreground">Paid to Freelancers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Popular Categories</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Browse work by category</p>
            </div>
            <PopularCategories />
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Featured Jobs</h2>
                <p className="mt-2 text-muted-foreground">Discover opportunities that match your skills</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/find-jobs" className="gap-1">
                  View All Jobs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <FeaturedJobs />
            <div className="mt-10 flex justify-center md:hidden">
              <Button asChild variant="outline">
                <Link href="/find-jobs" className="gap-1">
                  View All Jobs <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Talent Showcase */}
        <section className="py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Top Talent</h2>
                <p className="mt-2 text-muted-foreground">Discover skilled professionals ready for your projects</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link href="/hire-talent" className="gap-1">
                  View All Talent <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <TalentShowcase />
            <div className="mt-10 flex justify-center md:hidden">
              <Button asChild variant="outline">
                <Link href="/hire-talent" className="gap-1">
                  View All Talent <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">Simple steps to start your journey</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                <p className="text-muted-foreground">Showcase your skills or post your job requirements in minutes.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600 mb-4">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Connect</h3>
                <p className="text-muted-foreground">
                  Find the perfect match for your project or discover ideal opportunities.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-4">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Collaborate & Grow</h3>
                <p className="text-muted-foreground">Work together seamlessly and build your professional network.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[700px] text-white/80 md:text-xl">
                Join thousands of professionals and businesses already connecting on our platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild size="lg" className="bg-white text-violet-600 hover:bg-white/90">
                  <Link href="/post-job">Post a Job</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/add-work">Add Your Work</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    </div>
  );
};

export default Home;
