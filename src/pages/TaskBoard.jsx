// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { addTask, moveTask } from "../tasksSlice";
// import { db, collection, addDoc, getDocs, query, where, updateDoc, doc } from "../firebase";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth and signOut
// import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

// function TaskBoard() {
//   const dispatch = useDispatch();
//   const tasks = useSelector((state) => state.tasks.tasks);
//   const [newTask, setNewTask] = useState("");
//   const [selectedSection, setSelectedSection] = useState("todo");
//   const navigate = useNavigate(); // Initialize useNavigate

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const q = query(collection(db, "tasks"), where("userId", "==", user.uid)); // Query tasks for the logged-in user
//         const querySnapshot = await getDocs(q);
//         const tasksData = { todo: [], inProgress: [], completed: [] };
//         querySnapshot.forEach((doc) => {
//           const data = doc.data();
//           tasksData[data.section].push({ id: doc.id, content: data.content });
//         });
//         // Dispatch an action to set tasks in the Redux store
//         dispatch({ type: "tasks/setTasks", payload: tasksData });
//       }
//     });

//     return () => unsubscribe(); // Cleanup the listener on unmount
//   }, [dispatch]);

//   const handleDragEnd = async (result) => {
//     if (!result.destination) return;
//     const { source, destination, draggableId } = result;
//     if (source.droppableId === destination.droppableId && source.index === destination.index) return;

//     const task = tasks[source.droppableId].find((t) => t.id === draggableId);
//     const updatedTask = { ...task, section: destination.droppableId };

//     // Update Firestore
//     const taskDocRef = doc(db, "tasks", draggableId);
//     await updateDoc(taskDocRef, { section: destination.droppableId });

//     // Dispatch moveTask action
//     dispatch(moveTask({ source: source.droppableId, destination: destination.droppableId, task: updatedTask }));
//   };

//   const handleAddTask = async () => {
//     if (newTask.trim() === "") return;
//     const auth = getAuth();
//     const user = auth.currentUser;
//     if (!user) return; // Ensure the user is logged in

//     const docRef = await addDoc(collection(db, "tasks"), {
//       content: newTask,
//       section: selectedSection,
//       userId: user.uid // Add user ID to the task
//     });
//     dispatch(addTask({ id: docRef.id, content: newTask, section: selectedSection }));
//     setNewTask("");
//   };

//   const handleSignOut = async () => {
//     const auth = getAuth();
//     await signOut(auth);
//     navigate("/"); // Redirect to the login form
//   };

//   const capitalize = (str) => {
//     return str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
//   };

//   return (
//     <div>
//       <div className="bg-blue-400 text-center p-1">
//         <input
//           className="border border-black p-1 m-1"
//           type="text"
//           value={newTask}
//           onChange={(e) => setNewTask(e.target.value)}
//           placeholder="New Task"
//         />
//         <select
//           className="border border-black mr-2 p-1"
//           value={selectedSection}
//           onChange={(e) => setSelectedSection(e.target.value)}
//         >
//           <option value="todo">To Do</option>
//           <option value="inProgress">In Progress</option>
//           <option value="completed">Completed</option>
//         </select>
//         <button className="border border-black bg-white p-1" onClick={handleAddTask}>
//           Add Task
//         </button>
//         <button className="border border-black bg-red-400 hover:bg-red-600 p-1 ml-2" onClick={handleSignOut}>
//           Sign Out
//         </button>
//       </div>
//       <div className="border p-5 flex flex-wrap  justify-around gap-1">
//         <DragDropContext onDragEnd={handleDragEnd}>
//           {["todo", "inProgress", "completed"].map((section) => (
//             <Droppable droppableId={section} key={section}>
//               {(provided) => (
//                 <div
//                   className="border border-blue-400 p-2 text-center font-semibold rounded-2xl bg-gray-100 w-1/3"
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                 >
//                   <h2 className="text-3xl mb-4">{capitalize(section)}</h2>
//                   {tasks[section].map((task, index) => (
//                     <Draggable key={task.id} draggableId={task.id} index={index}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.draggableProps}
//                           {...provided.dragHandleProps}
//                           className="bg-white p-3 mb-2 rounded-lg shadow-md"
//                         >
//                           {task.content}
//                         </div>
//                       )}
//                     </Draggable>  
//                   ))}
//                   {provided.placeholder}
//                 </div>
//               )}
//             </Droppable>
//           ))}
//         </DragDropContext>
//       </div>
//     </div>
//   );
// }

// export default TaskBoard;


import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { addTask, moveTask, removeTask } from "../tasksSlice"; // Import removeTask action
import { db, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from "../firebase"; // Import deleteDoc
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Import Firebase Auth and signOut
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection


function TaskBoard() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.tasks);
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
          tasksData[data.section].push({ id: doc.id, content: data.content });
        });
        // Dispatch an action to set tasks in the Redux store
        dispatch({ type: "tasks/setTasks", payload: tasksData });
      }
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [dispatch]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const task = tasks[source.droppableId].find((t) => t.id === draggableId);
    const updatedTask = { ...task, section: destination.droppableId };

    // Update Firestore
    const taskDocRef = doc(db, "tasks", draggableId);
    await updateDoc(taskDocRef, { section: destination.droppableId });

    // Dispatch moveTask action
    dispatch(moveTask({ source: source.droppableId, destination: destination.droppableId, task: updatedTask }));
  };

  const handleAddTask = async () => {
    if (newTask.trim() === "") return;
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return; // Ensure the user is logged in

    const docRef = await addDoc(collection(db, "tasks"), {
      content: newTask,
      section: selectedSection,
      userId: user.uid // Add user ID to the task
    });
    dispatch(addTask({ id: docRef.id, content: newTask, section: selectedSection }));
    setNewTask("");
  };

  const handleDeleteTask = async (taskId) => {
    // Delete from Firestore
    await deleteDoc(doc(db, "tasks", taskId));
    // Dispatch removeTask action
    dispatch(removeTask(taskId));
  };

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    navigate("/"); // Redirect to the login form
  };

  const capitalize = (str) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
  };

  return (
    <div>
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
      <div className="border p-5 flex gap-10 justify-around">
        <DragDropContext onDragEnd={handleDragEnd}>
          {["todo", "inProgress", "completed"].map((section) => (
            <Droppable droppableId={section} key={section}>
              {(provided) => (
                <div
                  className="border border-blue-400 p-5 font-semibold rounded-2xl bg-gray-100 w-1/3"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <h2 className="text-3xl mb-4">{capitalize(section)}</h2>
                  {tasks[section].map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-3 mb-2 rounded-lg shadow-md flex justify-between items-center"
                        >
                          <span>{task.content}</span>
                          <button
                            className="bg-red-500 text-white p-1 rounded"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>  
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default TaskBoard;
