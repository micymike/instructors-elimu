import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
import { API_URL } from '../../config';

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const StatCard = ({ icon: Icon, title, value, description }) => (
  <motion.div
    variants={fadeIn}
    className="group bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl transition-all duration-300 group-hover:from-blue-200 group-hover:to-blue-100">
        <Icon className="w-6 h-6 text-blue-600 transition-colors duration-300 group-hover:text-blue-700" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-2xl font-bold mt-1 text-gray-900">{value}</p>
        {description && (
          <p className="text-sm text-gray-600 mt-1 transition-colors duration-300 group-hover:text-gray-700">
            {description}
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

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
        const response = await axios.get(`${API_URL}/instructor/student-analysis/course/${courseId}/analytics`, {
          headers: { Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' }
        });

        const transformed = {
          ...response.data,
          ageGroups: response.data.studentDemographics?.ageGroups 
            ? Object.entries(response.data.studentDemographics.ageGroups).map(([name, value]) => ({ name, value })) 
            : [],
          countries: response.data.studentDemographics?.countries 
            ? Object.entries(response.data.studentDemographics.countries).map(([name, value]) => ({ name, value })) 
            : [],
          completedStudents: Array.isArray(response.data.completedStudents) 
            ? response.data.completedStudents.map(student => ({
                ...student,
                hasCertificate: student.certificateGenerated
              }))
            : []
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
        `${API_URL}/api/student/certificates/generate/${courseId}`,
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

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Loader2 className="w-12 h-12 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 p-4 rounded-lg text-red-700"
      >
        {error}
      </motion.div>
    );
  }

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-4 py-8 space-y-8"
    >
      <motion.div variants={fadeIn}>
        <Link 
          to="/instructor/courses" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Courses
        </Link>
      </motion.div>

      <motion.div 
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={Users}
          title="Total Enrollments"
          value={analytics?.totalEnrollments??0}
        />
        <StatCard
          icon={BookCheck}
          title="Completed"
          value={analytics.completedEnrollments}
          description={`${((analytics?.completedEnrollments ?? 0) / (analytics?.totalEnrollments || 1) * 100).toFixed(1)}% completion rate`}
        />
        <StatCard
          icon={Trophy}
          title="Avg Progress"
          value={`${analytics?.averageProgress??0}%`}
        />
        <StatCard
          icon={CalendarDays}
          title="Recent Enrollments"
          value={analytics.recentEnrollment??0}
          description="Last 7 days"
        />
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Age Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.ageGroups}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f9" />
                <XAxis dataKey="name" tick={{ fill: '#64748b' }} />
                <YAxis tick={{ fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                  animationBegin={100}
                  animationDuration={800}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Country Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.countries}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={800}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {analytics.countries.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Quiz Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="20%"
                outerRadius="100%"
                data={[{ 
                  name: 'Score', 
                  value: analytics?.performanceMetrics?.averageQuizScore ?? 0 
                }]}
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
                  className="text-2xl font-bold text-gray-700"
                >
                 {analytics?.performanceMetrics?.averageQuizScore ?? 0}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Completion Rate</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-700">
                {analytics?.performanceMetrics?.completionRate ?? 0}%
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
                  strokeDasharray={`${(2 * Math.PI * 88) * ((analytics?.performanceMetrics?.completionRate ?? 0) / 100)} ${2 * Math.PI * 88}`}
                  strokeDashoffset="0"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-gray-700">
            <FileCheck className="w-6 h-6 text-green-600" />
            Certificate Management
          </h2>
          
          <div className="overflow-x-auto rounded-lg border border-gray-100">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                <tr>
                  {['Student', 'Progress', 'Status', 'Actions'].map((header) => (
                    <th 
                      key={header}
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {analytics.completedStudents.map((student, index) => (
                  <motion.tr 
                    key={student.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-500"
                            style={{ width: `${student.progress}%` }}
                          />
                        </div>
                        <span className="text-gray-700">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        student.hasCertificate 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {student.hasCertificate ? 'Issued' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => generateCertificate(student.id)}
                        disabled={certificateStatus[student.id] === 'generating'}
                        className={`inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                          certificateStatus[student.id] === 'generating'
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : student.hasCertificate
                              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-[1.02]'
                              : 'bg-green-100 text-green-600 hover:bg-green-200 hover:scale-[1.02]'
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
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CourseAnalytics;