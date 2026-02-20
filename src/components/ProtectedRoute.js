import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ element: Component, ...props }) {
  return props.isLoggedIn ? (
    <Component {...props} />
  ) : (
    <Navigate to="/signup" replace />
  );
}
