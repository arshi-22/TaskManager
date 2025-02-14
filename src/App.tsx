import "./index.css";
import TaskForm from "./components/TaskForm";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchTasks } from "./slice/tasksSlice";
import TaskList from "./components/TaskList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppDispatch } from "./store/store"; 

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
        <Route path="/createTask" element={<TaskForm />} />
      </Routes>
    </Router>
  );
};

export default App;
