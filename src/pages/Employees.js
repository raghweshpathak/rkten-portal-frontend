import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function Employees() {
  const token = localStorage.getItem("token");

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const [employees, setEmployees] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    salary: ""
  });

  const [editingId, setEditingId] = useState(null);

  // 🔍 search
  const [search, setSearch] = useState("");

  // 📄 pagination
  const [page, setPage] = useState(1);
  const perPage = 5;

  const fetchEmployees = async () => {
    const res = await axios.get(`${API}/employees`, authHeader);
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ADD
  const addEmployee = async () => {
    await axios.post(`${API}/employees`, form, authHeader);
    setForm({ name: "", email: "", role: "", salary: "" });
    fetchEmployees();
  };

  // UPDATE
  const updateEmployee = async () => {
    await axios.put(`${API}/employees/${editingId}`, form, authHeader);
    setEditingId(null);
    setForm({ name: "", email: "", role: "", salary: "" });
    fetchEmployees();
  };

  // DELETE
  const deleteEmployee = async (id) => {
    await axios.delete(`${API}/employees/${id}`, authHeader);
    fetchEmployees();
  };

  const startEdit = (e) => {
    setForm(e);
    setEditingId(e._id);
  };

  // 🔍 filter
  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 paginate
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Employees</h2>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6 grid grid-cols-4 gap-3">
        {["name", "email", "role", "salary"].map((field) => (
          <input
            key={field}
            className="border p-2 rounded"
            placeholder={field}
            value={form[field]}
            onChange={(e) =>
              setForm({ ...form, [field]: e.target.value })
            }
          />
        ))}

        <button
          onClick={editingId ? updateEmployee : addEmployee}
          className="bg-green-600 text-white px-4 py-2 rounded col-span-4"
        >
          {editingId ? "Update Employee" : "Add Employee"}
        </button>
      </div>

      {/* SEARCH */}
      <input
        className="border p-2 rounded mb-4 w-1/3"
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((e) => (
            <tr key={e._id} className="border-t">
              <td className="p-3">{e.name}</td>
              <td>{e.email}</td>
              <td>{e.role}</td>
              <td>₹{e.salary}</td>
              <td>
                <button
                  onClick={() => startEdit(e)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteEmployee(e._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Prev
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={start + perPage >= filtered.length}
          className="px-3 py-1 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Employees;
