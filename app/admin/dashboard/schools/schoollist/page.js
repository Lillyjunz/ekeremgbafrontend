"use client";

import AddSchoolModal from "@/app/Components/addschool";
import { useState } from "react";
import styles from "./schoollist.module.css";

const schoolsData = [
  {
    name: "The Pen College",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    phone: "(480) 555–0103",
    dateAdded: "10/6/13",
    representatives: [
      "Annette Black",
      "Annette Black",
      "Annette Black",
      "Annette Black",
    ],
  },
  {
    name: "The Pen College",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    phone: "(480) 555–0103",
    dateAdded: "10/6/13",
    representatives: [
      "Kathryn Murphy",
      "Arlene McCoy",
      "Kathryn Murphy",
      "Annette Black",
    ],
  },
  {
    name: "The Pen College",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    phone: "(480) 555–0103",
    dateAdded: "10/6/13",
    representatives: [
      "Kathryn Murphy",
      "Arlene McCoy",
      "Kathryn Murphy",
      "Annette Black",
    ],
  },
  {
    name: "The Pen College",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    phone: "(480) 555–0103",
    dateAdded: "10/6/13",
    representatives: [
      "Cameron Williamson",
      "Cameron Williamson",
      "Cameron Williamson",
      "Cameron Williamson",
    ],
  },
];

export default function SchoolsTable() {
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Schools</h4>
        <button onClick={() => setShowModal(true)} className={styles.createBtn}>
          Add Schools
        </button>
      </div>

      <div className="table-responsive bg-white rounded-4 p-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Phone number</th>
              <th>Representative</th>
              <th>Date added</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {schoolsData.map((school, index) => (
              <tr key={index}>
                <td>{school.name}</td>
                <td>{school.address}</td>
                <td>{school.phone}</td>
                <td>
                  {school.representatives.map((rep, i) => (
                    <div key={i}>{rep}</div>
                  ))}
                </td>
                <td>{school.dateAdded}</td>
                <td className="position-relative">
                  <button
                    className="btn btn-light rounded-circle"
                    onClick={() =>
                      setDropdownIndex(dropdownIndex === index ? null : index)
                    }
                  >
                    &#x22EE;
                  </button>
                  {dropdownIndex === index && (
                    <div
                      className="position-absolute bg-white border rounded shadow-sm p-2 mt-2"
                      style={{ right: 0, zIndex: 10 }}
                    >
                      <button className="btn btn-sm w-100 text-start mb-1">
                        Edit School
                      </button>
                      <button className="btn btn-sm text-danger w-100 text-start">
                        Delete school
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-between align-items-center px-2 pt-2">
          <span>10 Entries</span>
          <span>Showing 1 to 10 of 95 entries.</span>
          <div className="pagination">
            <button className="btn btn-light">&lt;</button>
            {[1, 2, 3, "...", 5].map((pg, i) => (
              <button
                key={i}
                className={`btn btn-light ${
                  pg === 2 ? "active bg-danger text-white" : ""
                }`}
              >
                {pg}
              </button>
            ))}
            <button className="btn btn-light">&gt;</button>
          </div>
        </div>
      </div>
      {/* Right Slide Modal */}
      <AddSchoolModal show={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
