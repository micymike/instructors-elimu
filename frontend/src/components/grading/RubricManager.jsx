import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Typography,
  Card,
  Slider,
  Box,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  MoveVertical,
  Copy
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const RubricManager = ({ open, onClose, initialRubric, onSave }) => {
  const [rubric, setRubric] = useState({
    title: '',
    description: '',
    totalPoints: 100,
    criteria: []
  });
  const [editingCriterion, setEditingCriterion] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialRubric) {
      setRubric(initialRubric);
    }
  }, [initialRubric]);

  const handleAddCriterion = () => {
    const newCriterion = {
      id: Date.now(),
      name: '',
      description: '',
      weight: 0,
      levels: [
        { score: 0, description: 'Does not meet expectations' },
        { score: 50, description: 'Partially meets expectations' },
        { score: 100, description: 'Meets expectations' }
      ]
    };
    setEditingCriterion(newCriterion);
  };

  const handleSaveCriterion = (criterion) => {
    if (!criterion.name) {
      setError('Criterion name is required');
      return;
    }

    setRubric(prev => {
      const newCriteria = criterion.id
        ? prev.criteria.map(c => c.id === criterion.id ? criterion : c)
        : [...prev.criteria, { ...criterion, id: Date.now() }];

      return {
        ...prev,
        criteria: newCriteria
      };
    });
    setEditingCriterion(null);
    setError('');
  };

  const handleDeleteCriterion = (criterionId) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== criterionId)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(rubric.criteria);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setRubric(prev => ({
      ...prev,
      criteria: items
    }));
  };

  const handleAddLevel = (criterion) => {
    const newLevel = {
      score: 0,
      description: ''
    };
    const updatedCriterion = {
      ...criterion,
      levels: [...criterion.levels, newLevel]
    };
    setEditingCriterion(updatedCriterion);
  };

  const handleDeleteLevel = (criterion, levelIndex) => {
    if (criterion.levels.length <= 2) {
      setError('A criterion must have at least 2 levels');
      return;
    }

    const updatedCriterion = {
      ...criterion,
      levels: criterion.levels.filter((_, index) => index !== levelIndex)
    };
    setEditingCriterion(updatedCriterion);
  };

  const handleUpdateLevel = (criterion, levelIndex, field, value) => {
    const updatedLevels = criterion.levels.map((level, index) => {
      if (index === levelIndex) {
        return { ...level, [field]: value };
      }
      return level;
    });

    setEditingCriterion({
      ...criterion,
      levels: updatedLevels
    });
  };

  const renderCriterionEditor = () => (
    <Dialog open={!!editingCriterion} onClose={() => setEditingCriterion(null)} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {editingCriterion?.id ? 'Edit Criterion' : 'Add Criterion'}
        <IconButton onClick={() => setEditingCriterion(null)}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" className="mb-4">{error}</Alert>}
        
        <TextField
          fullWidth
          label="Criterion Name"
          value={editingCriterion?.name || ''}
          onChange={(e) => setEditingCriterion(prev => ({ ...prev, name: e.target.value }))}
          className="mb-4"
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={2}
          value={editingCriterion?.description || ''}
          onChange={(e) => setEditingCriterion(prev => ({ ...prev, description: e.target.value }))}
          className="mb-4"
        />

        <Typography variant="subtitle1" className="mb-2">Weight (%)</Typography>
        <Slider
          value={editingCriterion?.weight || 0}
          onChange={(_, value) => setEditingCriterion(prev => ({ ...prev, weight: value }))}
          valueLabelDisplay="auto"
          step={5}
          marks
          min={0}
          max={100}
          className="mb-4"
        />

        <Typography variant="subtitle1" className="mb-2">Performance Levels</Typography>
        {editingCriterion?.levels.map((level, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <Typography variant="subtitle2">Level {index + 1}</Typography>
              <IconButton
                size="small"
                onClick={() => handleDeleteLevel(editingCriterion, index)}
                disabled={editingCriterion.levels.length <= 2}
              >
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Score"
                type="number"
                value={level.score}
                onChange={(e) => handleUpdateLevel(editingCriterion, index, 'score', parseInt(e.target.value))}
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                label="Description"
                value={level.description}
                onChange={(e) => handleUpdateLevel(editingCriterion, index, 'description', e.target.value)}
              />
            </div>
          </Card>
        ))}

        <Button
          startIcon={<Plus />}
          onClick={() => handleAddLevel(editingCriterion)}
          variant="outlined"
          fullWidth
        >
          Add Level
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setEditingCriterion(null)}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleSaveCriterion(editingCriterion)}
        >
          Save Criterion
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Rubric Manager
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Rubric Title"
          value={rubric.title}
          onChange={(e) => setRubric(prev => ({ ...prev, title: e.target.value }))}
          className="mb-4"
        />

        <TextField
          fullWidth
          label="Description"
          multiline
          rows={2}
          value={rubric.description}
          onChange={(e) => setRubric(prev => ({ ...prev, description: e.target.value }))}
          className="mb-4"
        />

        <Typography variant="subtitle1" className="mb-4">Criteria</Typography>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="criteria">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {rubric.criteria.map((criterion, index) => (
                  <Draggable key={criterion.id} draggableId={criterion.id.toString()} index={index}>
                    {(provided) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="mb-4 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div {...provided.dragHandleProps}>
                              <MoveVertical className="text-gray-400" />
                            </div>
                            <div>
                              <Typography variant="subtitle1">{criterion.name}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Weight: {criterion.weight}% | Levels: {criterion.levels.length}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <IconButton
                              size="small"
                              onClick={() => setEditingCriterion(criterion)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteCriterion(criterion.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </IconButton>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button
          startIcon={<Plus />}
          onClick={handleAddCriterion}
          variant="outlined"
          fullWidth
          className="mt-4"
        >
          Add Criterion
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSave(rubric)}
          disabled={rubric.criteria.length === 0}
        >
          Save Rubric
        </Button>
      </DialogActions>

      {renderCriterionEditor()}
    </Dialog>
  );
};

export default RubricManager;
