import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  Science as ScienceIcon,
  School as ExamIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const assessmentTypes = {
  quiz: {
    label: 'Quiz',
    icon: <QuizIcon />,
    color: 'primary',
    hasQuestions: true,
  },
  assignment: {
    label: 'Assignment',
    icon: <AssignmentIcon />,
    color: 'secondary',
    hasQuestions: false,
  },
  practicalExam: {
    label: 'Practical Exam',
    icon: <ScienceIcon />,
    color: 'warning',
    hasQuestions: true,
  },
  exam: {
    label: 'Final Exam',
    icon: <ExamIcon />,
    color: 'error',
    hasQuestions: true,
  },
};

export default function AssessmentCreator({ data, updateData }) {
  const [assessments, setAssessments] = useState(data.assessments || []);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);

  useEffect(() => {
    if (data.curriculum?.subject) {
      // You could fetch assessment templates based on curriculum
    }
  }, [data.curriculum]);

  const handleAssessmentAdd = () => {
    setCurrentAssessment({
      title: '',
      type: 'quiz',
      totalPoints: 0,
      passingScore: 0,
      duration: 60,
      dueDate: new Date(),
      instructions: '',
      questions: [],
      rubric: [],
      allowedAttempts: 1,
      isTimeLimited: true,
      requiresProctoring: false,
      resources: [],
    });
    setIsDialogOpen(true);
  };

  const handleAssessmentEdit = (assessment, index) => {
    setCurrentAssessment({ ...assessment, index });
    setIsDialogOpen(true);
  };

  const handleAssessmentDelete = (index) => {
    const newAssessments = assessments.filter((_, i) => i !== index);
    setAssessments(newAssessments);
    updateData({ ...data, assessments: newAssessments });
  };

  const handleAssessmentSave = () => {
    const newAssessments = [...assessments];
    if (currentAssessment.index !== undefined) {
      newAssessments[currentAssessment.index] = { ...currentAssessment };
      delete newAssessments[currentAssessment.index].index;
    } else {
      newAssessments.push({ ...currentAssessment });
    }
    setAssessments(newAssessments);
    updateData({ ...data, assessments: newAssessments });
    setIsDialogOpen(false);
  };

  const handleQuestionAdd = () => {
    setCurrentQuestion({
      text: '',
      type: 'multiple-choice',
      points: 1,
      options: ['', ''],
      correctAnswer: '',
      explanation: '',
    });
    setIsQuestionDialogOpen(true);
  };

  const handleQuestionSave = () => {
    const newQuestions = [...(currentAssessment.questions || [])];
    if (currentQuestion.index !== undefined) {
      newQuestions[currentQuestion.index] = { ...currentQuestion };
      delete newQuestions[currentQuestion.index].index;
    } else {
      newQuestions.push({ ...currentQuestion });
    }
    setCurrentAssessment({ ...currentAssessment, questions: newQuestions });
    setIsQuestionDialogOpen(false);
  };

  const QuestionDialog = () => (
    <Dialog
      open={isQuestionDialogOpen}
      onClose={() => setIsQuestionDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {currentQuestion?.index !== undefined ? 'Edit Question' : 'Add New Question'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Question Text"
              value={currentQuestion?.text || ''}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, text: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Question Type</InputLabel>
              <Select
                value={currentQuestion?.type || 'multiple-choice'}
                onChange={(e) =>
                  setCurrentQuestion({ ...currentQuestion, type: e.target.value })
                }
                label="Question Type"
              >
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="short-answer">Short Answer</MenuItem>
                <MenuItem value="essay">Essay</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Points"
              value={currentQuestion?.points || 1}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  points: parseInt(e.target.value),
                })
              }
            />
          </Grid>

          {currentQuestion?.type === 'multiple-choice' && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Options
              </Typography>
              {currentQuestion.options.map((option, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Radio
                    checked={currentQuestion.correctAnswer === index.toString()}
                    onChange={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        correctAnswer: index.toString(),
                      })
                    }
                  />
                  <TextField
                    fullWidth
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions,
                      });
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const newOptions = currentQuestion.options.filter(
                        (_, i) => i !== index
                      );
                      setCurrentQuestion({
                        ...currentQuestion,
                        options: newOptions,
                      });
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  setCurrentQuestion({
                    ...currentQuestion,
                    options: [...currentQuestion.options, ''],
                  })
                }
              >
                Add Option
              </Button>
            </Grid>
          )}

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Explanation"
              value={currentQuestion?.explanation || ''}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  explanation: e.target.value,
                })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsQuestionDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleQuestionSave} variant="contained" color="primary">
          Save Question
        </Button>
      </DialogActions>
    </Dialog>
  );

  const AssessmentDialog = () => (
    <Dialog
      open={isDialogOpen}
      onClose={() => setIsDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {currentAssessment?.index !== undefined
          ? 'Edit Assessment'
          : 'Add New Assessment'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assessment Title"
              value={currentAssessment?.title || ''}
              onChange={(e) =>
                setCurrentAssessment({
                  ...currentAssessment,
                  title: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Assessment Type</InputLabel>
              <Select
                value={currentAssessment?.type || 'quiz'}
                onChange={(e) =>
                  setCurrentAssessment({
                    ...currentAssessment,
                    type: e.target.value,
                  })
                }
                label="Assessment Type"
              >
                {Object.entries(assessmentTypes).map(([key, { label }]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Due Date"
                value={currentAssessment?.dueDate || null}
                onChange={(newValue) =>
                  setCurrentAssessment({
                    ...currentAssessment,
                    dueDate: newValue,
                  })
                }
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Total Points"
              value={currentAssessment?.totalPoints || 0}
              onChange={(e) =>
                setCurrentAssessment({
                  ...currentAssessment,
                  totalPoints: parseInt(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label="Passing Score (%)"
              value={currentAssessment?.passingScore || 0}
              onChange={(e) =>
                setCurrentAssessment({
                  ...currentAssessment,
                  passingScore: parseInt(e.target.value),
                })
              }
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Instructions"
              value={currentAssessment?.instructions || ''}
              onChange={(e) =>
                setCurrentAssessment({
                  ...currentAssessment,
                  instructions: e.target.value,
                })
              }
            />
          </Grid>

          {assessmentTypes[currentAssessment?.type]?.hasQuestions && (
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Questions
                </Typography>
                <List>
                  {currentAssessment?.questions?.map((question, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={question.text}
                        secondary={`${question.points} points - ${question.type}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            setCurrentQuestion({ ...question, index });
                            setIsQuestionDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          onClick={() => {
                            const newQuestions = currentAssessment.questions.filter(
                              (_, i) => i !== index
                            );
                            setCurrentAssessment({
                              ...currentAssessment,
                              questions: newQuestions,
                            });
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleQuestionAdd}
                  variant="outlined"
                >
                  Add Question
                </Button>
              </Box>
            </Grid>
          )}

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentAssessment?.isTimeLimited || false}
                  onChange={(e) =>
                    setCurrentAssessment({
                      ...currentAssessment,
                      isTimeLimited: e.target.checked,
                    })
                  }
                />
              }
              label="Time Limited"
            />
            {currentAssessment?.isTimeLimited && (
              <TextField
                sx={{ ml: 3 }}
                type="number"
                label="Duration (minutes)"
                value={currentAssessment?.duration || 60}
                onChange={(e) =>
                  setCurrentAssessment({
                    ...currentAssessment,
                    duration: parseInt(e.target.value),
                  })
                }
              />
            )}
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={currentAssessment?.requiresProctoring || false}
                  onChange={(e) =>
                    setCurrentAssessment({
                      ...currentAssessment,
                      requiresProctoring: e.target.checked,
                    })
                  }
                />
              }
              label="Requires Proctoring"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
        <Button onClick={handleAssessmentSave} variant="contained" color="primary">
          Save Assessment
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Course Assessments
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Create and manage course assessments
        </Typography>
      </Box>

      <AnimatePresence>
        {assessments.map((assessment, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Paper sx={{ mb: 2 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Grid container alignItems="center" spacing={2}>
                    <Grid item>
                      {assessmentTypes[assessment.type]?.icon}
                    </Grid>
                    <Grid item xs>
                      <Typography variant="subtitle1">{assessment.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {assessment.totalPoints} points - Due:{' '}
                        {new Date(assessment.dueDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Chip
                        label={assessmentTypes[assessment.type]?.label}
                        color={assessmentTypes[assessment.type]?.color}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ pl: 2 }}>
                    <Typography variant="body2" paragraph>
                      {assessment.instructions}
                    </Typography>
                    {assessment.questions?.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Questions: {assessment.questions.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Points: {assessment.totalPoints}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {assessment.isTimeLimited && (
                        <Chip
                          label={`${assessment.duration} minutes`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      {assessment.requiresProctoring && (
                        <Chip
                          label="Proctored"
                          size="small"
                          variant="outlined"
                          color="warning"
                        />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleAssessmentEdit(assessment, index)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleAssessmentDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </motion.div>
        ))}
      </AnimatePresence>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAssessmentAdd}
        >
          Add Assessment
        </Button>
      </Box>

      {AssessmentDialog()}
      {QuestionDialog()}
    </motion.div>
  );
}
