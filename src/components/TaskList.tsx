import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, editTask } from "../slice/tasksSlice";
import { Link } from "react-router-dom";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { AppDispatch } from "../store/store";

interface Task {
  id: number;
  title: string;
  body: string;
}

interface State {
  tasks: {
    items: Task[];
  };
}

const TaskList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector((state: State) => state.tasks.items);
  const [editItem, setEditItem] = useState<number | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>("");
  const [editTaskDescription, setEditTaskDescription] = useState<string>("");
  const [filterText, setFilterText] = useState<string>("");
  const [sortField, setSortField] = useState<"title" | "body">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const tasksPerPage = 7;

  const handleEdit = (task: Task) => {
    setEditItem(task.id);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.body);
  };

  const handleSave = (id: number) => {
    setIsLoading(true);
    const taskToEdit = tasks.find((task) => task.id === id);
    if (!taskToEdit) return;
    dispatch(
      editTask({
        id: id,
        title: editTaskTitle,
        body: editTaskDescription,
      })
    );
    setEditItem(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
    setIsLoading(false);
  };

  const handleCancel = () => {
    setEditItem(null);
    setEditTaskTitle("");
    setEditTaskDescription("");
  };

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortField].localeCompare(b[sortField]);
      } else {
        return b[sortField].localeCompare(a[sortField]);
      }
    });

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
        Task List
      </h1>
      <div className="mb-4 flex flex-wrap justify-center gap-4 w-full max-w-4xl">
        <Link
          to="/createTask"
          className="bg-green-600 text-white text-sm md:text-base font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Create New Task
        </Link>
        <input
          type="text"
          placeholder="Filter by title..."
          className="p-2 text-black rounded-md w-40"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <div className="flex gap-2">
          <select
            className="p-2 text-black rounded-md w-48"
            value={sortField}
            onChange={(e) => setSortField(e.target.value as "title" | "body")}
          >
            <option value="title">Sort by Title</option>
            <option value="body">Sort by Description</option>
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex gap-2 items-center"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            Sort {sortOrder === "asc" ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
         <span className="loading loading-dots loading-sm"></span>
        </div>
      )}
      {paginatedTasks.length > 0 ? (
        <div className="w-full max-w-4xl">
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-600 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-white text-sm md:text-base">
                  <th className="p-3 w-2/6 border border-gray-600">Task</th>
                  <th className="p-3 w-1/3 border border-gray-600">
                    Description
                  </th>
                  <th className="p-3 w-1/6 border border-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTasks.map((task) => (
                  <tr
                    key={task.id}
                    className="text-white border-b border-gray-700 bg-gray-900"
                  >
                    <td className="p-3 border border-gray-700">
                      {editItem === task.id ? (
                        <input
                          className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white"
                          type="text"
                          value={editTaskTitle}
                          onChange={(event) =>
                            setEditTaskTitle(event.target.value)
                          }
                        />
                      ) : (
                        <span
                          className="block w-full truncate max-w-xs max-h-xs"
                          title={task.title}
                        >
                          {task.title}
                        </span>
                      )}
                    </td>
                    <td className="p-3 border border-gray-700">
                      {editItem === task.id ? (
                        <textarea
                          className="w-full p-2 border border-gray-500 rounded bg-gray-700 text-white"
                          value={editTaskDescription}
                          onChange={(event) =>
                            setEditTaskDescription(event.target.value)
                          }
                        />
                      ) : (
                        <span
                          className="block w-full truncate max-w-xs"
                          title={task.body}
                        >
                          {task.body}
                        </span>
                      )}
                    </td>
                    <td className="p-3 flex flex-wrap justify-center gap-2">
                      {editItem === task.id ? (
                        <>
                          <button
                            className="bg-green-700 text-white px-5 py-1 rounded-md hover:bg-green-800 transition"
                            onClick={() => handleSave(task.id)}
                          >
                            SAVE
                          </button>
                          <button
                            className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 transition"
                            onClick={handleCancel}
                          >
                            CANCEL
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="bg-blue-600 text-white px-5 py-1 rounded-md hover:bg-blue-700 transition"
                            onClick={() => handleEdit(task)}
                          >
                            EDIT
                          </button>
                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                            onClick={() => dispatch(deleteTask(task.id))}
                          >
                            DELETE
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700 transition"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <span className="text-red-500 text-sm md:text-base mt-4 text-center">
          No items to display
        </span>
      )}
    </div>
  );
};

export default TaskList;
