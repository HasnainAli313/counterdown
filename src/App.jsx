import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";  

import Home from "./pages/Home";
import TaskBoard from "./pages/taskBoard";

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
          <Route path="/taskboard" element={<TaskBoard/>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;

