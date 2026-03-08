import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  addDoc,
  getDocs,
  query,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../../firebaseConfig.js';
import './Community.css';
import communityData from '../../data/communities.json';
import useAuth from '../../custom-hooks/useAuth.js';

const CommunityPage = () => {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [communityName, setCommunityName] = useState('');

  const { currentUser } = useAuth();

  useEffect(() => {
    const findCommunityName = () => {
      for (const category in communityData) {
        for (const subcategory in communityData[category]) {
          const communities = communityData[category][subcategory];
          const community = communities.find(
            (comm) => comm.collectionName === id
          );
          if (community) {
            setCommunityName(community.name);
            return;
          }
        }
      }
      setCommunityName('Community Not Found');
    };

    findCommunityName();
  }, [id]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const postsRef = collection(db, id);
      const q = query(postsRef);
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map((docSnap) => ({
        ...docSnap.data(),
        id: docSnap.id,
        likes: docSnap.data().likes || 0, // default to 0 if not present
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (newPost.trim() === '') return;

    try {
      const postsRef = collection(db, id);
      await addDoc(postsRef, {
        content: newPost,
        userId: currentUser.displayName,
        timestamp: new Date(),
        likes: 0,
      });

      setNewPost('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId, currentLikes) => {
    try {
      const postRef = doc(db, id, postId);
      const newLikes = currentLikes + 1;
      await updateDoc(postRef, {
        likes: newLikes,
      });

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: newLikes } : post
        )
      );
    } catch (error) {
      console.error('Error updating like:', error);
    }
  };

  return (
    <div className="community-container">
      <h1>{communityName}</h1>

      <form onSubmit={handlePostSubmit}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Write a new post..."
        />
        <button type="submit">Post</button>
      </form>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post">
              <p>{post.content}</p>
              <small>
                Posted by {post.userId} on{' '}
                {post.timestamp?.seconds
                  ? new Date(post.timestamp.seconds * 1000).toLocaleString()
                  : 'Just now'}
              </small>
              <div className="post-actions">
                <button onClick={() => handleLike(post.id, post.likes)}>
                  ❣️ {post.likes}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;
