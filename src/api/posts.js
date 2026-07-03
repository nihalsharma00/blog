import client from './client';
import { CATEGORIES } from '../components/blog/CategoryTheme';

const mapPostCategory = (post) => {
  const index = (post.id - 1) % 8;
  const category = CATEGORIES[index]?.id || 'tech';
  return { ...post, category };
};

// ─── Posts ────────────────────────────────────────────────────────────────────
export const fetchPosts = () => client.get('/posts').then(r => r.data.map(mapPostCategory));
export const fetchPost = (id) => client.get(`/posts/${id}`).then(r => mapPostCategory(r.data));

// ─── Users ────────────────────────────────────────────────────────────────────
export const fetchUsers = () => client.get('/users').then(r => r.data);
export const fetchUser = (id) => client.get(`/users/${id}`).then(r => r.data);

// ─── Comments ─────────────────────────────────────────────────────────────────
export const fetchComments = () => client.get('/comments').then(r => r.data);
export const fetchPostComments = (postId) =>
  client.get(`/comments?postId=${postId}`).then(r => r.data);

// ─── Photos ───────────────────────────────────────────────────────────────────
export const fetchPhotos = () => client.get('/photos').then(r => r.data);

// ─── Albums ───────────────────────────────────────────────────────────────────
export const fetchAlbums = () => client.get('/albums').then(r => r.data);
