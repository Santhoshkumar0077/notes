import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function PrivateRoute({ children }) {
  const username = useSelector((state) => state.user.username);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!username) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [username]);

  if (username) return children;
  if (shouldRedirect) return <Navigate to="/login" />;

  return (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status" />
      <div className="mt-2">Checking authentication...</div>
    </div>
  );
}
