import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "http://localhost:5000";

function ProjectDetails() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [file, setFile] = useState(null);

  // ✅ stable auth (important fix)
  const auth = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // comments per task
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignedTo: "",
    deadline: ""
  });

  // ---------------- FETCH ----------------

  const fetchTasks = useCallback(async () => {
    const res = await axios.get(`${API}/tasks/${id}`, auth);
    setTasks(res.data);
  }, [id, auth]);

  const fetchEmployees = useCallback(async () => {
    const res = await axios.get(`${API}/employees`, auth);
    setEmployees(res.data);
  }, [auth]);

  const fetchComments = useCallback(async (taskId) => {
    const res = await axios.get(`${API}/comments/${taskId}`, auth);
    setComments(prev => ({
      ...prev,
      [taskId]: res.data
    }));
  }, [auth]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, [fetchTasks, fetchEmployees]);

  useEffect(() => {
    tasks.forEach(t => fetchComments(t._id));
  }, [tasks, fetchComments]);

  // ---------------- TASK CRUD ----------------

  const addTask = async () => {
    await axios.post(`${API}/tasks`, { ...form, projectId: id }, auth);
    resetForm();
    fetchTasks();
  };

  const updateTask = async () => {
    await axios.put(`${API}/tasks/${editingId}`, form, auth);
    resetForm();
    fetchTasks();
  };

  const deleteTask = async (taskId) => {
    await axios.delete(`${API}/tasks/${taskId}`, auth);
    fetchTasks();
  };

  const startEdit = (t) => {
    setForm({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority || "medium",
      assignedTo: t.assignedTo?._id || "",
      deadline: t.deadline?.slice(0, 10) || ""
    });
    setEditingId(t._id);
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignedTo: "",
      deadline: ""
    });
    setEditingId(null);
  };

  // ---------------- FILE UPLOAD ----------------

  const uploadFile = async (taskId) => {
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    await axios.post(`${API}/tasks/${taskId}/upload`, data, auth);

    setFile(null);
    fetchTasks();
  };

  // ---------------- COMMENTS ----------------

  const addComment = async (taskId) => {
    if (!newComment[taskId]) return;

    await axios.post(`${API}/comments`, {
      taskId,
      text: newComment[taskId]
    }, auth);

    setNewComment(prev => ({ ...prev, [taskId]: "" }));
    fetchComments(taskId);
  };

  // ---------------- HELPERS ----------------

  const priorityColor = (p) => {
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  const todo = tasks.filter(t => t.status === "todo");
  const progress = tasks.filter(t => t.status === "progress");
  const done = tasks.filter(t => t.status === "done");

  // ---------------- COLUMN ----------------

  const Column = ({ title, list }) => (
    <div className="bg-white rounded shadow p-4 w-1/3">
      <h3 className="font-bold mb-3">{title}</h3>

      {list.map(t => (
        <div key={t._id} className="border p-3 mb-2 rounded">

          <b>{t.title}</b>
          <p>{t.description}</p>

          <div className={`text-xs text-white px-2 py-1 rounded inline-block mt-1 ${priorityColor(t.priority)}`}>
            {t.priority}
          </div>

          {t.assignedTo && (
            <div className="text-xs mt-1 text-blue-600">
              {t.assignedTo.name}
            </div>
          )}

          {t.deadline && (
            <div className="text-xs text-purple-600">
              {new Date(t.deadline).toLocaleDateString()}
            </div>
          )}

          {/* FILES */}
          {t.files?.map((f, i) => (
            <a key={i} href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer" className="text-blue-600 underline block">
              {f.filename}
            </a>
          ))}

          {/* UPLOAD */}
          <div className="mt-2">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={() => uploadFile(t._id)} className="bg-blue-500 text-white px-2 py-1 text-xs ml-2">
              Upload
            </button>
          </div>

          {/* COMMENTS */}
          <div className="mt-2">
            {(comments[t._id] || []).map(c => (
              <div key={c._id} className="text-xs bg-gray-100 p-1 rounded mb-1">
                {c.text}
              </div>
            ))}
            <div className="mt-3 text-xs bg-gray-50 p-2 rounded">
  <b>Activity</b>

  {(t.activity || []).slice().reverse().map((a, i) => (
    <div key={i} className="border-l-2 border-blue-400 pl-2 mt-1">
      <div>{a.text}</div>
      <div className="text-gray-500">
        {new Date(a.time).toLocaleString()}
      </div>
    </div>
  ))}
</div>

            <div className="flex mt-1">
              <input
                className="border p-1 text-xs flex-1"
                placeholder="Add comment"
                value={newComment[t._id] || ""}
                onChange={(e) =>
                  setNewComment(prev => ({ ...prev, [t._id]: e.target.value }))
                }
              />
              <button onClick={() => addComment(t._id)} className="bg-blue-500 text-white px-2 text-xs">
                Send
              </button>
            </div>
          </div>

          <div className="mt-2 space-x-2">
            <button onClick={() => startEdit(t)} className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
              Edit
            </button>
            <button onClick={() => deleteTask(t._id)} className="bg-red-500 text-white px-2 py-1 rounded text-xs">
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );

  // ---------------- UI ----------------

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Project Tasks</h1>

      <div className="bg-white p-4 rounded shadow mb-6 space-x-2">

        <input className="border p-2" placeholder="task title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <input className="border p-2" placeholder="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input type="date" className="border p-2"
          value={form.deadline}
          onChange={(e) => setForm({ ...form, deadline: e.target.value })}
        />

        <select className="border p-2"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="todo">Todo</option>
          <option value="progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select className="border p-2"
          value={form.priority}
          onChange={(e) => setForm({ ...form, priority: e.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select className="border p-2"
          value={form.assignedTo}
          onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
        >
          <option value="">Assign Employee</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>

        <button onClick={editingId ? updateTask : addTask}
          className="bg-green-600 text-white px-4 py-2 rounded">
          {editingId ? "Update Task" : "Add Task"}
        </button>

        {editingId && (
          <button onClick={resetForm}
            className="bg-gray-400 text-white px-4 py-2 rounded">
            Cancel
          </button>
        )}
      </div>

      <div className="flex gap-4">
        <Column title="Todo" list={todo} />
        <Column title="In Progress" list={progress} />
        <Column title="Done" list={done} />
      </div>
    </div>
  );
}

export default ProjectDetails;
