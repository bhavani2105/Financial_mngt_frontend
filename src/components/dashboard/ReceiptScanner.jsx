import React, { useState } from "react";
import axios from "axios";

const ReceiptScanner = () => {
  const [file, setFile] = useState(null);

  const uploadReceipt = async () => {
    const formData = new FormData();
    formData.append("receipt", file);

    // await axios.post("/api/receipt/scan", formData);

// await axios.post("http://localhost:5000/api/receipt/scan", formData);

await axios.post(
  "http://localhost:5000/api/receipt/scan",
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

    alert("Receipt scanned and transaction added!");
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-semibold mb-3">Scan Receipt</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={uploadReceipt}
      >
        Scan Receipt
      </button>
    </div>
  );
};

export default ReceiptScanner;