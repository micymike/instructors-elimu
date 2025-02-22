import { toast as originalToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const toast = ({ title, description, variant }) => {
  originalToast[variant || 'default'](`${title}: ${description}`);
};
