# API Endpoints

## Courses

### GET /api/courses/:id/learn

* Description: Display course materials for a specific course
* Parameters: id (string)
* Response: Course materials

### POST /api/courses

* Description: Create a new course
* Body: CreateCourseDto
* Response: Created course

### POST /api/courses/course-generation

* Description: Generate a course using Gemini
* Body: CreateCourseDto
* Response: Generated course

### POST /api/courses/analyze

* Description: Analyze a course
* Body: CreateCourseDto
* Response: Analysis results

### GET /api/courses

* Description: Get all courses
* Response: List of courses

### GET /api/courses/:id

* Description: Get a specific course
* Parameters: id (string)
* Response: Course

### PUT /api/courses/:id

* Description: Update a course
* Parameters: id (string)
* Body: UpdateCourseDto
* Response: Updated course

### PUT /api/courses/:id/content

* Description: Update course content
* Parameters: id (string)
* Body: UpdateContentDto
* Response: Updated course

### DELETE /api/courses/:id

* Description: Delete a course
* Parameters: id (string)
* Response: Deleted course

### GET /api/courses/:id/content

* Description: Get course content
* Parameters: id (string)
* Response: Course content

### POST /api/courses/:id/upload

* Description: Upload course content
* Parameters: id (string)
* Body: File
* Response: Uploaded course content

### POST /api/courses/generate-content

* Description: Generate course content using Gemini
* Body: { message: string }
* Response: Generated course content
