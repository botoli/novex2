import { useEffect, useState } from "react";
import dataStore from "../../Store/Data";
import styles from "./AddEmployeesModal.module.scss";
import { CloseIcon } from "../../UI/Icons";
import { observer } from "mobx-react-lite";
import { AssignedStore } from "../../Store/Assigned.Users";

const AddEmployeesModal = observer(() => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<"name" | "role">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const pageSize = 6;
  useEffect(() => {
    console.log(AssignedStore.assignedUsersTask);
  }, [AssignedStore.assignedUsersTask]);
  // basic search+filter
  const searched = dataStore.users.filter((u: any) => {
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.role ?? "").toLowerCase().includes(q) ||
      (u.project?.role ?? "").toLowerCase().includes(q)
    );
  });

  const roleOptions = Array.from(
    new Set(
      dataStore.users
        .map((u: any) => u.project?.role ?? u.role ?? "")
        .filter(Boolean),
    ),
  );

  const filtered = searched.filter((u: any) => {
    if (
      roleFilter !== "All" &&
      (u.project?.role ?? u.role ?? "") !== roleFilter
    )
      return false;
    const uid = u.id ?? u.userid;

    return true;
  });

  // sort
  const sorted = [...filtered].sort((a: any, b: any) => {
    const aVal =
      sortBy === "name" ? (a.name ?? "") : (a.project?.role ?? a.role ?? "");
    const bVal =
      sortBy === "name" ? (b.name ?? "") : (b.project?.role ?? b.role ?? "");
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  // reset page if search narrows results
  if (page > totalPages) setPage(1);
  const pageStart = (page - 1) * pageSize;
  const pageItems = sorted.slice(pageStart, pageStart + pageSize);

  return (
    <div className={styles.blur}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Добавление сотрудников</h2>
          <div className={styles.closeButton}>
            <CloseIcon />
          </div>
        </div>
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Поиск"
            className={styles.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className={styles.actions}>
            <label className={styles.selectLabel}>
              Сортировать
              <select
                className={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "name" | "role")}
              >
                <option value="name">По имени</option>
                <option value="role">По должности</option>
              </select>
            </label>

            <label className={styles.selectLabel}>
              Направление
              <select
                className={styles.select}
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
              >
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
            </label>

            <label className={styles.selectLabel}>
              Фильтр
              <select
                className={styles.select}
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="All">Все</option>
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className={styles.list}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Имя</th>
                <th>Должность</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((u: any) => {
                return (
                  <tr
                    key={u.id}
                    className={
                      AssignedStore.assignedUsersTask.includes(u.id)
                        ? styles.activeTableRow
                        : styles.tableRow
                    }
                    onClick={() => {
                      AssignedStore.assignedUsersTask.includes(u.id)
                        ? AssignedStore.unassignTask(u.id)
                        : AssignedStore.assignTask(u.id);
                    }}
                  >
                    <td className={styles.avatarCell}>
                      <div className={styles.avatarCircle}>
                        {u.name ? u.name.charAt(0).toUpperCase() : ""}
                      </div>
                    </td>
                    <td className={styles.nameCell}>{u.name}</td>
                    <td className={styles.roleCell}>
                      {u.project?.role ?? u.role}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* Pagination controls */}
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>

          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                className={`${styles.pageBtn} ${page === n ? styles.activePage : ""}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <button
            className={styles.pageBtn}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
});

export default AddEmployeesModal;
