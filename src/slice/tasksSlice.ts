import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  id: number;
  title: string;
  body: string;
}

interface TasksState {
  items: Task[];
}

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchtasks",
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addTask = createAsyncThunk<Task, Omit<Task, "id">>(
  "tasks/addtask",
  async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data;
  }
);

export const editTask = createAsyncThunk<Task, Task>(
  "tasks/edittask",
  async (task) => {
    const response = await axios.put(`${API_URL}/${task.id}`, task);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk<number, number>(
  "tasks/deletetask",
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [] as Task[],
  } as TasksState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.items = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.items.push(action.payload);
      })
      .addCase(editTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const itemIndex = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (itemIndex !== -1) state.items[itemIndex] = action.payload;
      })
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      });
  },
});

export default tasksSlice.reducer;
