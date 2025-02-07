import React, { useState } from 'react';
import {
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Grid,
  Slider,
  Switch,
  FormControlLabel,
  Tooltip
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  Settings,
  HelpCircle,
  X,
  Download
} from 'lucide-react';

const GradeAnalytics = ({ grades, onApplyCurve }) => {
  const [showCurveDialog, setShowCurveDialog] = useState(false);
  const [curveSettings, setCurveSettings] = useState({
    method: 'linear', // linear, bell, custom
    targetMean: 85,
    standardDeviation: 10,
    minGrade: 0,
    maxGrade: 100,
    customPoints: [
      { original: 0, curved: 0 },
      { original: 100, curved: 100 }
    ]
  });

  const calculateStatistics = () => {
    const values = grades.map(g => g.score);
    const sum = values.reduce((a, b) => a + b, 0);
    const mean = sum / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      mean: mean.toFixed(2),
      median: values.sort((a, b) => a - b)[Math.floor(values.length / 2)],
      stdDev: stdDev.toFixed(2),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const generateHistogramData = () => {
    const buckets = Array(10).fill(0);
    grades.forEach(grade => {
      const bucketIndex = Math.min(Math.floor(grade.score / 10), 9);
      buckets[bucketIndex]++;
    });

    return buckets.map((count, i) => ({
      range: `${i * 10}-${(i + 1) * 10}`,
      count
    }));
  };

  const applyCurve = () => {
    let curvedGrades;

    switch (curveSettings.method) {
      case 'linear':
        curvedGrades = grades.map(grade => ({
          ...grade,
          curvedScore: Math.min(
            100,
            Math.max(0, grade.score * (curveSettings.targetMean / calculateStatistics().mean))
          )
        }));
        break;

      case 'bell':
        const stats = calculateStatistics();
        curvedGrades = grades.map(grade => {
          const zScore = (grade.score - stats.mean) / stats.stdDev;
          const curvedScore = Math.min(
            100,
            Math.max(0, curveSettings.targetMean + (zScore * curveSettings.standardDeviation))
          );
          return { ...grade, curvedScore };
        });
        break;

      case 'custom':
        curvedGrades = grades.map(grade => {
          // Find the two closest points
          const points = [...curveSettings.customPoints].sort((a, b) => a.original - b.original);
          let lower = points[0];
          let upper = points[points.length - 1];

          for (let i = 0; i < points.length - 1; i++) {
            if (grade.score >= points[i].original && grade.score <= points[i + 1].original) {
              lower = points[i];
              upper = points[i + 1];
              break;
            }
          }

          // Linear interpolation
          const percentage = (grade.score - lower.original) / (upper.original - lower.original);
          const curvedScore = Math.min(
            100,
            Math.max(0, lower.curved + (percentage * (upper.curved - lower.curved)))
          );

          return { ...grade, curvedScore };
        });
        break;

      default:
        curvedGrades = grades;
    }

    onApplyCurve(curvedGrades);
    setShowCurveDialog(false);
  };

  const stats = calculateStatistics();
  const histogramData = generateHistogramData();

  return (
    <div>
      <Card className="p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Grade Distribution</Typography>
          <div className="flex space-x-2">
            <Button
              startIcon={<Settings />}
              variant="outlined"
              onClick={() => setShowCurveDialog(true)}
            >
              Grade Curve
            </Button>
            <Button
              startIcon={<Download />}
              variant="outlined"
              onClick={() => {/* Implement export */}}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <Grid container spacing={2} className="mt-4">
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Mean</Typography>
            <Typography variant="h6">{stats.mean}%</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Median</Typography>
            <Typography variant="h6">{stats.median}%</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Std Dev</Typography>
            <Typography variant="h6">{stats.stdDev}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Minimum</Typography>
            <Typography variant="h6">{stats.min}%</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle2" color="textSecondary">Maximum</Typography>
            <Typography variant="h6">{stats.max}%</Typography>
          </Grid>
        </Grid>
      </Card>

      <Dialog
        open={showCurveDialog}
        onClose={() => setShowCurveDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          Grade Curve Settings
          <IconButton onClick={() => setShowCurveDialog(false)}>
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="space-y-6">
            <div>
              <Typography variant="subtitle1" className="mb-2">Curve Method</Typography>
              <div className="grid grid-cols-3 gap-4">
                {['linear', 'bell', 'custom'].map(method => (
                  <Button
                    key={method}
                    variant={curveSettings.method === method ? 'contained' : 'outlined'}
                    onClick={() => setCurveSettings(prev => ({ ...prev, method }))}
                  >
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {curveSettings.method === 'linear' && (
              <div>
                <Typography variant="subtitle2" className="mb-2">
                  Target Mean
                  <Tooltip title="The desired class average after curving">
                    <IconButton size="small">
                      <HelpCircle className="w-4 h-4" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                <Slider
                  value={curveSettings.targetMean}
                  onChange={(_, value) => setCurveSettings(prev => ({ ...prev, targetMean: value }))}
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={100}
                />
              </div>
            )}

            {curveSettings.method === 'bell' && (
              <>
                <div>
                  <Typography variant="subtitle2" className="mb-2">
                    Target Mean
                    <Tooltip title="The desired class average after curving">
                      <IconButton size="small">
                        <HelpCircle className="w-4 h-4" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Slider
                    value={curveSettings.targetMean}
                    onChange={(_, value) => setCurveSettings(prev => ({ ...prev, targetMean: value }))}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <Typography variant="subtitle2" className="mb-2">
                    Standard Deviation
                    <Tooltip title="Controls the spread of grades">
                      <IconButton size="small">
                        <HelpCircle className="w-4 h-4" />
                      </IconButton>
                    </Tooltip>
                  </Typography>
                  <Slider
                    value={curveSettings.standardDeviation}
                    onChange={(_, value) => setCurveSettings(prev => ({ ...prev, standardDeviation: value }))}
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={20}
                  />
                </div>
              </>
            )}

            {curveSettings.method === 'custom' && (
              <div>
                <Typography variant="subtitle2" className="mb-2">
                  Custom Curve Points
                  <Tooltip title="Define custom mapping points for the curve">
                    <IconButton size="small">
                      <HelpCircle className="w-4 h-4" />
                    </IconButton>
                  </Tooltip>
                </Typography>
                {curveSettings.customPoints.map((point, index) => (
                  <div key={index} className="flex space-x-4 mb-2">
                    <TextField
                      label="Original Grade"
                      type="number"
                      value={point.original}
                      onChange={(e) => {
                        const newPoints = [...curveSettings.customPoints];
                        newPoints[index].original = Number(e.target.value);
                        setCurveSettings(prev => ({ ...prev, customPoints: newPoints }));
                      }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                    <TextField
                      label="Curved Grade"
                      type="number"
                      value={point.curved}
                      onChange={(e) => {
                        const newPoints = [...curveSettings.customPoints];
                        newPoints[index].curved = Number(e.target.value);
                        setCurveSettings(prev => ({ ...prev, customPoints: newPoints }));
                      }}
                      inputProps={{ min: 0, max: 100 }}
                    />
                    {index > 1 && (
                      <IconButton onClick={() => {
                        const newPoints = curveSettings.customPoints.filter((_, i) => i !== index);
                        setCurveSettings(prev => ({ ...prev, customPoints: newPoints }));
                      }}>
                        <X />
                      </IconButton>
                    )}
                  </div>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => {
                    const newPoints = [...curveSettings.customPoints, { original: 50, curved: 50 }];
                    setCurveSettings(prev => ({ ...prev, customPoints: newPoints }));
                  }}
                >
                  Add Point
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCurveDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={applyCurve}>
            Apply Curve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GradeAnalytics;
