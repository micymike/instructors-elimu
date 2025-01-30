import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from '../../components/ui/use-toast';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../../components/ui/alert-dialog';

const AssessmentsList = () => {
  const history = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
    
    // Listen for real-time updates
    socket.on('assessment-created', (newAssessment) => {
      setAssessments(prev => [...prev, newAssessment]);
    });

    socket.on('assessment-deleted', (deletedId) => {
      setAssessments(prev => prev.filter(a => a.id !== deletedId));
    });

    socket.on('assessment-updated', (updatedAssessment) => {
      setAssessments(prev => 
        prev.map(a => a.id === updatedAssessment.id ? updatedAssessment : a)
      );
    });

    return () => {
      socket.off('assessment-created');
      socket.off('assessment-deleted');
      socket.off('assessment-updated');
    };
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get('/api/assessments');
      setAssessments(response.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch assessments.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assessment) => {
    history.push(`/edit-assessment/${assessment.id}`, { assessment });
  };

  const handlePreview = (assessment) => {
    localStorage.setItem('previewAssessment', JSON.stringify(assessment));
    history.push('/assessment-preview');
  };

  const handleDelete = async () => {
    if (!selectedAssessment) return;
    
    try {
      await axios.delete(`/api/assessments/${selectedAssessment.id}`);
      socket.emit('assessment-deleted', selectedAssessment.id);
      setAssessments(prev => prev.filter(a => a.id !== selectedAssessment.id));
      toast({
        title: "Success",
        description: "Assessment deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete assessment.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedAssessment(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800">Saved Assessments</h1>
          <button
            onClick={() => history.push('/create-assessment')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Assessment
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <div key={assessment.id} className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{assessment.title}</h2>
              <p className="text-gray-600 mb-4">{assessment.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {assessment.questions.length} questions
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(assessment)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleEdit(assessment)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAssessment(assessment);
                      setDeleteDialogOpen(true);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this assessment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-end gap-4">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AssessmentsList;