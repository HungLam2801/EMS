import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import {
  LuCalendarDays,
  LuExternalLink,
  LuMapPin,
  LuPlus,
  LuSearch,
  LuTrash2,
} from "react-icons/lu";
import { projects } from "../../Data/Data";
import "./ProjectManagement.scss";

export default function ProjectManagement() {
  const lang = useIntl();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return projects.filter((project) =>
      [project.name, project.id, project.address, project.location]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [searchTerm]);

  return (
    <section className="DAT_ProjectManagement">
      <div className="header">
        <div className="header-info">
          <h1>{lang.formatMessage({ id: "project_list_title" })}</h1>
          <p>{lang.formatMessage({ id: "project_list_description" })}</p>
        </div>

        <div className="header-actions">
          <label className="search-box">
            <LuSearch />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={lang.formatMessage({
                id: "project_search_placeholder",
              })}
            />
          </label>

          <button type="button" className="btn-create">
            <LuPlus />
            <span>{lang.formatMessage({ id: "project_create" })}</span>
          </button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{lang.formatMessage({ id: "project_name" })}</th>
              <th>{lang.formatMessage({ id: "project_address" })}</th>
              <th>{lang.formatMessage({ id: "project_created_at" })}</th>
              <th>{lang.formatMessage({ id: "project_status" })}</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="project-name">
                    <strong>{project.name}</strong>
                  </div>
                </td>

                <td>
                  <div className="cell-icon">
                    <LuMapPin />
                    <span>{project.address}</span>
                  </div>
                </td>

                <td>
                  <div className="cell-icon">
                    <LuCalendarDays />
                    <span>{project.createdAt}</span>
                  </div>
                </td>

                <td>
                  <span
                    className={`status-badge ${
                      project.status === "Đang vận hành" ? "success" : "danger"
                    }`}
                  >
                    {project.status}
                  </span>
                </td>

                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      className="btn-open"
                      title={lang.formatMessage({ id: "project_open" })}
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      <LuExternalLink />
                    </button>
                    <button
                      type="button"
                      className="btn-delete"
                      title={lang.formatMessage({ id: "project_delete" })}
                    >
                      <LuTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProjects.length === 0 && (
          <div className="empty-state">
            {lang.formatMessage({ id: "project_empty" })}
          </div>
        )}
      </div>
    </section>
  );
}