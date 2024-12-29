// Suppress react-beautiful-dnd defaultProps warning
const originalConsoleWarn = console.warn;
console.warn = (...args) => {
    if (args[0].includes('defaultProps will be removed')) {
        return;
    }
    originalConsoleWarn(...args);
}; 