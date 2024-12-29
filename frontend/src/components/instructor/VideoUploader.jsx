import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

const VideoUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles.map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }))]);
  };

  const handleUpload = async (fileItem) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('video', fileItem.file);

    try {
      const response = await fetch('/api/videos/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFiles(prev => prev.map(f => 
        f.file === fileItem.file 
          ? { ...f, status: 'completed', url: data.url }
          : f
      ));
      onUpload(data.url);
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.file === fileItem.file 
          ? { ...f, status: 'error' }
          : f
      ));
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(f => f.file !== fileToRemove.file));
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="hidden"
          id="video-upload"
          multiple
        />
        <label 
          htmlFor="video-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-gray-600">Drop video files here or click to upload</p>
          <p className="text-sm text-gray-500 mt-1">MP4, WebM, or Ogg files</p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileItem, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {fileItem.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : fileItem.status === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                )}
                <span className="text-sm text-gray-700">{fileItem.file.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {fileItem.status === 'pending' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpload(fileItem)}
                    disabled={uploading}
                  >
                    Upload
                  </Button>
                )}
                <button
                  onClick={() => removeFile(fileItem)}
                  className="text-gray-500 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploader; 