import { Link } from "react-router-dom";

function Navbar({ role, onLogout }) {
  return (
    <div className="bg-black text-white px-8 py-4 flex justify-between">
      <h1 className="font-bold text-lg">
        RKTen {role === "admin" ? "Admin" : "Employee"}
     </h1>


      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Dashboard
        </Link>

        {/* admin only */}
        {role === "admin" && (
          <Link to="/employees" className="hover:underline">
            Employees
          </Link>
        )}

        <Link to="/projects" className="hover:underline">
          Projects
        </Link>

        <button
          onClick={onLogout}
          className="bg-red-500 px-3 py-1 rounded ml-4"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
