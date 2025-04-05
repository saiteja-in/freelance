import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = await req.json();
    
    // Extract username from GitHub URL
    const username = repoUrl.split('github.com/')[1]?.split('/')[0];

    if (!username) {
      return NextResponse.json({ error: 'Invalid GitHub profile link' }, { status: 400 });
    }

    // Fetch various GitHub data in parallel
    const [
      userRes,
      reposRes,
      eventsRes,
      followersRes,
      contributionsRes
    ] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`),
      fetch(`https://api.github.com/users/${username}/events?per_page=10`),
      fetch(`https://api.github.com/users/${username}/followers?per_page=10`),
      fetch(`https://api.github.com/search/commits?q=author:${username}&sort=author-date&order=desc&per_page=10`)
    ]);

    // Handle API errors
    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch GitHub data: ' + 
          (await userRes.text() || await reposRes.text())
      }, { status: 500 });
    }

    // Parse response data
    const userData = await userRes.json();
    const repos = await reposRes.json();
    
    // These endpoints might fail due to GitHub API limitations but we still want to return what we can
    const events = eventsRes.ok ? await eventsRes.json() : [];
    const followers = followersRes.ok ? await followersRes.json() : [];
    const contributions = contributionsRes.ok ? 
      await contributionsRes.json() : { items: [] };

    // Get languages for top repos
    const repoLanguages = await Promise.all(
      repos.slice(0, 5).map(async (repo: any) => {
        if (!repo.languages_url) return null;
        const langRes = await fetch(repo.languages_url);
        return langRes.ok ? await langRes.json() : null;
      })
    );

    // Compile all data
    const githubData = {
      profile: userData,
      repos: repos,
      recentActivity: events,
      followers: followers,
      contributions: contributions.items,
      languages: repoLanguages.filter(Boolean),
      
      // Compute summary statistics
      stats: {
        totalRepos: userData.public_repos,
        totalStars: repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0),
        totalForks: repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0),
        totalWatchers: repos.reduce((sum: number, repo: any) => sum + repo.watchers_count, 0),
        mostUsedLanguages: calculateMostUsedLanguages(repoLanguages)
      }
    };

    return NextResponse.json(githubData);
  } catch (error: any) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ 
      error: 'GitHub API request failed: ' + (error.message || 'Unknown error') 
    }, { status: 500 });
  }
}

// Helper function to calculate most used languages
function calculateMostUsedLanguages(languagesData: any[]) {
  const langCount: Record<string, number> = {};
  
  languagesData.forEach(repoLangs => {
    if (!repoLangs) return;
    
    Object.keys(repoLangs).forEach(lang => {
      langCount[lang] = (langCount[lang] || 0) + repoLangs[lang];
    });
  });
  
  // Convert to array and sort by byte count (descending)
  return Object.entries(langCount)
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5); // Top 5 languages
}