/**
 * Formats the AI response to present it in an organized and professional manner.
 *
 * @param {string} response - The AI response to format.
 * @returns {string} The formatted response.
 */
function formatResponse(response) {
  const lines = response.split('\n');
  let formattedResponse = '';
  let inList = false;

  lines.forEach(line => {
    if (line.startsWith('* ')) {
      if (!inList) {
        inList = true;
        formattedResponse += '\n';
      }
      formattedResponse += `- ${line.substring(2)}\n`;
    } else if (line.startsWith('    * ')) {
      formattedResponse += `  - ${line.substring(6)}\n`;
    } else {
      if (inList) {
        inList = false;
        formattedResponse += '\n';
      }
      formattedResponse += `${line}\n`;
    }
  });

  return formattedResponse.trim();
}

module.exports = formatResponse;
