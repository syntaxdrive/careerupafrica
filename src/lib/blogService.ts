import { supabase, isSupabaseReady } from './supabase';

export interface BlogPost {
  id: string;
  author_id: string | null;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  author_name?: string;
  categories?: BlogCategory[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface BlogComment {
  id: string;
  post_id: string;
  author_id: string | null;
  content: string;
  status: 'pending' | 'approved' | 'spam';
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface CreatePostData {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  category_ids?: string[];
}

export interface UpdatePostData {
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image_url?: string;
  status?: 'draft' | 'published' | 'archived';
}

// ============================================
// DEMO MODE STORAGE
// ============================================
const DEMO_POSTS_KEY = 'careerup_demo_blog_posts';
const DEMO_CATEGORIES_KEY = 'careerup_demo_blog_categories';
const DEMO_COMMENTS_KEY = 'careerup_demo_blog_comments';

const getDemoPosts = (): BlogPost[] => {
  const stored = localStorage.getItem(DEMO_POSTS_KEY);
  if (!stored) {
    // Initialize with sample posts
    const samplePosts: BlogPost[] = [
      {
        id: 'demo-1',
        author_id: null,
        title: 'Welcome to CareerUp Africa Blog',
        slug: 'welcome-to-careerup-africa',
        excerpt: 'Learn about our mission to connect African talent with global opportunities.',
        content: '# Welcome to CareerUp Africa\n\nWe are building a bridge between talented African professionals and innovative founders worldwide.\n\n## Our Mission\n\nCareerUp Africa provides real-world work experience, mentorship, and verified credentials to help participants launch their careers.\n\n## Get Involved\n\nWhether you\'re a participant looking to gain experience or a founder seeking talented help, we\'re here to support you.',
        cover_image_url: null,
        status: 'published',
        published_at: new Date().toISOString(),
        view_count: 42,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author_name: 'CareerUp Team',
        categories: []
      }
    ];
    localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(samplePosts));
    return samplePosts;
  }
  return JSON.parse(stored);
};

const saveDemoPosts = (posts: BlogPost[]) => {
  localStorage.setItem(DEMO_POSTS_KEY, JSON.stringify(posts));
};

const getDemoCategories = (): BlogCategory[] => {
  const stored = localStorage.getItem(DEMO_CATEGORIES_KEY);
  if (!stored) {
    const categories: BlogCategory[] = [
      { id: 'cat-1', name: 'Company News', slug: 'company-news', description: 'Updates and announcements', created_at: new Date().toISOString() },
      { id: 'cat-2', name: 'Success Stories', slug: 'success-stories', description: 'Inspiring participant stories', created_at: new Date().toISOString() },
      { id: 'cat-3', name: 'Career Tips', slug: 'career-tips', description: 'Career development advice', created_at: new Date().toISOString() },
    ];
    localStorage.setItem(DEMO_CATEGORIES_KEY, JSON.stringify(categories));
    return categories;
  }
  return JSON.parse(stored);
};

const getDemoComments = (): BlogComment[] => {
  const stored = localStorage.getItem(DEMO_COMMENTS_KEY);
  return stored ? JSON.parse(stored) : [];
};

const saveDemoComments = (comments: BlogComment[]) => {
  localStorage.setItem(DEMO_COMMENTS_KEY, JSON.stringify(comments));
};

// ============================================
// BLOG POST CRUD
// ============================================

export async function getAllPosts(includeUnpublished = false): Promise<BlogPost[]> {
  if (!isSupabaseReady()) {
    const posts = getDemoPosts();
    return includeUnpublished ? posts : posts.filter(p => p.status === 'published');
  }

  try {
    let query = supabase!
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (full_name)
      `)
      .order('published_at', { ascending: false, nullsFirst: false });

    if (!includeUnpublished) {
      query = query.eq('status', 'published');
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((post: any) => ({
      ...post,
      author_name: post.profiles?.full_name || 'Anonymous',
    }));
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseReady()) {
    const posts = getDemoPosts();
    const post = posts.find(p => p.slug === slug);
    return post || null;
  }

  try {
    const { data, error } = await supabase!
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (full_name)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    // Increment view count
    await supabase!
      .from('blog_posts')
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', data.id);

    return {
      ...data,
      author_name: data.profiles?.full_name || 'Anonymous',
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  if (!isSupabaseReady()) {
    const posts = getDemoPosts();
    return posts.find(p => p.id === id) || null;
  }

  try {
    const { data, error } = await supabase!
      .from('blog_posts')
      .select(`
        *,
        profiles:author_id (full_name)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      author_name: data.profiles?.full_name || 'Anonymous',
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function createPost(authorId: string, postData: CreatePostData): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  if (!isSupabaseReady()) {
    const posts = getDemoPosts();
    
    // Check for duplicate slug
    if (posts.some(p => p.slug === postData.slug)) {
      return { success: false, error: 'A post with this slug already exists' };
    }

    const newPost: BlogPost = {
      id: `demo-post-${Date.now()}`,
      author_id: authorId,
      title: postData.title,
      slug: postData.slug,
      excerpt: postData.excerpt || null,
      content: postData.content,
      cover_image_url: postData.cover_image_url || null,
      status: postData.status,
      published_at: postData.status === 'published' ? new Date().toISOString() : null,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    posts.push(newPost);
    saveDemoPosts(posts);
    return { success: true, post: newPost };
  }

  try {
    const { data, error } = await supabase!
      .from('blog_posts')
      .insert({
        author_id: authorId,
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content,
        cover_image_url: postData.cover_image_url,
        status: postData.status,
        published_at: postData.status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) throw error;

    // Add categories if provided
    if (postData.category_ids && postData.category_ids.length > 0) {
      const categoryLinks = postData.category_ids.map(catId => ({
        post_id: data.id,
        category_id: catId,
      }));

      await supabase!.from('blog_post_categories').insert(categoryLinks);
    }

    return { success: true, post: data };
  } catch (error: any) {
    console.error('Error creating post:', error);
    return { success: false, error: error.message || 'Failed to create post' };
  }
}

export async function updatePost(postId: string, updates: UpdatePostData): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseReady()) {
    const posts = getDemoPosts();
    const index = posts.findIndex(p => p.id === postId);
    
    if (index === -1) {
      return { success: false, error: 'Post not found' };
    }

    // Check for slug conflicts if slug is being updated
    if (updates.slug && posts.some(p => p.slug === updates.slug && p.id !== postId)) {
      return { success: false, error: 'A post with this slug already exists' };
    }

    posts[index] = {
      ...posts[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    // Update published_at if publishing
    if (updates.status === 'published' && !posts[index].published_at) {
      posts[index].published_at = new Date().toISOString();
    }

    saveDemoPosts(posts);
    return { success: true };
  }

  try {
    const updateData: any = { ...updates };
    
    // Set published_at when publishing
    if (updates.status === 'published') {
      const current = await getPostById(postId);
      if (current && !current.published_at) {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { error } = await supabase!
      .from('blog_posts')
      .update(updateData)
      .eq('id', postId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error updating post:', error);
    return { success: false, error: error.message || 'Failed to update post' };
  }
}

export async function deletePost(postId: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseReady()) {
    const posts = getDemoPosts();
    const filtered = posts.filter(p => p.id !== postId);
    saveDemoPosts(filtered);
    return { success: true };
  }

  try {
    const { error } = await supabase!
      .from('blog_posts')
      .delete()
      .eq('id', postId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return { success: false, error: error.message || 'Failed to delete post' };
  }
}

// ============================================
// CATEGORIES
// ============================================

export async function getAllCategories(): Promise<BlogCategory[]> {
  if (!isSupabaseReady()) {
    return getDemoCategories();
  }

  try {
    const { data, error } = await supabase!
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// ============================================
// COMMENTS
// ============================================

export async function getCommentsByPostId(postId: string): Promise<BlogComment[]> {
  if (!isSupabaseReady()) {
    const comments = getDemoComments();
    return comments.filter(c => c.post_id === postId && c.status === 'approved');
  }

  try {
    const { data, error } = await supabase!
      .from('blog_comments')
      .select(`
        *,
        profiles:author_id (full_name)
      `)
      .eq('post_id', postId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map((comment: any) => ({
      ...comment,
      author_name: comment.profiles?.full_name || 'Anonymous',
    }));
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createComment(postId: string, authorId: string, content: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseReady()) {
    const comments = getDemoComments();
    const newComment: BlogComment = {
      id: `demo-comment-${Date.now()}`,
      post_id: postId,
      author_id: authorId,
      content,
      status: 'approved', // Auto-approve in demo
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    comments.push(newComment);
    saveDemoComments(comments);
    return { success: true };
  }

  try {
    const { error } = await supabase!
      .from('blog_comments')
      .insert({
        post_id: postId,
        author_id: authorId,
        content,
        status: 'pending', // Requires admin approval
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return { success: false, error: error.message || 'Failed to post comment' };
  }
}

// ============================================
// UTILITY
// ============================================

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}
