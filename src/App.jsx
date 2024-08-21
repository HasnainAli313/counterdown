import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";  
import TaskBoard from "./pages/TaskBoard";
import TaskHistory from "./pages/TaskHistory";
import Home from "./pages/Home";

const store = configureStore({
  reducer: {
    tasks: tasksReducer
  }
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/taskboard" element={<TaskBoard />} />
          <Route path="/taskhistory" element={<TaskHistory />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

