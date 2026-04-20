import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getAllPosts, type BlogPost } from '../../lib/blogService';
import './Blog.css';

export default function BlogList() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = profile?.user_type === 'admin';

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getAllPosts(false); // Only published posts
      setPosts(data);
      setError('');
    } catch (err) {
      console.error('Error loading posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Draft';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="blog-page">
        <div className="loading-state">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      <header className="blog-header">
        <div className="blog-header-content">
          <div>
            <h1>CareerUp Africa Blog</h1>
            <p>Stories, insights, and updates from our community</p>
          </div>
          {isAdmin && (
            <button 
              className="btn-primary"
              onClick={() => navigate('/blog/create/new')}
            >
              + Create Post
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Check back soon for updates!</p>
        </div>
      ) : (
        <div className="blog-grid">
          {posts.map((post) => (
            <article
              key={post.id}
              className="blog-card"
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              {post.cover_image_url && (
                <div className="blog-card-image">
                  <img src={post.cover_image_url} alt={post.title} />
                </div>
              )}
              <div className="blog-card-content">
                <div className="blog-card-meta">
                  <span className="blog-date">{formatDate(post.published_at)}</span>
                  {post.view_count > 0 && (
                    <span className="blog-views">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      {post.view_count}
                    </span>
                  )}
                </div>
                <h2 className="blog-card-title">{post.title}</h2>
                {post.excerpt && (
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                )}
                <div className="blog-card-footer">
                  <span className="blog-author">By {post.author_name || 'Anonymous'}</span>
                  <span className="blog-read-more">
                    Read more →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
