import Footer from "../Components/footer";
import Navbar from "../Components/navbar";
import styles from "./fixtures.module.css";

const GroupsTable = () => {
  const groups = [
    {
      name: "Group 1",
      teams: [
        {
          id: 1,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
        {
          id: 2,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
        {
          id: 3,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
        {
          id: 4,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
      ],
    },
    {
      name: "Group 2",
      teams: [
        {
          id: 1,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
        {
          id: 2,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
        {
          id: 3,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Godwin",
          ],
        },
        {
          id: 4,
          name: "The Pen College",
          representatives: [
            "Annette Black",
            "Kathryn Murphy",
            "Arlene McCoy",
            "Emeka Gordon",
          ],
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div style={{ backgroundColor: "#fafafa" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted small">By Groups</span>
                <button
                  className={`btn btn-outline-secondary btn-sm ${styles.filterButton}`}
                >
                  <i className="bi bi-funnel me-1"></i>
                  Filter
                </button>
              </div>

              {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="group-section mb-5">
                  <div className="group-title mb-3">
                    <h5 className="fw-bold text-dark">{group.name}</h5>
                  </div>

                  <div className={`${styles.tableWrapper}`}>
                    <div className="table-responsive">
                      <table
                        className={`table table-borderless ${styles.groupsTable}`}
                      >
                        <thead>
                          <tr className="border-bottom">
                            <th
                              scope="col"
                              className={`text-muted small fw-normal ps-3 ${styles.tableHeader}`}
                              style={{ width: "5%" }}
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className={`text-muted small fw-normal ${styles.tableHeader}`}
                              style={{ width: "40%" }}
                            >
                              Name
                            </th>
                            <th
                              scope="col"
                              className={`text-muted small fw-normal ${styles.tableHeader}`}
                              style={{ width: "25%" }}
                            >
                              Representative
                            </th>
                            <th
                              scope="col"
                              className={`text-muted small fw-normal ${styles.tableHeader}`}
                              style={{ width: "15%" }}
                            >
                              Score
                            </th>
                            <th
                              scope="col"
                              className={`text-muted small fw-normal ${styles.tableHeader}`}
                              style={{ width: "15%" }}
                            >
                              Overall
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.teams.map((team, teamIndex) => (
                            <tr key={teamIndex} className={styles.teamRow}>
                              <td className={`ps-3 py-3 ${styles.tableCell}`}>
                                <span className="text-dark fw-medium">
                                  {team.id}
                                </span>
                              </td>
                              <td className={`py-3 ${styles.tableCell}`}>
                                <span className="text-dark fw-medium">
                                  {team.name}
                                </span>
                              </td>
                              <td className={`py-3 ${styles.tableCell}`}>
                                <div className={styles.representatives}>
                                  {team.representatives.map((rep, repIndex) => (
                                    <div
                                      key={repIndex}
                                      className={`text-muted small mb-1 ${styles.repName}`}
                                    >
                                      {rep}
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className={`py-3 ${styles.tableCell}`}>
                                <span className="text-muted">-</span>
                              </td>
                              <td className={`py-3 ${styles.tableCell}`}>
                                <span className="text-muted">-</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GroupsTable;
