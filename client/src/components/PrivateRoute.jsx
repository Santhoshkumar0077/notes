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
    <div class="flex flex-col items-center justify-center h-screen space-y-4">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p class="text-lg text-gray-700">Please wait...</p>
    </div>
  );
}
