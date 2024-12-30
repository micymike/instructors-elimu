import { CourseService } from './course.service';
import { CourseWizardService, CourseWizardFormattedResponse } from './course-wizard.service';
export declare class CourseController {
    private readonly courseService;
    private readonly courseWizardService;
    constructor(courseService: CourseService, courseWizardService: CourseWizardService);
    analyzeCourse(basicInfo: any): Promise<CourseWizardFormattedResponse>;
    generateSyllabus(data: any): Promise<CourseWizardFormattedResponse>;
    createCourse(courseData: any): Promise<import("./schemas/course.schema").CourseDocument>;
    getAllCourses(): Promise<import("./schemas/course.schema").CourseDocument[]>;
    getCourse(id: string): Promise<import("./schemas/course.schema").CourseDocument>;
}
