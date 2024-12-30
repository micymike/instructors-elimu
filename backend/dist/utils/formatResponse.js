"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatResponse = formatResponse;
function formatResponse(response) {
    if (typeof response === 'string') {
        return response.replace(/\*/g, '');
    }
    else if (typeof response === 'object') {
        return JSON.stringify(response, null, 2);
    }
    else {
        return response;
    }
}
//# sourceMappingURL=formatResponse.js.map