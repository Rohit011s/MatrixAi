import toast from "react-hot-toast";

export default function handleError(err) {
  console.error(err);

  if (err.status === 401) {
    toast.error("Please sign in");
    return;
  }

  if (err.status === 403) {
    toast.error("Access denied");
    return;
  }

  if (err.status === 404) {
    toast.error("Resource not found");
    return;
  }

  toast.error(err.message || "Something went wrong");
}