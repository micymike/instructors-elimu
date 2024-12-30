/**
 * Formats AI responses by removing asterisks and presenting them neatly.
 *
 * @param {string} response - The AI response to be formatted.
 * @returns {string} The formatted response.
 */
export function formatResponse(response: any): any {
  if (typeof response === 'string') {
    // Remove asterisks from the response
    return response.replace(/\*/g, '');
  } else if (typeof response === 'object') {
    // Format the object response
    return JSON.stringify(response, null, 2);
  } else {
    return response;
  }
}
