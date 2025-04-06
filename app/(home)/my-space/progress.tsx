"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useCallback } from "react";

interface Commit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

interface Contributor {
  id: number;
  login: string;
  html_url: string;
  avatar_url: string;
}

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

function Progress() {
  const [repoUrl, setRepoUrl] = useState(
    "https://github.com/viswaprateek/MentorConnect"
  );
  const [commits, setCommits] = useState<Commit[]>([]);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parseRepo = (url: string) => {
    try {
      const parts = new URL(url).pathname.split("/");
      const owner = parts[1];
      const repo = parts[2];
      if (!owner || !repo) throw new Error("Invalid repo URL");
      return { owner, repo };
    } catch {
      throw new Error("Invalid GitHub URL");
    }
  };

  const fetchData = useCallback(async () => {
    setError("");
    setCommits([]);
    setContributors([]);
    setLoading(true);

    try {
      const { owner, repo } = parseRepo(repoUrl);

      const headers = {
        Authorization: `token ${GITHUB_TOKEN}`,
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
        throw new Error("Error fetching repo data");
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
  },[repoUrl]);

  useEffect(() => {
    fetchData(); // Auto-fetch when component loads with default repo
  }, [fetchData]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-6">
        <input
          type="text"
          placeholder="GitHub Repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          className="w-full p-2 border rounded bg-background text-foreground"
        />
        <button
          onClick={fetchData}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Fetching..." : "Track Progress"}
        </button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {commits.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Latest Commits</h2>
          <ul className="space-y-3">
            {commits.map((commit) => (
              <li key={commit.sha} className="border p-3 rounded bg-muted">
                <p className="font-medium">{commit.commit.message}</p>
                <p className="text-sm text-muted-foreground">
                  {commit.commit.author.name} •{" "}
                  {new Date(commit.commit.author.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contributors.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Contributors ({contributors.length})
          </h2>
          <ul className="flex flex-wrap gap-3">
            {contributors.map((contributor) => (
              <li
                key={contributor.id}
                className="flex items-center gap-2 bg-muted px-3 py-2 rounded"
              >
                <Image
                  src={contributor.avatar_url}
                  alt={contributor.login}
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
