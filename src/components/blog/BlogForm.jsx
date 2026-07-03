import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ImageIcon, Tag, X, Loader2, AlertCircle, Upload, Eye, EyeOff, Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createPost, updatePost, uploadCoverImage } from '../../api/supabase';
import { RichEditor } from '../editor/RichEditor';
import { CATEGORIES } from './CategoryTheme';

const VALID_IMAGE_REGEX = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|avif)(\?.*)?$/i;

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(200),
  category: z.string().min(1, 'Select a category'),
  excerpt: z.string().max(300, 'Excerpt must be under 300 characters').optional(),
  coverImageUrl: z
    .string()
    .optional()
    .refine(v => !v || VALID_IMAGE_REGEX.test(v), 'Enter a valid image URL (jpg, png, webp, gif)'),
  tags: z.array(z.string()).max(10, 'Maximum 10 tags'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  published: z.boolean(),
});

export function BlogForm({ initialData, postId, mode = 'create' }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState('');
  const [imageMode, setImageMode] = useState('url'); // 'url' | 'upload'
  const [uploadLoading, setUploadLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [preview, setPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: initialData?.title || '',
      category: initialData?.category || '',
      excerpt: initialData?.excerpt || '',
      coverImageUrl: initialData?.cover_image || '',
      tags: initialData?.tags || [],
      content: initialData?.content || '',
      published: initialData?.published ?? true,
    },
  });

  const watchedTags = watch('tags');
  const watchedContent = watch('content');
  const watchedCover = watch('coverImageUrl');
  const watchedTitle = watch('title');
  const watchedCategory = watch('category');

  const addTag = useCallback(() => {
    const t = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!t || watchedTags.includes(t) || watchedTags.length >= 10) return;
    setValue('tags', [...watchedTags, t], { shouldValidate: true });
    setTagInput('');
  }, [tagInput, watchedTags, setValue]);

  const removeTag = useCallback((tag) => {
    setValue('tags', watchedTags.filter(t => t !== tag), { shouldValidate: true });
  }, [watchedTags, setValue]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    try {
      const url = await uploadCoverImage(file, user.id);
      setValue('coverImageUrl', url, { shouldValidate: true });
    } catch (err) {
      setServerError(err.message || 'Image upload failed.');
    } finally {
      setUploadLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setServerError('');
    try {
      if (mode === 'create') {
        const post = await createPost({
          title: data.title,
          category: data.category,
          tags: data.tags,
          excerpt: data.excerpt,
          content: data.content,
          coverImage: data.coverImageUrl || null,
          published: data.published,
          authorId: user.id,
        });
        navigate(`/post/${post.id}`);
      } else {
        const post = await updatePost(postId, {
          title: data.title,
          category: data.category,
          tags: data.tags,
          excerpt: data.excerpt,
          content: data.content,
          cover_image: data.coverImageUrl || null,
          published: data.published,
        });
        navigate(`/post/${post.id}`);
      }
    } catch (err) {
      setServerError(err.message || 'Failed to save post. Please try again.');
    }
  };

  const categoryInfo = CATEGORIES.find(c => c.id === watchedCategory);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {serverError && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {serverError}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="post-title" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Title <span className="text-rose-500">*</span>
        </label>
        <input
          id="post-title"
          type="text"
          placeholder="Your compelling headline…"
          className={`input text-lg font-semibold ${errors.title ? 'border-rose-400' : ''}`}
          {...register('title')}
        />
        {errors.title && <p className="mt-1 text-xs text-rose-500">{errors.title.message}</p>}
        <p className="mt-1 text-xs text-zinc-400">{watchedTitle.length}/200</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Category <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <label
              key={cat.id}
              className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                watchedCategory === cat.id
                  ? 'border-current bg-current/10'
                  : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}
              style={watchedCategory === cat.id ? { borderColor: cat.color, backgroundColor: `${cat.color}15`, color: cat.color } : {}}
            >
              <input type="radio" value={cat.id} className="sr-only" {...register('category')} />
              <span className="text-lg">{cat.emoji}</span>
              <span className="text-sm font-semibold">{cat.label}</span>
            </label>
          ))}
        </div>
        {errors.category && <p className="mt-1 text-xs text-rose-500">{errors.category.message}</p>}
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Cover Image
        </label>
        <div className="flex gap-2 mb-3">
          {['url', 'upload'].map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setImageMode(mode)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                imageMode === mode
                  ? 'bg-primary-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {mode === 'url' ? 'Paste URL' : 'Upload File'}
            </button>
          ))}
        </div>

        {imageMode === 'url' ? (
          <div>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="url"
                placeholder="https://example.com/cover.jpg"
                className={`input pl-10 ${errors.coverImageUrl ? 'border-rose-400' : ''}`}
                {...register('coverImageUrl')}
              />
            </div>
            {errors.coverImageUrl && <p className="mt-1 text-xs text-rose-500">{errors.coverImageUrl.message}</p>}
          </div>
        ) : (
          <div>
            <label
              htmlFor="cover-upload"
              className={`flex items-center justify-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
                uploadLoading
                  ? 'border-primary-300 bg-primary-50 dark:bg-primary-950'
                  : 'border-zinc-300 dark:border-zinc-600 hover:border-primary-400 dark:hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950'
              }`}
            >
              {uploadLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin text-primary-500" /> Uploading…</>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-zinc-400" />
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    Click to upload · JPG, PNG, WebP, GIF · Max 5MB
                  </span>
                </>
              )}
            </label>
            <input
              id="cover-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </div>
        )}

        {/* Preview */}
        {watchedCover && VALID_IMAGE_REGEX.test(watchedCover) && (
          <div className="mt-3 rounded-xl overflow-hidden aspect-[16/7] max-h-[240px] bg-zinc-100 dark:bg-zinc-800">
            <img
              src={watchedCover}
              alt="Cover preview"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="post-excerpt" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Excerpt <span className="text-zinc-400 font-normal">(optional — auto-generated if empty)</span>
        </label>
        <textarea
          id="post-excerpt"
          rows={2}
          placeholder="A brief summary of your post…"
          className={`input resize-none ${errors.excerpt ? 'border-rose-400' : ''}`}
          {...register('excerpt')}
        />
        {errors.excerpt && <p className="mt-1 text-xs text-rose-500">{errors.excerpt.message}</p>}
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
          Tags <span className="text-zinc-400 font-normal">(max 10)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {watchedTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="hover:text-rose-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); } }}
            placeholder="Add a tag and press Enter"
            className="input flex-1"
            aria-label="Add tag"
            maxLength={30}
          />
          <button type="button" onClick={addTag} className="btn-outline px-4">
            <Tag className="w-4 h-4" />
            Add
          </button>
        </div>
        {errors.tags && <p className="mt-1 text-xs text-rose-500">{errors.tags.message}</p>}
      </div>

      {/* Content Editor */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Content <span className="text-rose-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => setPreview(p => !p)}
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {preview ? 'Back to Editor' : 'Preview'}
          </button>
        </div>

        {preview ? (
          <div
            className="prose-content card p-6 min-h-[300px]"
            dangerouslySetInnerHTML={{ __html: watchedContent }}
            aria-label="Content preview"
          />
        ) : (
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <RichEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write your story here…"
              />
            )}
          />
        )}
        {errors.content && <p className="mt-1 text-xs text-rose-500">{errors.content.message}</p>}
      </div>

      {/* Publish toggle + Submit */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              {...register('published')}
            />
            <div className="w-10 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 peer-checked:bg-emerald-500 transition-colors" />
            <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4" />
          </div>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            {watch('published') ? 'Publish now' : 'Save as draft'}
          </span>
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
            id="blog-form-submit"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> {mode === 'create' ? 'Publish Post' : 'Save Changes'}</>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
