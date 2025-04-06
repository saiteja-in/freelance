"use client";

import React, { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Define types for our data
interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author?: {
    login: string;
    avatar_url: string;
  };
}

interface Contributor {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

interface RepoDetails {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
}

interface CommitStat {
  date: string;
  commits: number;
}

interface ContributorPieData {
  name: string;
  value: number;
}

function Progress() {
  const [repoUrl, setRepoUrl] = useState<string>("");
  const [commits, setCommits] = useState<Commit[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [commitStats, setCommitStats] = useState<CommitStat[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);

  const parseRepo = (url: string) => {
    try {
      const parts = new URL(url).pathname.split("/");
      const owner = parts[1];
      const repo = parts[2];
      if (!owner || !repo) throw new Error("Invalid repo URL");
      return { owner, repo };
    } catch {
      throw new Error("Invalid repo URL");
    }
  };

  const fetchRepoData = async () => {
    setError("");
    setCommits([]);
    setContributors([]);
    setCommitStats([]);
    setRepoDetails(null);
    setLoading(true);

    try {
      const { owner, repo } = parseRepo(repoUrl);
      
      // Fetch repo data, commits, and contributors
      const [repoRes, commitsRes, contributorsRes] = await Promise.all([
        fetch(`https://api.github.com/repos/${owner}/${repo}`),
        fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=30`),
        fetch(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=10`)
      ]);

      if (!repoRes.ok || !commitsRes.ok || !contributorsRes.ok) {
        throw new Error("Error fetching data. Check the repo name or if it's private.");
      }

      const repoData = await repoRes.json() as RepoDetails;
      const commitsData = await commitsRes.json() as Commit[];
      const contributorsData = await contributorsRes.json() as Contributor[];

      // Process commit data for charts
      const commitsByDate: Record<string, number> = {};
      const now = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        commitsByDate[dateStr] = 0;
      }

      commitsData.forEach(commit => {
        const date = commit.commit.author.date.split('T')[0];
        if (commitsByDate[date] !== undefined) {
          commitsByDate[date]++;
        }
      });

      const commitStatsData = Object.keys(commitsByDate).map(date => ({
        date: date.substring(5), // Format as MM-DD
        commits: commitsByDate[date]
      }));

      setRepoDetails(repoData);
      setCommits(commitsData.slice(0, 5)); // Keep just the 5 most recent for the list
      setContributors(contributorsData);
      setCommitStats(commitStatsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to format commit message to truncate if too long
  const formatCommitMessage = (message: string) => {
    const firstLine = message.split('\n')[0];
    return firstLine.length > 80 ? firstLine.substring(0, 77) + '...' : firstLine;
  };

  // Get timeago string
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;
    
    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
  };

  // Prepare data for the contributor pie chart
  const contributorPieData: ContributorPieData[] = contributors.slice(0, 5).map(contributor => ({
    name: contributor.login,
    value: contributor.contributions
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter GitHub repo URL (e.g. https://github.com/vercel/next.js)"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full p-2 border rounded bg-background text-foreground"
        />
        <button
          onClick={fetchRepoData}
          disabled={!repoUrl || loading}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Fetching..." : "Track Progress"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {repoDetails && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>{repoDetails.name}</CardTitle>
              <CardDescription>{repoDetails.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>⭐ Stars: {repoDetails.stargazers_count}</div>
                <div>🍴 Forks: {repoDetails.forks_count}</div>
                <div>👁️ Watchers: {repoDetails.watchers_count}</div>
                <div>⚠️ Issues: {repoDetails.open_issues_count}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={commitStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="commits" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Commits"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {contributors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={contributors.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="login" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="contributions" fill="#82ca9d" name="Contributions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {contributors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Contribution Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={contributorPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}: {name: string, percent: number}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {contributorPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {commits.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Latest Commits</CardTitle>
            <CardDescription>Recent activity in this repository</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commits.map((commit, index) => (
                <motion.div 
                  key={commit.sha}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500" />
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar className="h-10 w-10 border">
                          <AvatarImage src={commit.author?.avatar_url || "/api/placeholder/40/40"} alt={commit.commit.author.name} />
                          <AvatarFallback>{commit.commit.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="font-semibold text-base">
                            {formatCommitMessage(commit.commit.message)}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-sm text-muted-foreground">
                              {commit.commit.author.name}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {getTimeAgo(commit.commit.author.date)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-xs font-mono bg-muted p-1 rounded overflow-x-auto">
                        {commit.sha.substring(0, 7)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            Showing the 5 most recent commits
          </CardFooter>
        </Card>
      )}

      {contributors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              All Contributors ({contributors.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-4">
              {contributors.map((contributor) => (
                <motion.li
                  key={contributor.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-muted p-2 rounded"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                    <AvatarFallback>{contributor.login.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <a
                    href={contributor.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium"
                  >
                    {contributor.login}
                  </a>
                  <Badge variant="secondary" className="text-xs">
                    {contributor.contributions}
                  </Badge>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default Progress;