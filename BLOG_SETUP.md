# Blog System - Setup & Usage Guide

## ✅ Complete Features

### Database Schema
- **Blog Posts**: Title, slug, content, cover image, status (draft/published/archived)
- **Categories**: Organize posts by topic
- **Comments**: User comments with moderation (pending/approved/spam)
- **Row Level Security**: Public can view published posts, admins can manage

### CRUD Operations
- **Create**: Admins can create new blog posts
- **Read**: Everyone can view published posts
- **Update**: Admins can edit existing posts
- **Delete**: Admins can delete posts

### Page Components
1. **BlogList** (`/blog`) - Grid view of all published posts
2. **BlogDetail** (`/blog/:slug`) - Full post view with view counter
3. **BlogEditor** (`/blog/create/new` & `/blog/edit/:id`) - Admin-only post editor

### Features
- ✅ Dual-mode support (Demo + Supabase)
- ✅ Auto-slug generation from title
- ✅ Draft/Published status management
- ✅ View counter
- ✅ Category tagging
- ✅ Cover image support
- ✅ Content with HTML formatting
- ✅ Admin-only create/edit/delete
- ✅ Responsive design
- ✅ Added to navigation for all user types

## 🚀 Setup Instructions

### 1. Run Database Schema

In Supabase SQL Editor, run:

```sql
-- File: supabase/sql/16_blog.sql
```

This creates:
- `blog_posts` table
- `blog_categories` table (with 5 default categories)
- `blog_post_categories` junction table
- `blog_comments` table
- RLS policies for security

### 2. Test in Demo Mode

The blog works immediately in demo mode with sample posts:
1. Visit `/blog` to see the welcome post
2. Click to read full post
3. As admin, click "Create Post" button to add more

### 3. Production Features

After running the SQL:
- Admins can create/edit/delete posts
- All users can view published posts
- View counts are tracked
- Categories are available for organization
- Comments system ready (UI can be added later)

## 📝 Usage Guide

### Creating a Blog Post (Admin Only)

1. Navigate to `/blog`
2. Click "Create New Post" button (admin button in top right)
3. Fill in the form:
   - **Title**: Post headline (required)
   - **Slug**: URL-friendly identifier (auto-generated, editable)
   - **Excerpt**: Brief summary for listings (optional)
   - **Cover Image URL**: Link to featured image (optional)
   - **Content**: Main post content with HTML formatting
   - **Categories**: Select relevant categories
   - **Status**: Choose Draft or Published

4. Click "Create Post" to publish

### Editing a Post (Admin Only)

1. Navigate to any blog post
2. Click "Edit Post" button (admin only)
3. Update fields as needed
4. Click "Update Post"

### Deleting a Post (Admin Only)

1. Navigate to the post
2. Click "Delete" button
3. Confirm deletion

## 🎨 Customization Options

### Add Blog Link to Footer
Update HomePage.tsx to add blog link in footer section.

### Enable Comments UI
The database supports comments. To enable:
1. Add comment form component to BlogDetail.tsx
2. Use `createComment()` from blogService.ts
3. Display comments with approval status

### Add Rich Text Editor
Replace the textarea in BlogEditor.tsx with a rich editor like:
- TinyMCE
- Quill
- Draft.js

### Add Image Upload
Integrate Supabase Storage for image uploads:
1. Create a storage bucket for blog images
2. Add upload button in BlogEditor
3. Store uploaded URLs in `cover_image_url`

## 🔐 Security

- ✅ RLS policies enforce admin-only editing
- ✅ Public can only view published posts
- ✅ Comments require authentication
- ✅ XSS protection with proper HTML handling

## 📱 Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/blog` | Public | List all published posts |
| `/blog/:slug` | Public | View single post |
| `/blog/create/new` | Admin only | Create new post |
| `/blog/edit/:id` | Admin only | Edit existing post |

## 🎯 Demo Mode

In demo mode (no Supabase):
- Sample posts stored in localStorage
- 3 default categories
- Auto-approved comments
- All CRUD operations work locally
- Data persists across page refreshes

## ✨ Next Steps

1. **Run the SQL script** to enable production database
2. **Create your first post** as an admin
3. **Customize styling** in Blog.css
4. **Add categories** specific to your platform
5. **Enable comments UI** if desired

---

**Status**: ✅ Fully Functional  
**Files Created**: 8 (SQL, service, 3 pages, 2 CSS files, routes)  
**Integration**: Complete - Added to navigation and routing
