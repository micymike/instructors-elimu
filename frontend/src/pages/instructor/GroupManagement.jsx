import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, AlertCircle, Loader2, UserPlus, School, Trash2 } from 'lucide-react';

import DashboardLayout from '../../components/layouts/DashboardLayout';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    groupName: '',
    instructorId: '',
    studentIds: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setGroups(data);
        } else {
          throw new Error('Invalid data format received');
        }
      } else {
        throw new Error('Failed to fetch groups');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createGroup = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.groupName,
          instructorId: formData.instructorId,
          studentIds: formData.studentIds.split(',').map(id => id.trim()).filter(Boolean)
        }),
      });

      if (!response.ok) throw new Error('Failed to create group');
      
      const newGroup = await response.json();
      setGroups(prev => [...prev, newGroup]);
      setFormData({
        groupName: '',
        instructorId: '',
        studentIds: ''
      });
      setShowForm(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-blue-600 font-medium">Loading groups...</p>
        </div>
      </div>
    );
  }

  return (
    
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Group Management
              </h1>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              {showForm ? (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>Hide Form</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" />
                  <span>New Group</span>
                </>
              )}
            </button>
          </div>

          {/* Create Group Form */}
          {showForm && (
            <div className="bg-white rounded-2xl shadow-xl mb-8 transition-all duration-200 ease-in-out transform hover:shadow-2xl">
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Group</h2>
                <form onSubmit={createGroup} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Group Name
                      </label>
                      <input
                        type="text"
                        name="groupName"
                        value={formData.groupName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                        placeholder="Enter group name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructor ID
                      </label>
                      <input
                        type="text"
                        name="instructorId"
                        value={formData.instructorId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                        placeholder="Enter instructor ID"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student IDs
                    </label>
                    <textarea
                      name="studentIds"
                      value={formData.studentIds}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                      placeholder="Enter comma-separated student IDs"
                      rows="3"
                      required
                    />
                  </div>

                  {error && (
                    <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm">{error}</span>
                    </div>
                  )}

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-5 h-5" />
                          <span>Create Group</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Groups List */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Groups ({groups.length})</h2>
              {groups.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No groups created yet</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="mt-4 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create your first group</span>
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {groups.map((group) => (
                    <div
                      key={group._id}
                      className="group p-4 border border-gray-100 rounded-xl hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
                      onClick={() => setSelectedGroup(group)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">{group.name}</h3>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {group.studentIds?.length || 0} students
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <School className="w-4 h-4" />
                        <span className="text-sm">Instructor: {group.instructorId}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default GroupManagement;