import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Crud() {
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // To store the index of the row being edited
  const [editMarks, setEditMarks] = useState(""); // To store the edited marks

  const handleCloseModal = () => {
    setShowModal(false);
    setEditIndex(null);
    setEditMarks("");
  };

  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const savedStudentMarks = JSON.parse(localStorage.getItem("studentMarks"));

  const [marks, setMarks] = useState("");
  const [studentMarks, setStudentMarks] = useState(savedStudentMarks);

  useEffect(() => {
    // Fetch students and subjects
    fetchStudents();
    fetchSubjects();

    // Load saved student marks from local storage
    // const savedStudentMarks = JSON.parse(localStorage.getItem("studentMarks"));
  }, []);

  useEffect(() => {
    // Save student marks to local storage whenever it changes
    localStorage.setItem("studentMarks", JSON.stringify(studentMarks));
    const storedStudents = JSON.parse(localStorage.getItem("studentMarks"));
    console.log(storedStudents);
  }, [studentMarks]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5075/api/Subject");
      setSubjects(response.data);
    } catch (error) {
      console.log("Error fetching subjects.", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5075/api/Student");
      setStudents(response.data);
    } catch (error) {
      console.log("Error fetching students", error);
    }
  };

  const handleSelectSubject = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleSelectStudent = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleMarks = (event) => {
    setMarks(event.target.value);
  };

  const handleAddButtonClick = () => {
    // Add new student marks to the list
    const newStudentMark = {
      student: selectedStudent,
      subject: selectedSubject,
      marks: marks,
    };
    setStudentMarks([...studentMarks, newStudentMark]);
  };

  const handleEditClick = (index) => {
    setEditIndex(index); // Set the index of the row being edited
    const { marks } = studentMarks[index];
    setEditMarks(marks); // Set the marks for editing
    setShowModal(true); // Show the modal
  };

  const handleDeleteClick = (index) => {
    // Delete the selected student mark from the list
    const updatedStudentMarks = [...studentMarks];
    updatedStudentMarks.splice(index, 1);
    setStudentMarks(updatedStudentMarks);
  };

  const handleModalSaveClick = () => {
    // Update the marks for the edited row
    const updatedStudentMarks = [...studentMarks];
    // updatedStudentMarks[editIndex].marks = editMarks;
    updatedStudentMarks[editIndex] = {
      student: selectedStudent,
      subject: selectedSubject,
      marks: editMarks,
    };
    setStudentMarks(updatedStudentMarks);
    handleCloseModal();
  };

  const handleSaveClick = async () => {
    try {
      // Iterate over the studentMarks array and send a POST request for each student mark
      await Promise.all(
        studentMarks.map(async (studentMark) => {
          // Find the ID of the student with the given name
          const studentId = students.find(
            (student) => student.name === studentMark.student
          )?.id;
          // Find the ID of the subject with the given name
          const subjectId = subjects.find(
            (subject) => subject.name === studentMark.subject
          )?.id;

          // Only send the POST request if both studentId and subjectId are found
          if (studentId && subjectId) {
            // Send a POST request to the API endpoint
            await axios.post("http://localhost:5075/api/StudentMarksDetails", {
              StudId: studentId,
              SubId: subjectId,
              Marks: studentMark.marks,
            });
          } else {
            console.error(
              `Error: Student ID or Subject ID not found for ${studentMark.student} - ${studentMark.subject}`
            );
          }
        })
      );
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            Stud_Crud
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Home
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="my-3">
        <div className="dropdown">
          <label className="form-label" htmlFor="studentDropdown">
            Select Student:
          </label>
          <select
            id="studentDropdown"
            className="form-select"
            onChange={handleSelectStudent}
            value={selectedStudent}
            style={{ width: "25%" }}
          >
            <option value="">Select</option>
            {students.map((student) => (
              <option key={student.id} value={student.name}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="container mt-5">
        <div className="row mb-3">
          <div className="col">
            <select
              id="subjectSelect"
              onChange={handleSelectSubject}
              style={{ width: "300px", height: "37px" }}
            >
              <option value={selectedSubject}>Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              id="marksInput"
              placeholder="Enter Marks"
              value={marks}
              onChange={handleMarks}
            />
          </div>
          <div className="col">
            <button
              type="button"
              className="btn btn-primary"
              id="addButton"
              onClick={handleAddButtonClick}
            >
              Add
            </button>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Subject</th>
              <th>Marks</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {studentMarks.map((studentMark, index) => (
              <tr key={index}>
                <td>{studentMark.student}</td>
                <td>{studentMark.subject}</td>
                <td>{studentMark.marks}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEditClick(index)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteClick(index)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          type="button"
          className="btn btn-success"
          id="saveButton"
          onClick={() => handleSaveClick()}
        >
          Save
        </button>
      </div>
      <div
        className={`modal fade ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        id="editModal"
        tabIndex="-1"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">
                Edit Marks
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="editStudentDropdown">Select Student:</label>
                <select
                  id="editStudentDropdown"
                  className="form-select"
                  onChange={handleSelectStudent}
                  value={selectedStudent}
                >
                  <option value="">Select</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.name}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editSubjectDropdown">Select Subject:</label>
                <select
                  id="editSubjectDropdown"
                  className="form-select"
                  onChange={handleSelectSubject}
                  value={selectedSubject}
                >
                  <option value="">Select</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="editMarksInput">Enter Marks:</label>
                <input
                  type="number"
                  className="form-control"
                  id="editMarksInput"
                  placeholder="Enter Marks"
                  value={editMarks}
                  onChange={(e) => setEditMarks(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalSaveClick}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
