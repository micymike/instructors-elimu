import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { 
  Loader2, 
  Users, 
  Trophy, 
  BookCheck, 
  Globe, 
  CalendarDays,
  Download,
  FileCheck,
  FileX2,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const CourseAnalytics = () => {
  const { id: courseId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificateStatus, setCertificateStatus] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://centralize-auth-elimu.onrender.com/instructor/courses/${courseId}/analytics`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const transformed = {
          ...response.data,
          ageGroups: Object.entries(response.data.studentDemographics.ageGroups)
            .map(([name, value]) => ({ name, value })),
          countries: Object.entries(response.data.studentDemographics.countries)
            .map(([name, value]) => ({ name, value })),
          completedStudents: response.data.completedStudents.map(student => ({
            ...student,
            hasCertificate: student.certificateGenerated
          }))
        };
        
        setAnalytics(transformed);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [courseId]);

  const generateCertificate = async (studentId) => {
    try {
      setCertificateStatus(prev => ({ ...prev, [studentId]: 'generating' }));
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${API_BASE_URL}/api/student/certificates/generate/${courseId}`,
        { studentId },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setAnalytics(prev => ({
        ...prev,
        completedStudents: prev.completedStudents.map(student => 
          student.id === studentId ? { ...student, hasCertificate: true } : student
        )
      }));
      setCertificateStatus(prev => ({ ...prev, [studentId]: 'generated' }));
    } catch (err) {
      setCertificateStatus(prev => ({ ...prev, [studentId]: 'error' }));
      console.error('Certificate generation failed:', err);
    }
  };

  const StatCard = ({ icon: Icon, title, value, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
        </div>
      </div>
    </div>
  );

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <Link 
        to="/instructor/courses" 
        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ChevronLeft className="h-5 w-5" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          title="Total Enrollments"
          value={analytics.totalEnrollments}
        />
        <StatCard
          icon={BookCheck}
          title="Completed"
          value={analytics.completedEnrollments}
          description={`${((analytics.completedEnrollments / analytics.totalEnrollments) * 100).toFixed(1)}% completion rate`}
        />
        <StatCard
          icon={Trophy}
          title="Avg Progress"
          value={`${analytics.averageProgress}%`}
        />
        <StatCard
          icon={CalendarDays}
          title="Recent Enrollments"
          value={analytics.recentEnrollments}
          description="Last 7 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Country Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.countries}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                >
                  {analytics.countries.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quiz Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="20%"
                outerRadius="100%"
                data={[{ name: 'Score', value: analytics.performanceMetrics.averageQuizScore }]}
              >
                <RadialBar
                  background
                  dataKey="value"
                  fill="#10B981"
                />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold"
                >
                  {analytics.performanceMetrics.averageQuizScore}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Completion Rate</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-700">
                  {analytics.performanceMetrics.completionRate}%
                </div>
              </div>
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-current text-gray-200"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  className="stroke-current text-blue-600"
                  strokeWidth="16"
                  strokeDasharray={`${(2 * Math.PI * 88) * (analytics.performanceMetrics.completionRate / 100)} ${2 * Math.PI * 88}`}
                  strokeDashoffset="0"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-green-600" />
          Certificate Management
        </h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Student</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Progress</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics.completedStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.progress}%</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      student.hasCertificate 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {student.hasCertificate ? 'Issued' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => generateCertificate(student.id)}
                      disabled={certificateStatus[student.id] === 'generating'}
                      className={`inline-flex items-center px-4 py-2 rounded-md transition-colors ${
                        certificateStatus[student.id] === 'generating'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : student.hasCertificate
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {certificateStatus[student.id] === 'generating' ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : student.hasCertificate ? (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      ) : (
                        <>
                          <FileCheck className="w-4 h-4 mr-2" />
                          Generate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseAnalytics;