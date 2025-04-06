"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN; // Add this to your .env.local

function Progress() {
  const [repoUrl, setRepoUrl] = useState("");
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const { owner, repo } = parseRepo(repoUrl);
      const headers = {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
      };

      const [commitsRes, contributorsRes] = await Promise.all([
        fetch(
          `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
          { headers }
        ),
        fetch(`https://api.github.com/repos/${owner}/${repo}/contributors`, {
          headers,
        }),
      ]);

      if (!commitsRes.ok || !contributorsRes.ok) {
        throw new Error("Error fetching data. Check token or repo name.");
      }

      const commitsData = await commitsRes.json();
      const contributorsData = await contributorsRes.json();

      setCommits(commitsData);
      setContributors(contributorsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
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

      {commits.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Latest Commits</h2>
          <ul className="space-y-2">
            {commits.map((commit: any) => (
              <li key={commit.sha} className="p-2 border rounded bg-muted">
                <div className="text-sm font-medium">
                  {commit.commit.message}
                </div>
                <div className="text-xs text-muted-foreground">
                  {commit.commit.author.name} •{" "}
                  {new Date(commit.commit.author.date).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contributors.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2">
            Contributors ({contributors.length})
          </h2>
          <ul className="flex flex-wrap gap-4">
            {contributors.map((contributor: any) => (
              <li
                key={contributor.id}
                className="flex items-center gap-2 bg-muted p-2 rounded"
              >
                <Image
                  width={24}
                  height={24}
                  alt="avatar"
                  src={contributor.avatar_url}
                  className="w-6 h-6 rounded-full"
                />
                <a
                  href={contributor.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium"
                >
                  {contributor.login}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Progress;
