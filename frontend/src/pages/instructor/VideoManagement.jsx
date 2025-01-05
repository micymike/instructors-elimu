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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Video Management</h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Upload size={20} />
          Upload Video
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}>
            <X size={20} />
          </button>
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map(video => (
          <div key={video.id} className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="relative aspect-video bg-gray-100">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => window.open(video.url, '_blank')}
                className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity"
              >
                <Play size={48} className="text-white" />
              </button>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold mb-2">{video.title}</h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} />
                  {video.views || 0} views
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedVideo(video);
                    setEditForm({
                      title: video.title,
                      description: video.description || '',
                      visibility: video.visibility || 'private',
                      tags: video.tags || []
                    });
                    setShowEditModal(true);
                  }}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit Video</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Visibility</label>
                <select
                  value={editForm.visibility}
                  onChange={(e) => setEditForm(prev => ({ ...prev, visibility: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tags</label>
                <input
                  type="text"
                  value={editForm.tags.join(', ')}
                  onChange={(e) => setEditForm(prev => ({
                    ...prev,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  }))}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter tags separated by commas"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleEditVideo(selectedVideo.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManagement;
