
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addTask, removeTask } from "../tasksSlice"; // Import removeTask action
import { db, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "../firebase"; // Import deleteDoc
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth and signOut
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

function TaskBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks) || { todo: [], inProgress: [], completed: [] }; // Ensure tasks is always an object with the required keys
  const [newTask, setNewTask] = useState("");
  const [selectedSection, setSelectedSection] = useState("todo");
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "tasks"), where("userId", "==", user.uid)); // Query tasks for the logged-in user
        const querySnapshot = await getDocs(q);
        const tasksData = { todo: [], inProgress: [], completed: [] };
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (tasksData[data.section]) {
            tasksData[data.section].push({ id: doc.id, content: data.content, history: data.history || [] });
          } else {
            console.error(`Unexpected section: ${data.section}`);
          }
        });
        // Dispatch an action to set tasks in the Redux store
        dispatch({ type: "tasks/setTasks", payload: tasksData });
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [dispatch]);

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return; // Ensure the user is logged in

    const timestamp = new Date().toISOString(); // Get current timestamp
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        content: newTask,
        section: selectedSection,
        userId: user.uid, // Add user ID to the task
        history: [{ section: selectedSection, timestamp }] // Initialize history with the selected section and timestamp
      });
      dispatch(addTask({ id: docRef.id, content: newTask, section: selectedSection, history: [{ section: selectedSection, timestamp }] }));
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "tasks", taskId));
      // Dispatch removeTask action
      dispatch(removeTask(taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/"); // Redirect to the login form
  };

  const capitalize = (str) => {
    if (!str) return ""; // Return an empty string if str is undefined or null
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  };

  const handleSectionChange = async (taskId, newSection) => {
    const task = tasks[selectedSection].find((t) => t.id === taskId);
    const timestamp = new Date().toISOString(); // Get current timestamp
    const updatedTask = { ...task, section: newSection, history: [...task.history, { section: newSection, timestamp }] };

    try {
      // Update Firestore
      const taskDocRef = doc(db, "tasks", taskId);
      await updateDoc(taskDocRef, { section: newSection, history: updatedTask.history });

      // Dispatch moveTask action
      dispatch({ type: "tasks/moveTask", payload: { source: selectedSection, destination: newSection, task: updatedTask } });
    } catch (error) {
      console.error("Error updating task section:", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl p-3 text-center font-bold">Project Dashboard Management</h1>
      <div className="bg-blue-400 text-center p-1">
        <input
          className="border border-black p-1 m-1"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New Task"
        />
        <select
          className="border border-black mr-2 p-1"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button className="border border-black bg-white p-1" onClick={handleAddTask}>
          Add Task
        </button>
        <button className="border border-black bg-red-400 hover:bg-red-600 p-1 ml-2" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
      <div className="border p-5 flex md:flex-nowrap flex-wrap gap-10 justify-around">
        {["todo", "inProgress", "completed"].map((section) => {
          console.log(`Rendering section: ${section}`);
          console.log(`Tasks for ${section}:`, tasks[section]);
          return (
            <div key={section} className="border border-blue-400 p-5 font-semibold rounded-2xl bg-gray-100 md:w-1/3">
              <h2 className="md:text-3xl text-xl mb-4">{capitalize(section)}</h2>
              {tasks[section] ? (
                tasks[section].map((task) => (
                  <div key={task.id} className="bg-white p-3 mb-2 rounded-lg shadow-md flex flex-col">
                    <div className="flex justify-between items-center">
                      <span>{task.content}</span>
                      <button
                        className="bg-red-500 text-white p-1 rounded"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                    <select
                      className="border border-black mt-2 p-1"
                      value={task.section}
                      onChange={(e) => handleSectionChange(task.id, e.target.value)}
                    >
                      <option value="todo">To Do</option>
                      <option value="inProgress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    <div className="mt-2">
                      <strong>History:</strong>
                      <ul>
                        {/* Without null check it will not work! */}
                        {task?.history?.map((historyItem, idx) => (
                          <li key={idx}>
                            {capitalize(historyItem.section)} - {new Date(historyItem.timestamp).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks available.</p> // Optional: Message when there are no tasks
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TaskBoard;
