import { createSlice } from '@reduxjs/toolkit';

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: {
      todo: [],
      inProgress: [],
      completed: []
    }
  },
  reducers: {
    addTask: (state, action) => {
      const { id, content, section } = action.payload;
      state.tasks[section].push({ id, content });
    },
    moveTask: (state, action) => {
      const { source, destination, task } = action.payload;
      state.tasks[source] = state.tasks[source].filter(t => t.id !== task.id);
      state.tasks[destination].push(task);
    },
    removeTask: (state, action) => {
      const taskId = action.payload;
      for (const section in state.tasks) {
        state.tasks[section] = state.tasks[section].filter(task => task.id !== taskId);
      }
    },
    setTasks: (state, action) => {
      state.tasks = action.payload;
    }
  }
});

export const { addTask, moveTask, removeTask, setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;

  