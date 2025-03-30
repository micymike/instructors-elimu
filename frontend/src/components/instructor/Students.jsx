import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Mail, Phone, MapPin, School, Filter, Loader2, GraduationCap, TrendingUp } from 'lucide-react';

const Students = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const navigate = useNavigate();

  // Dummy data generation function
  //function generateDummyStudents() {
   // const courses = ['Computer Science', 'Business', 'Engineering', 'Medicine', 'Arts'];
   // const years = ['Freshman', 'Sophomore', 'Junior', 'Senior'];
   // const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];

    return Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: `Student ${i + 1}`,
      email: `student${i + 1}@university.edu`,
      phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      course: courses[Math.floor(Math.random() * courses.length)],
      year: years[Math.floor(Math.random() * years.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      gpa: (Math.random() * 2 + 2).toFixed(2),
      avatar: `blackstudents${i + 1}.jpg`
    }));
  }

  const dummyStudents = generateDummyStudents(); // Define dummyStudents after the function

  const [students, setStudents] = useState(dummyStudents);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && student.year.toLowerCase() === selectedFilter.toLowerCase();
  });

  const handleViewProgress = (studentId, courseId) => {
    navigate(`/instructor/students/${studentId}/progress/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <p className="text-blue-600 font-medium">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Students Directory
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white/90 backdrop-blur-sm"
                />
              </div>
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/90 backdrop-blur-sm"
              >
                <option value="all">All Years</option>
                <option value="freshman">Freshman</option>
                <option value="sophomore">Sophomore</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>
          <p className="mt-4 text-gray-600">
            Showing {filteredStudents.length} of {students.length} students
          </p>
        </div>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            Error: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="group bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-300"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-500">{student.year}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{student.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <School className="w-4 h-4" />
                    <span className="text-sm">{student.course}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{student.city}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">GPA</span>
                    <span className="text-sm font-semibold text-blue-600">{student.gpa}</span>
                    <button
                      onClick={() => handleViewProgress(student.id, student.course)}
                      className="p-2 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;