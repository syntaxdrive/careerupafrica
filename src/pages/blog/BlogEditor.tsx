import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../stores/authStore';
import {
  createPost,
  updatePost,
  getPostById,
  generateSlug,
  getAllCategories,
  type CreatePostData,
  type BlogCategory,
} from '../../lib/blogService';
import './BlogEditor.css';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  status: 'draft' | 'published';
  category_ids: string[];
}

export default function BlogEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<BlogCategory[]>([]);

  const isEdit = !!id;
  const isAdmin = profile?.user_type === 'admin';

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_image_url: '',
      status: 'draft',
      category_ids: [],
    },
  });

  const title = watch('title');
  const slug = watch('slug');
  const content = watch('content');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/blog');
      return;
    }

    loadCategories();

    if (isEdit && id) {
      loadPost();
    }
  }, [id, isAdmin]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEdit && title && !slug) {
      setValue('slug', generateSlug(title));
    }
  }, [title, isEdit, slug]);

  const loadCategories = async () => {
    const cats = await getAllCategories();
    setCategories(cats);
  };

  const loadPost = async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const post = await getPostById(id);
      
      if (!post) {
        setError('Post not found');
        return;
      }

      setValue('title', post.title);
      setValue('slug', post.slug);
      setValue('excerpt', post.excerpt || '');
      setValue('content', post.content);
      setValue('cover_image_url', post.cover_image_url || '');
      setValue('status', post.status === 'archived' ? 'draft' : post.status);
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BlogFormData) => {
    if (!user) {
      setError('You must be logged in');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      if (isEdit && id) {
        // Update existing post
        const result = await updatePost(id, {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || undefined,
          content: data.content,
          cover_image_url: data.cover_image_url || undefined,
          status: data.status,
        });

        if (result.success) {
          navigate(`/blog/${data.slug}`);
        } else {
          setError(result.error || 'Failed to update post');
        }
      } else {
        // Create new post
        const postData: CreatePostData = {
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || undefined,
          content: data.content,
          cover_image_url: data.cover_image_url || undefined,
          status: data.status,
          category_ids: data.category_ids.length > 0 ? data.category_ids : undefined,
        };

        const result = await createPost(user.id, postData);

        if (result.success && result.post) {
          navigate(`/blog/${result.post.slug}`);
        } else {
          setError(result.error || 'Failed to create post');
        }
      }
    } catch (err) {
      console.error('Error saving post:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="blog-editor-page">
        <div className="loading-state">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="blog-editor-page">
      <div className="editor-header">
        <h1>{isEdit ? 'Edit Post' : 'Create New Post'}</h1>
        <button onClick={() => navigate('/blog')} className="btn-secondary">
          Cancel
        </button>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="blog-editor-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title', {
              required: 'Title is required',
              minLength: { value: 5, message: 'Title must be at least 5 characters' },
              maxLength: { value: 200, message: 'Title must be 200 characters or less' },
            })}
            placeholder="Enter post title"
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>

        {/* Slug */}
        <div className="form-group">
          <label htmlFor="slug">
            URL Slug <span className="required">*</span>
          </label>
          <input
            id="slug"
            type="text"
            {...register('slug', {
              required: 'Slug is required',
              pattern: {
                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                message: 'Slug must be lowercase letters, numbers, and hyphens only',
              },
            })}
            placeholder="post-url-slug"
            className={errors.slug ? 'error' : ''}
          />
          <p className="field-hint">
            Used in the URL: /blog/{slug || 'your-slug-here'}
          </p>
          {errors.slug && <p className="error-text">{errors.slug.message}</p>}
        </div>

        {/* Excerpt */}
        <div className="form-group">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            {...register('excerpt', {
              maxLength: { value: 300, message: 'Excerpt must be 300 characters or less' },
            })}
            placeholder="Brief summary shown in post listings"
            rows={3}
            className={errors.excerpt ? 'error' : ''}
          />
          <p className="field-hint">Optional - A brief summary for the blog listing page</p>
          {errors.excerpt && <p className="error-text">{errors.excerpt.message}</p>}
        </div>

        {/* Cover Image */}
        <div className="form-group">
          <label htmlFor="cover_image_url">Cover Image URL</label>
          <input
            id="cover_image_url"
            type="url"
            {...register('cover_image_url')}
            placeholder="https://example.com/image.jpg"
          />
          <p className="field-hint">Optional - URL to cover image</p>
        </div>

        {/* Content */}
        <div className="form-group">
          <label htmlFor="content">
            Content (Markdown) <span className="required">*</span>
          </label>
          <textarea
            id="content"
            {...register('content', {
              required: 'Content is required',
              minLength: { value: 50, message: 'Content must be at least 50 characters' },
            })}
            placeholder="Write your post content in Markdown format..."
            rows={20}
            className={errors.content ? 'error' : ''}
          />
          <p className="field-hint">
            Supports Markdown formatting: **bold**, *italic*, # headings, [links](url), etc.
          </p>
          <div className="char-count">
            {content?.length || 0} characters
          </div>
          {errors.content && <p className="error-text">{errors.content.message}</p>}
        </div>

        {/* Categories */}
        {!isEdit && categories.length > 0 && (
          <div className="form-group">
            <label>Categories (Optional)</label>
            <div className="checkbox-group">
              {categories.map((category) => (
                <label key={category.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={category.id}
                    {...register('category_ids')}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">
            Status <span className="required">*</span>
          </label>
          <select id="status" {...register('status')}>
            <option value="draft">Draft (not visible to public)</option>
            <option value="published">Published (publicly visible)</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="btn-secondary"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : isEdit ? 'Update Post' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
