import React, { useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { AddBook } from "../../services/Books";

const AddBookCard = ({ show, onClose, onSave, refetch }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    author: "",
    releaseDate: "",
    publisher: "",
    pageCount: "",
    description: "",
    notes: "",
  });

  const [errorMessages, setErrorMessages] = useState([]);

  if (!show) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "releaseDate" ? value : value,
    }));
    setErrorMessages([]);
  };

  const validateForm = () => {
    const newErrorMessages = [];
    if (!formData.title) newErrorMessages.push("Title is required.");
    if (!formData.author) newErrorMessages.push("Author is required.");
    if (
      !formData.releaseDate ||
      !moment(formData.releaseDate, "YYYY-MM-DD", true).isValid()
    ) {
      newErrorMessages.push("Release Date is required.");
    }
    if (!formData.publisher) newErrorMessages.push("Publisher is required.");
    if (!formData.pageCount) newErrorMessages.push("Page Count is required.");
    if (!formData.description)
      newErrorMessages.push("Description is required.");
    return newErrorMessages;
  };

  const handleSave = async () => {
    const newErrorMessages = validateForm();
    if (newErrorMessages.length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    const submissionData = {
      ...formData,
      releaseDate: formData.releaseDate || null,
      isbn: formData.isbn || null,
      notes: formData.notes || null,
    };

    try {
      await AddBook(submissionData);
      onSave(formData);
      refetch();
    } catch (error) {
      console.error("Error adding book:", error);
      setErrorMessages(["Failed to add book. Please try again."]);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add New Book</h2>
        {errorMessages.length > 0 && (
          <div className="error-messages">
            {errorMessages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
        )}
        <form className="edit-book-form">
          <label>
            <span className="required-icon">*</span>Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            ISBN:
            <input
              type="number"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="required-icon">*</span>Author:
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="required-icon">*</span>Release Date:
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="required-icon">*</span>Publisher:
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="required-icon">*</span>Page Count:
            <input
              type="number"
              name="pageCount"
              value={formData.pageCount}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            <span className="required-icon">*</span>Description:
            <textarea
              className="custom-textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Notes:
            <textarea
              className="custom-textarea"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </label>
        </form>
        <div className="modal-actions">
          <i
            className="fas fa-check-circle update-icon"
            onClick={handleSave}
          ></i>
          <i className="fas fa-times-circle cancel-icon" onClick={onClose}></i>
        </div>
      </div>
    </div>
  );
};

AddBookCard.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};

export default AddBookCard;
