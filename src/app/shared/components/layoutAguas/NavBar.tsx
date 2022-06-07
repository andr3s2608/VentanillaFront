import { NavLink } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <NavLink className="nav-link" to="/Bandeja">
                Bandeja de entrada
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Gestion">
                Administración
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Auditoria">
                Auditoría
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Respuesta">
                Reportes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/Servicios">
                trámites y Servicios
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
