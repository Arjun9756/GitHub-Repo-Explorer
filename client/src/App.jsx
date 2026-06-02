import { useState } from "react";
import { getRepos, getUser } from "./services/api";
import "./App.css";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function App() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [sortBy, setSortBy] = useState("stars");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError("");
      setRepos([]);
      setCurrentPage(1);

      const userData = await getUser(username.trim());
      setUser(userData);

      const repoData = await getRepos(username.trim(), 1);
      setRepos(repoData.repos);
      setHasNextPage(repoData.hasNextPage);
      setCurrentPage(repoData.currentPage);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("GitHub user not found");
      } else {
        setError("Network error. Please try again.");
      }
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      const repoData = await getRepos(username, nextPage);
      setRepos((prev) => [...prev, ...repoData.repos]);
      setHasNextPage(repoData.hasNextPage);
      setCurrentPage(repoData.currentPage);
    } catch (err) {
      setError("Failed to load more repositories");
    } finally {
      setLoadingMore(false);
    }
  };

  const sortedRepos = [...repos].sort((a, b) => {
    switch (sortBy) {
      case "stars":
        return b.stargazers_count - a.stargazers_count;
      case "name":
        return a.name.localeCompare(b.name);
      case "updated":
        return new Date(b.updated_at) - new Date(a.updated_at);
      default:
        return 0;
    }
  });

  return (
    <>
      {/* Header */}
      <div className="header">
        <div className="container">
          <h1>GitHub Repo Explorer</h1>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="content">
        <div className="container">
          {error && <div className="error">{error}</div>}

          {loading && <div className="loading">Loading user data...</div>}

          {!loading && user && (
            <>
              {/* Profile Card */}
              <div className="profile-card">
                <img src={user.avatar_url} alt={user.login} />
                <div className="profile-info">
                  <h2>{user.name || user.login}</h2>
                  <p>{user.bio || "No bio available"}</p>
                  <p>Location: {user.location || "Not specified"}</p>

                  <div className="stats">
                    <div className="stat">
                      <div className="stat-value">{user.followers}</div>
                      <div className="stat-label">Followers</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{user.following}</div>
                      <div className="stat-label">Following</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{user.public_repos}</div>
                      <div className="stat-label">Repositories</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Repositories Section */}
              <div className="repos-section">
                <div className="repos-header">
                  <h3>Repositories ({repos.length} of {user.public_repos})</h3>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="stars">Sort by Stars</option>
                    <option value="name">Sort by Name</option>
                    <option value="updated">Sort by Updated</option>
                  </select>
                </div>

                {sortedRepos.length === 0 ? (
                  <div className="no-repos">No repositories found</div>
                ) : (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>Repository</th>
                          <th>Language</th>
                          <th>Stars</th>
                          <th>Forks</th>
                          <th>Issues</th>
                          <th>Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRepos.map((repo) => (
                          <tr key={repo.id}>
                            <td>
                              <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-name">
                                {repo.name}
                              </a>
                              <p className="repo-desc">{repo.description || "No description"}</p>
                            </td>
                            <td>
                              {repo.language ? <span className="badge">{repo.language}</span> : "-"}
                            </td>
                            <td>{repo.stargazers_count}</td>
                            <td>{repo.forks_count}</td>
                            <td>{repo.open_issues_count}</td>
                            <td>{formatDate(repo.updated_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {hasNextPage && (
                      <button className="load-more" onClick={handleLoadMore} disabled={loadingMore}>
                        {loadingMore ? "Loading..." : "Load More"}
                      </button>
                    )}

                    {!hasNextPage && repos.length > 0 && (
                      <div className="message">
                        All {repos.length} repositories loaded!
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
