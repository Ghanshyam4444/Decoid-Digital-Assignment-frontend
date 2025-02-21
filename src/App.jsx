import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import NavLinks from "./components/Home/Navlink";
import { useAuth } from "./store/auth";
import UserAuthentication from "./pages/UserAuthentication";
import CreateQuiz from "./pages/CreateQuiz";
import AvailableQuiz from "./pages/AvailableQuiz";
import MyQuiz from "./pages/MyQuiz";
import ViewQuiz from "./pages/ViewQuiz";
import ViewSubmissions from "./pages/ViewSubmissions";
import ViewAnswer from "./pages/ViewAnswer";
import NotFound from "./pages/NotFound";

function App() {
  const { isLoggedIn } = useAuth();
  return (
    <>
      {isLoggedIn ? (
        <>
          <NavLinks />
          <Routes>
            <Route path="/" element={<AvailableQuiz />} />
            <Route path="/CreateQuiz" element={<CreateQuiz />} />
            <Route path="/viewQuiz/:id" element={<ViewQuiz />} />
            <Route path="/MyQuiz" element={<MyQuiz />} />
            <Route
              path="/view-submissions/:quizId"
              element={<ViewSubmissions />}
            />
            <Route path="/view-answer/:answerId" element={<ViewAnswer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<UserAuthentication />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </>
  );
}

export default App;
