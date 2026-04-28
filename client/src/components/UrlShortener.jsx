import { useState, useEffect } from "react";
import { shortenUrl } from "../services/api";
import "../css/url-shortner.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Copy,
  Check,
  Loader2,
  ExternalLink,
  History,
} from "lucide-react";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // 📌 Pagination states
  const [recentLinks, setRecentLinks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (longUrl && error) setError("");
  }, [longUrl]);

  const fetchHistory = async (pageNumber) => {
    try {
      setLoadingHistory(true);

      const res = await fetch(
        `http://localhost:3000/history?page=${pageNumber}&limit=5`,
      );

      const data = await res.json();

      if (pageNumber === 1) {
        setRecentLinks(data.data);
      } else {
        setRecentLinks((prev) => [...prev, ...data.data]);
      }

      setHasMore(pageNumber < data.totalPages);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory(1);
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();

    if (!longUrl.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setShortUrl("");

      const data = await shortenUrl(longUrl);
      setShortUrl(data.shortUrl);

      // 🔥 refresh history after new URL
      fetchHistory(1);
      setPage(1);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchHistory(nextPage);
  };

  const copyToClipboard = () => {
    if (!shortUrl) return;
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        {/* Header */}
        <div className="header">
          <div className="icon">
            <Link2 size={18} color="white" />
          </div>
          <h1>URL Shortener</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleShorten}>
          <input
            className="input"
            placeholder="Enter long URL..."
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button className="button" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spin" /> Shortening...
              </>
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>

        {/* Result */}
        <AnimatePresence>
          {shortUrl && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="result"
            >
              <div className="resultRow">
                <a href={shortUrl} target="_blank" rel="noreferrer">
                  {shortUrl}
                </a>

                <div className="actions">
                  <button onClick={copyToClipboard}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>

                  <a href={shortUrl} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* History */}
        <div className="history">
          <h3>
            <History size={14} /> Recent
          </h3>

          {recentLinks.map((l, i) => (
            <div key={i} className="item">
              <span>
                <a
                  href={l.shortUrl || `http://localhost:3000/${l.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="short-url"
                >
                  {l.shortUrl || `http://localhost:3000/${l.shortCode}`}
                </a>
              </span>

            </div>
          ))}
          {/* Load more button */}
          {hasMore && (
            <div className="loadMore">
              <button
                className="button"
                onClick={loadMore}
                disabled={loadingHistory}
                style={{ marginTop: "10px", width: "max-content" }}
              >
                {loadingHistory ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
