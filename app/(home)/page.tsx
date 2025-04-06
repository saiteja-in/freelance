import React from "react";
import NavBar from "../_components/navbar";
import { currentUser } from "@/lib/auth";
import { ExtendedUser } from "@/schemas";
import { getActiveProducts } from "@/lib/server-actions";
import Link from "next/link";
import { ArrowRight, Search, Sparkles, TrendingUp, Users, Briefcase } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FeaturedJobs } from "@/components/featured-jobs";
import { PopularCategories } from "@/components/popular-categories";
import { TalentShowcase } from "@/components/talent-showcase";

const Home = async () => {
  const user = (await currentUser()) as ExtendedUser;
  const activeProducts = await getActiveProducts();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <NavBar />
      
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section - Improved gradient and accessibility */}
          <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 to-fuchsia-600 dark:from-violet-800 dark:to-fuchsia-900 py-24 md:py-32">
            <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] opacity-10 bg-cover bg-center mix-blend-overlay" />
            <div className="container px-4 md:px-6 mx-auto relative z-10">
              <div className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
                <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-xl">
                  <Sparkles className="mr-2 h-3.5 w-3.5" />
                  <span>Connect with top talent and opportunities</span>
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                  Where Talent Meets Opportunity
                </h1>
                <p className="max-w-[700px] text-white/90 md:text-xl leading-relaxed">
                  Find your next gig or hire exceptional talent. One platform, endless possibilities.
                </p>
                <div className="w-full max-w-2xl relative mt-6">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-white/60" />
                    <Input
                      className="w-full bg-white/15 border-0 pl-12 pr-24 py-6 text-white placeholder:text-white/60 focus-visible:ring-2 focus-visible:ring-white/30 rounded-full"
                      placeholder="Search for jobs, talent, or skills..."
                      type="search"
                    />
                    <Button className="absolute right-2 bg-white text-violet-700 hover:bg-white/90 hover:text-violet-800 rounded-full font-medium">
                      Search
                    </Button>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-white/80">
                    <span>Popular:</span>
                    <Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                      Web Development
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                      UI/UX Design
                    </Link>
                    <Link href="#" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                      Content Writing
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button asChild size="lg" className="bg-white text-violet-700 hover:bg-white/90 rounded-full px-8">
                    <Link href="/find-jobs">Find Jobs</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/15 rounded-full px-8">
                    <Link href="/hire-talent">Hire Talent</Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section - Improved for dark mode */}
          <section className="py-16 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-violet-600 dark:text-violet-400">10k+</h3>
                  <p className="text-slate-600 dark:text-slate-400">Active Freelancers</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-violet-600 dark:text-violet-400">5k+</h3>
                  <p className="text-slate-600 dark:text-slate-400">Jobs Posted</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-violet-600 dark:text-violet-400">98%</h3>
                  <p className="text-slate-600 dark:text-slate-400">Client Satisfaction</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-bold text-violet-600 dark:text-violet-400">$10M+</h3>
                  <p className="text-slate-600 dark:text-slate-400">Paid to Freelancers</p>
                </div>
              </div>
            </div>
          </section>

          {/* Popular Categories - Improved contrast */}
          <section className="py-20 bg-slate-100 dark:bg-slate-900/60 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">Popular Categories</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 md:text-lg">Browse work by category</p>
              </div>
              <PopularCategories />
            </div>
          </section>

          {/* Featured Jobs */}
          <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 dark:text-white">Featured Jobs</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">Discover opportunities that match your skills</p>
                </div>
                <Button asChild variant="outline" className="hidden md:flex border-violet-600 text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950/50">
                  <Link href="/find-jobs" className="gap-2">
                    View All Jobs <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <FeaturedJobs />
              <div className="mt-12 flex justify-center md:hidden">
                <Button asChild variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950/50">
                  <Link href="/find-jobs" className="gap-2">
                    View All Jobs <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Talent Showcase */}
          <section className="py-20 bg-slate-100 dark:bg-slate-900/60 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-slate-900 dark:text-white">Top Talent</h2>
                  <p className="mt-2 text-slate-600 dark:text-slate-400">Discover skilled professionals ready for your projects</p>
                </div>
                <Button asChild variant="outline" className="hidden md:flex border-violet-600 text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950/50">
                  <Link href="/hire-talent" className="gap-2">
                    View All Talent <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <TalentShowcase />
              <div className="mt-12 flex justify-center md:hidden">
                <Button asChild variant="outline" className="border-violet-600 text-violet-600 hover:bg-violet-50 dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-950/50">
                  <Link href="/hire-talent" className="gap-2">
                    View All Talent <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* How It Works - Card design improvements */}
          <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">How It Works</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 md:text-lg">Simple steps to start your journey</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-400 mb-6">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Create Your Profile</h3>
                  <p className="text-slate-600 dark:text-slate-400">Showcase your skills or post your job requirements in minutes.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 text-fuchsia-600 dark:text-fuchsia-400 mb-6">
                    <Search className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Connect</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Find the perfect match for your project or discover ideal opportunities.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 mb-6">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Collaborate & Grow</h3>
                  <p className="text-slate-600 dark:text-slate-400">Work together seamlessly and build your professional network.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section - New section */}
          <section className="py-20 bg-slate-100 dark:bg-slate-900/60 transition-colors duration-300">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-slate-900 dark:text-white">What Our Users Say</h2>
                <p className="mt-4 text-slate-600 dark:text-slate-400 md:text-lg">Success stories from our community</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
                      <span className="font-bold text-lg">JD</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Jane Doe</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Freelance Developer</p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">Ive secured consistent work and doubled my income since joining this platform. The quality of clients is exceptional.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-fuchsia-100 dark:bg-fuchsia-900/50 flex items-center justify-center text-fuchsia-600 dark:text-fuchsia-400">
                      <span className="font-bold text-lg">TS</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Thomas Smith</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Startup Founder</p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">Weve built our entire development team through this platform. The talent quality and reliability have been outstanding.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <span className="font-bold text-lg">AL</span>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-slate-900 dark:text-white">Ava Liu</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">UX Designer</p>
                    </div>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 italic">The opportunities Ive found here have transformed my career. The platform makes it easy to showcase my portfolio and connect with clients.</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section - Improved gradient and accessibility */}
          <section className="py-20 bg-gradient-to-br from-violet-600 to-fuchsia-600 dark:from-violet-800 dark:to-fuchsia-900 text-white">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
                <p className="text-white/90 md:text-xl leading-relaxed">
                  Join thousands of professionals and businesses already connecting on our platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <Button asChild size="lg" className="bg-white text-violet-700 hover:bg-white/90 rounded-full px-8">
                    <Link href="/post-job">
                      <span className="flex items-center">
                        <Briefcase className="mr-2 h-5 w-5" />
                        Post a Job
                      </span>
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/15 rounded-full px-8">
                    <Link href="/add-work">
                      <span className="flex items-center">
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Add Your Work
                      </span>
                    </Link>
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