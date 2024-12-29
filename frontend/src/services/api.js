const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const courseAPI = {
  async generateAICourse(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course-generation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(params)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate course content');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating course:', error);
      throw error;
    }
  }
}; 