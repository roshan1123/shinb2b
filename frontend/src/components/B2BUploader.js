import React, { useState, useEffect } from "react";
import api from "../services/api";
import { getToken } from "../services/auth";
import { get_lead_data } from "../services/b2b";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../services/auth";

const B2BUploader = () => {
  const [file, setFile] = useState(null);
  const [b2bLeads, setB2bLeads] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const token = getToken();
  


  //const API_BASE = "http://localhost:8000"; // Replace with your FastAPI server URL

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const data = await get_lead_data(token);
      setB2bLeads(data);
    } catch (err) {
      setError("Error fetching B2B leads.");
    }
   };

    useEffect(() => {
        fetchLeads();
    }, [token]);

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return setError("Please select a file first.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post("/upload-b2b", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(res.data.message);
      setError("");
      fetchLeads(); // Refresh table
    } catch (err) {
      setMessage("");
      setError(err.response?.data?.detail || "Upload failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>B2B File Upload</h3>

      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button className="btn btn-primary mb-3" onClick={handleUpload}>
        Upload
      </button>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <h4 className="mt-4">Registered B2B Leads</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Company Name</th>
              <th>Email</th>
              <th>Overview</th>
              <th>URL</th>
              <th>Product Details</th>
              <th>Target Industry</th>
              <th>Address</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {b2bLeads.length > 0 ? (
              b2bLeads.map((lead, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{lead.companyname}</td>
                  <td>{lead.leademail}</td>
                  <td>{lead.overview}</td>
                  <td>{lead.url}</td>
                  <td>{lead.product_details}</td>
                  <td>{lead.target_industry}</td>
                  <td>{lead.address}</td>
                  <td>{lead.contact_number}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No leads found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2BUploader;
