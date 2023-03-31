import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const user = useSelector((state) => state.user.userObj);
    if (user) {
        return children;
    }
    return <Navigate to="/" />;
}
