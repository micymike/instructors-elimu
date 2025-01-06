import React, { useState, useEffect, useRef } from 'react';
import { Upload, X, Play, Edit2, Trash2, Clock, Users } from 'lucide-react';
import { API_URL } from '../../config';

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    visibility: 'private',
    tags: []
  });

  const fileInputRef = useRef(null);
  const MAX_DURATION = 20 * 60; // 20 minutes in seconds

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch videos');
      const data = await response.json();
      setVideos(data);
    } catch (err) {
      setError('Failed to load videos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError('File size should be less than 100MB');
      return;
    }

    // Check video duration
    const video = document.createElement('video');
    video.preload = 'metadata';

    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;

    try {
      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          if (video.duration > MAX_DURATION) {
            reject(new Error('Video duration should be less than 20 minutes'));
          } else {
            resolve();
          }
        };
        video.onerror = () => reject(new Error('Error loading video metadata'));
      });

      // If we get here, duration is valid
      await handleUpload(file);
    } catch (err) {
      setError(err.message);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const handleUpload = async (file) => {
    try {
      setLoading(true);
      setUploadProgress(0);

      // Get upload signature from backend
      const token = localStorage.getItem('token');
      const signatureRes = await fetch(`${API_URL}/api/videos/signature`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!signatureRes.ok) throw new Error('Failed to get upload signature');
      const { signature, timestamp, cloudName, apiKey } = await signatureRes.json();

      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', signature);
      formData.append('timestamp', timestamp);
      formData.append('api_key', apiKey);
      formData.append('resource_type', 'video');

      // Upload to Cloudinary with progress tracking
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const uploadResponse = JSON.parse(xhr.responseText);
          
          // Save video details to our backend
          const saveResponse = await fetch(`${API_URL}/api/videos`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              title: file.name.split('.')[0],
              cloudinaryId: uploadResponse.public_id,
              url: uploadResponse.secure_url,
              duration: uploadResponse.duration,
              thumbnail: uploadResponse.thumbnail_url
            })
          });

          if (!saveResponse.ok) throw new Error('Failed to save video details');
          
          const newVideo = await saveResponse.json();
          setVideos(prev => [...prev, newVideo]);
          setUploadProgress(0);
        } else {
          throw new Error('Upload failed');
        }
      };

      xhr.onerror = () => {
        throw new Error('Upload failed');
      };

      xhr.send(formData);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVideo = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editForm)
      });
      
      if (!response.ok) throw new Error('Failed to update video');
      
      const updatedVideo = await response.json();
      setVideos(prev => 
        prev.map(video => 
          video.id === videoId ? updatedVideo : video
        )
      );
      setShowEditModal(false);
    } catch (err) {
      setError('Failed to update video');
      console.error(err);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete video');
      
      setVideos(prev => prev.filter(video => video.id !== videoId));
    } catch (err) {
      setError('Failed to delete video');
      console.error(err);
    }
  };

  return (
    <div className="video-management">
      <h1>Video Management</h1>
      {error && <div className="error-message">{error}</div>}
      
      <div className="upload-section">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileSelect}
          accept="video/*"
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => fileInputRef.current.click()}
          disabled={loading}
        >
          <Upload /> Upload Video
        </button>
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="video-list">
        {videos.map(video => (
          <div key={video.id} className="video-item">
            <img 
              src={video.thumbnail} 
              alt={video.title} 
              className="video-thumbnail" 
            />
            <div className="video-details">
              <h3>{video.title}</h3>
              <p>Duration: {Math.round(video.duration)} seconds</p>
              <div className="video-actions">
                <button onClick={() => {
                  setSelectedVideo(video);
                  setEditForm({
                    title: video.title,
                    description: video.description || '',
                    visibility: video.visibility || 'private',
                    tags: video.tags || []
                  });
                  setShowEditModal(true);
                }}>
                  <Edit2 /> Edit
                </button>
                <button onClick={() => handleDeleteVideo(video.id)}>
                  <Trash2 /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && (
        <div className="edit-modal">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleEditVideo(selectedVideo.id);
          }}>
            <input 
              type="text" 
              value={editForm.title}
              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
              placeholder="Video Title"
            />
            <textarea 
              value={editForm.description}
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
              placeholder="Video Description"
            ></textarea>
            <select 
              value={editForm.visibility}
              onChange={(e) => setEditForm({...editForm, visibility: e.target.value})}
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setShowEditModal(false)}>
              <X /> Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;
