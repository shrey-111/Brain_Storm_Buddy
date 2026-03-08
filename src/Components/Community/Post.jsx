import React, { useState } from 'react';

function PostForm({ onPostSubmit }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onPostSubmit(text); // send the text to the parent component (App.js)
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's on your mind?"
        rows="4"
        cols="50"
      />
      <br />
      <button type="submit">Post</button>
    </form>
  );
}

export default PostForm;
