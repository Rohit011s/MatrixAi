import request from "./api";
//get all documents
export const getDocuments = () => request("/api/documents");
//delete document
export const deleteDocument = (id) =>
  request(`/api/documents/${id}`, {
    method: "DELETE",
  });
//upload document
export const uploadDocument = (formData) =>
  request("/api/upload", {
    method: "POST",
    body: formData,
  });
