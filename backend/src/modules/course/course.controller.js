async getCourseProgress(req, res) {
    try {
        const progress = await this.courseService.getProgress(req.params.courseId, req.user.id);
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress' });
    }
}

async updateProgress(req, res) {
    try {
        const progress = await this.courseService.updateProgress(
            req.params.courseId,
            req.user.id,
            req.body.itemId,
            req.body.completed
        );
        res.json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update progress' });
    }
} 