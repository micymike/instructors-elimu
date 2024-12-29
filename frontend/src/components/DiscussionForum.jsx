import { useState } from 'react';

const DiscussionForum = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment]);
      setNewComment('');
    }
  };

  return (
    <div className="discussion-forum p-4 bg-blue-100 text-blue-900">
      <h2 className="text-2xl font-bold mb-4">Discussion Forum</h2>
      <div className="mb-4">
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddComment}
        >
          Post Comment
        </button>
      </div>
      <div className="comments space-y-2">
        {comments.map((comment, index) => (
          <div key={index} className="p-2 bg-white shadow rounded">
            {comment}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscussionForum;
