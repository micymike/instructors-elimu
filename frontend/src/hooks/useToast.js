import toast from 'react-hot-toast';

export const useToast = () => {
    return {
        toast: {
            success: (message) => toast.success(message),
            error: (description) => toast.error(description),
            loading: (message) => toast.loading(message),
            custom: ({ title, description, status }) => {
                switch (status) {
                    case 'success':
                        toast.success(description || title);
                        break;
                    case 'error':
                        toast.error(description || title);
                        break;
                    default:
                        toast(description || title);
                }
            }
        }
    };
}; 