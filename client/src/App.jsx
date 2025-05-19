import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Notes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NoteDetails from "./pages/NoteDetails";
import CreateNote from "./pages/CreateNote";
import PrivateRoute from "./components/PrivateRoute";
import { useSelector, useDispatch } from "react-redux";
import { useMeQuery } from "./redux/api/userApi";
import { setUsername } from "./redux/slices/userSlice";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function App() {
  const dispatch = useDispatch();
  const { data: getUserData } = useMeQuery();

  useEffect(() => {
    if (getUserData) {
      dispatch(setUsername(getUserData.username));
    }
  }, [getUserData, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/create"
          element={
            <PrivateRoute>
              <CreateNote />
            </PrivateRoute>
          }
        />
        <Route
          path="/notedetails/:id"
          element={
            <PrivateRoute>
              <NoteDetails />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={true} />
    </BrowserRouter>
  );
}
