"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInstructorDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_instructor_dto_1 = require("./create-instructor.dto");
class UpdateInstructorDto extends (0, mapped_types_1.PartialType)(create_instructor_dto_1.CreateInstructorDto) {
}
exports.UpdateInstructorDto = UpdateInstructorDto;
//# sourceMappingURL=update-instructor.dto.js.map