#!/bin/bash

# Function to remove duplicate files
remove_duplicates() {
    local base_dir="$1"
    
    # Course-related duplicates
    rm -f "$base_dir/modules/course/course.controller.js"
    rm -f "$base_dir/routes/courses.routes.js"
    rm -f "$base_dir/routes/course-generation.routes.js"
    rm -f "$base_dir/routes/courseGenerationRoutes.js"
    rm -f "$base_dir/services/course.service.js"

    # Course Generation duplicates
    rm -f "$base_dir/controllers/course-generation.controller.js"
    rm -f "$base_dir/controllers/courseGenerationController.js"
    rm -f "$base_dir/modules/course-generation/course-generation.controller.ts"

    # Auth Middleware duplicates
    rm -f "$base_dir/middleware/auth.middleware.js"

    # Gemini Service duplicates
    rm -f "$base_dir/services/geminiService.js"
    rm -f "$base_dir/ai/gemini.service.ts"

    # Instructor Service duplicates
    rm -f "$base_dir/instructor/instructor.service.ts"

    # Duplicate DTOs
    rm -f "$base_dir/instructor/create-instructor.dto.ts"

    echo "Duplicate files removed successfully!"
}

# Automatically confirm
remove_duplicates "$1"
