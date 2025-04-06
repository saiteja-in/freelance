'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';

interface User {
  name: string | null;
  email: string;
  image: string | null;
  bio?: string | null;
  location?: string | null;
  githubLink?: string | null;
  portfolioLink?: string | null;
  linkedinLink?: string | null;
  twitterLink?: string | null;
  websiteLink?: string | null;
  skills: string[];
  experienceRange?: string | null;
  resume?: string | null;
}

type GitHubData = {
  profile: {
    login: string;
    name: string;
    avatar_url: string;
    html_url: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    updated_at: string;
    location: string;
    company: string;
    blog: string;
  };
  repos: any[];
  recentActivity: any[];
  followers: any[];
  contributions: any[];
  languages: any[];
  stats: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    totalWatchers: number;
    mostUsedLanguages: { name: string; bytes: number }[];
  };
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [githubData, setGithubData] = useState<GitHubData | null>(null);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState("");
const router = useRouter();
  useEffect(() => {
    fetch('/api/user/profile')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: keyof User, value: string | string[]) => {
    if (!form) return;
    setForm({ ...form, [key]: value });
  };

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);

    const dataToSend = {
      ...form,
      skills: Array.isArray(form.skills)
        ? form.skills
        : String(form.skills).split(',').map((s) => s.trim()),
    };

    const res = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      toast.success('Profile updated!');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      toast.error('Failed to update profile');
    }

    setSaving(false);
  };

  const getGithubUsername = (url: string | null | undefined) => {
    if (!url) return null;
    try {
      const parts = new URL(url).pathname.split('/');
      return parts.filter(Boolean)[0];
    } catch {
      return null;
    }
  };

  const fetchGithubRepoData = useCallback(async () => {
    const username = getGithubUsername(user?.githubLink);
    if (!username) return;

    setGithubLoading(true);
    setGithubError("");

    try {
      const res = await fetch('/api/github-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: user?.githubLink }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch GitHub data");
      }

      const data = await res.json();
      setGithubData(data);
    } catch (err: any) {
      setGithubError(err.message || "An error occurred fetching GitHub data");
      console.error("GitHub data fetch error:", err);
    } finally {
      setGithubLoading(false);
    }
  }, [user?.githubLink]);

  useEffect(() => {
    if (user?.githubLink) {
      fetchGithubRepoData();
    }
  }, [user?.githubLink, fetchGithubRepoData]);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!user || !form) return <div className="p-8">User not found</div>;

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Avatar + Name */}
      <Card className="shadow-lg border rounded-2xl">
        <CardContent className="p-6 flex gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <Input
              placeholder="Your Name"
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="text-2xl font-semibold"
            />
            <p className="text-muted-foreground">{user.email}</p>
            <Input
              placeholder="Location"
              value={form.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              className="mt-2"
            />
          </div>
        </CardContent>
        <Button
          type="submit"
          className="mt-4 w-full"
          onClick={()=>{
            router.push('/resume-analysis')
          }}
        >
          Extract Resume Data
        </Button>
      </Card>

      {/* Bio */}
      <Card className="shadow-sm rounded-xl">
        <CardContent className="p-6 space-y-2">
          <h3 className="text-lg font-medium">Bio</h3>
          <Textarea
            placeholder="Tell us about yourself..."
            value={form.bio || ''}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="shadow-sm rounded-xl">
        <CardContent className="p-6 space-y-3">
          <h3 className="text-lg font-medium">Social Links</h3>
          <Input placeholder="GitHub" value={form.githubLink || ''} onChange={(e) => handleChange('githubLink', e.target.value)} />
          <Input placeholder="LinkedIn" value={form.linkedinLink || ''} onChange={(e) => handleChange('linkedinLink', e.target.value)} />
          <Input placeholder="Portfolio" value={form.portfolioLink || ''} onChange={(e) => handleChange('portfolioLink', e.target.value)} />
          <Input placeholder="Twitter" value={form.twitterLink || ''} onChange={(e) => handleChange('twitterLink', e.target.value)} />
          <Input placeholder="Website" value={form.websiteLink || ''} onChange={(e) => handleChange('websiteLink', e.target.value)} />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="shadow-sm rounded-xl">
        <CardContent className="p-6 space-y-2">
          <h3 className="text-lg font-medium">Skills (comma separated)</h3>
          <Input
            placeholder="e.g., JavaScript, Python, React"
            value={form.skills.join(', ')}
            onChange={(e) => handleChange('skills', e.target.value.split(',').map(s => s.trim()))}
          />
        </CardContent>
      </Card>

      {/* Resume & Experience */}
      <Card className="shadow-sm rounded-xl">
        <CardContent className="p-6 space-y-2">
          <Input
            placeholder="Experience (e.g., 1-3 years)"
            value={form.experienceRange || ''}
            onChange={(e) => handleChange('experienceRange', e.target.value)}
          />
          <Input
            placeholder="Resume URL"
            value={form.resume || ''}
            onChange={(e) => handleChange('resume', e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="text-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>

      {/* GitHub Section */}
      {user.githubLink && (
        <Card className="shadow-sm rounded-xl mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              GitHub Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {githubLoading && (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-16 w-5/6" />
              </div>
            )}
            
            {githubError && (
              <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
                <p className="font-medium">Error fetching GitHub data</p>
                <p>{githubError}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchGithubRepoData} 
                  className="mt-2"
                >
                  Retry
                </Button>
              </div>
            )}
            
            {githubData && (
              <div className="space-y-8">
                {/* Profile Overview */}
                <div className="flex items-start gap-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={githubData.profile.avatar_url} />
                    <AvatarFallback>{githubData.profile.login.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="text-xl font-semibold">{githubData.profile.name || githubData.profile.login}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{githubData.profile.bio}</p>
                    
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        <span className="text-sm">{githubData.stats.totalStars} stars</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/></svg>
                        <span className="text-sm">{githubData.stats.totalRepos} repos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <span className="text-sm">{githubData.profile.followers} followers</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      On GitHub since {formatDate(githubData.profile.created_at)}
                    </p>
                  </div>
                </div>
                
                {/* Top Languages */}
                <div>
                  <h4 className="text-md font-semibold mb-2">Top Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {githubData.stats.mostUsedLanguages.map((lang) => (
                      <Badge key={lang.name} variant="secondary">
                        {lang.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Recent Repositories */}
                <div>
                  <h4 className="text-md font-semibold mb-2">Recent Repositories</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {githubData.repos.slice(0, 4).map((repo) => (
                      <div key={repo.id} className="border rounded-md p-4 hover:bg-slate-50">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium">{repo.name}</h5>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                              {repo.stargazers_count}
                            </span>
                            <span className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"/><path d="M7 7v10"/><path d="M11 9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/></svg>
                              {repo.forks_count}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {repo.description || "No description available"}
                        </p>
                        {repo.language && (
                          <Badge variant="outline" className="mt-2">
                            {repo.language}
                          </Badge>
                        )}
                        <div className="mt-2">
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Repository
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div>
                  <h4 className="text-md font-semibold mb-2">Recent Activity</h4>
                  <div className="space-y-3">
                    {githubData.recentActivity.length > 0 ? (
                      githubData.recentActivity.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex gap-3 items-start">
                          <div className="bg-slate-100 rounded-full p-1 mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                          </div>
                          <div>
                            <p className="text-sm">
                              <span className="font-medium">{formatActivityType(event.type)}</span>
                              {' '}{event.repo?.name || ''}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(event.created_at)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent activity to show</p>
                    )}
                  </div>
                </div>
                
                {/* Contributions */}
                {githubData.contributions.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Recent Contributions</h4>
                    <div className="space-y-3">
                      {githubData.contributions.slice(0, 3).map((commit: any) => (
                        <div key={commit.sha} className="border-l-2 border-green-500 pl-3">
                          <p className="font-medium text-sm">{commit.commit?.message || "No message"}</p>
                          <p className="text-xs text-muted-foreground">
                            {commit.repository?.full_name || "Unknown repository"} • {formatDate(commit.commit?.author?.date || "")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Followers */}
                {githubData.followers.length > 0 && (
                  <div>
                    <h4 className="text-md font-semibold mb-2">Followers</h4>
                    <div className="flex flex-wrap gap-2">
                      {githubData.followers.slice(0, 8).map((follower: any) => (
                        <a 
                          href={follower.html_url}
                          target="_blank"
                          key={follower.id}
                          className="hover:opacity-80"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={follower.avatar_url} />
                            <AvatarFallback>{follower.login.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper function to format GitHub activity type
function formatActivityType(type: string): string {
  switch (type) {
    case 'PushEvent': return 'Pushed to';
    case 'CreateEvent': return 'Created';
    case 'IssuesEvent': return 'Updated issue in';
    case 'PullRequestEvent': return 'Opened PR in';
    case 'ForkEvent': return 'Forked';
    case 'WatchEvent': return 'Starred';
    case 'IssueCommentEvent': return 'Commented on';
    case 'CommitCommentEvent': return 'Commented on commit in';
    default: return type.replace('Event', '') + ' on';
  }
}