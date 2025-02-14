import { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addTask } from "../slice/tasksSlice";
import { IoArrowBackSharp } from "react-icons/io5";
import { AppDispatch } from "../store/store";

interface Errors {
  title?: string;
  description?: string;
}

const TaskForm = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const onHandleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "title") setTitle(value);
    else setDescription(value);
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let validationErrors: Errors = {};
    if (!title.trim()) validationErrors.title = "Title is required!";
    if (!description.trim())
      validationErrors.description = "Description is required!";
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(addTask({ title: title, body: description }));
    setTitle("");
    setDescription("");
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className=" text-gray-400 border rounded-lg p-2 hover:text-white"
        >
          <IoArrowBackSharp />
        </button>
        <h2 className="text-2xl font-bold text-center mb-4">Add New Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              name="title"
              value={title}
              onChange={onHandleInputChange}
              placeholder="Task Title"
              className={`w-full p-3 border rounded-md bg-gray-800 text-gray-300 outline-none ${
                errors.title ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="description"
              value={description}
              onChange={onHandleInputChange}
              placeholder="Description"
              className={`w-full p-3 border rounded-md bg-gray-800 text-gray-300 outline-none ${
                errors.description ? "border-red-500" : "border-gray-600"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-teal-700 hover:bg-teal-600 text-white py-2 rounded-md font-semibold transition"
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
