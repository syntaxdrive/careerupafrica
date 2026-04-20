import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { getPostBySlug, deletePost, type BlogPost } from '../../lib/blogService';
import './Blog.css';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = profile?.user_type === 'admin';

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    if (!slug) return;

    try {
      setIsLoading(true);
      const data = await getPostBySlug(slug);
      
      if (!data) {
        setError('Post not found');
      } else {
        setPost(data);
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load blog post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    const result = await deletePost(post.id);
    if (result.success) {
      navigate('/blog');
    } else {
      alert(result.error || 'Failed to delete post');
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
      <div className="blog-detail-page">
        <div className="loading-state">Loading post...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-detail-page">
        <div className="error-banner">
          {error || 'Post not found'}
        </div>
        <button onClick={() => navigate('/blog')} className="btn-secondary">
          ← Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      {/* Admin Actions */}
      {isAdmin && (
        <div className="blog-admin-actions">
          <span className={`blog-status-badge ${post.status}`}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </span>
          <button
            onClick={() => navigate(`/blog/edit/${post.id}`)}
            className="btn-secondary"
          >
            Edit Post
          </button>
          <button
            onClick={handleDelete}
            className="btn-danger"
          >
            Delete
          </button>
        </div>
      )}

      <div className="blog-detail-header">
        {/* Breadcrumb */}
        <div className="blog-breadcrumb">
          <button onClick={() => navigate('/blog')}>Blog</button>
          <span>›</span>
          <span>{post.title}</span>
        </div>

        {/* Title */}
        <h1 className="blog-detail-title">{post.title}</h1>

        {/* Meta */}
        <div className="blog-detail-meta">
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {formatDate(post.published_at)}
          </span>
          <span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path
                d="M6 21C6 17.6863 8.68629 15 12 15C15.3137 15 18 17.6863 18 21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {post.author_name || 'Anonymous'}
          </span>
          <span>
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
            {post.view_count} views
          </span>
        </div>
      </div>

      {/* Cover Image */}
      {post.cover_image_url && (
        <div className="blog-detail-cover">
          <img src={post.cover_image_url} alt={post.title} />
        </div>
      )}

      {/* Content */}
      <div 
        className="blog-detail-content"
        dangerouslySetInnerHTML={{ 
          __html: post.content.replace(/\n/g, '<br />') 
        }}
      />

      {/* Back Button */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <button onClick={() => navigate('/blog')} className="btn-secondary">
          ← Back to Blog
        </button>
      </div>
    </div>
  );
}
