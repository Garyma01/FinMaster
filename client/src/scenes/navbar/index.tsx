// import { useState } from "react";
// import { Link } from "react-router-dom";
// import PixIcon from "@mui/icons-material/Pix";
// import { Box, Typography, useTheme } from "@mui/material";
// import FlexBetween from "@/components/FlexBetween";

// type Props = {};

// const Navbar = (props: Props) => {
//   const { palette } = useTheme();
//   const [selected, setSelected] = useState("dashboard");
//   return (
//     <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
//       {/* LEFT SIDE */}
//       <FlexBetween gap="0.75rem">
//         <PixIcon sx={{ fontSize: "28px" }} />
//         <Typography variant="h4" fontSize="16px">
//           FinMaster
//         </Typography>
//       </FlexBetween>

//       {/* RIGHT SIDE */}
//       <FlexBetween gap="2rem">
//         <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
//           <Link
//             to="/"
//             onClick={() => setSelected("dashboard")}
//             style={{
//               color: selected === "dashboard" ? "inherit" : palette.grey[700],
//               textDecoration: "inherit",
//             }}
//           >
//             dashboard
//           </Link>
//         </Box>
//         <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
//           <Link
//             to="/predictions"
//             onClick={() => setSelected("predictions")}
//             style={{
//               color: selected === "predictions" ? "inherit" : palette.grey[700],
//               textDecoration: "inherit",
//             }}
//           >
//             predictions
//           </Link>
//         </Box>
//       </FlexBetween>
//     </FlexBetween>
//   );
// };

// export default Navbar;

import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import PixIcon from "@mui/icons-material/Pix";
import { Box, Typography, useTheme, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import FlexBetween from "@/components/FlexBetween";

const Navbar = () => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // Open file dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection and upload
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File Uploaded:", file.name);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:9000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadMessage(response.data.message || "File uploaded successfully!");
      setIsError(false);
    } catch (error) {
      console.error("Upload Error:", error);
      setUploadMessage("Failed to upload CSV file.");
      setIsError(true);
    }
  };

  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <PixIcon sx={{ fontSize: "28px" }} />
        <Typography variant="h4" fontSize="22px" color={palette.primary[100]}>
          FinMaster
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
        <Box
          sx={{
            "&:hover": { color: palette.primary[100] },
            color: selected === "dashboard" ? palette.primary : palette.primary[100],
          }}
        >
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: "inherit",
              textDecoration: "inherit",
              fontSize: "20px",
            }}
          >
            Dashboard
          </Link>
        </Box>

        <Box
          sx={{
            "&:hover": { color: palette.primary[100] },
            color: selected === "dashboard" ? palette.primary : palette.primary[100],
          }}
        >
          <Link
            to="/"
            onClick={() => setSelected("dashboard")}
            style={{
              color: "inherit",
              textDecoration: "inherit",
              fontSize: "20px",
            }}
          >
            Predictions
          </Link>
        </Box>

        {/* File Upload Button */}
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Upload CSV File
        </Button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* Success/Error Notification */}
        <Snackbar
          open={!!uploadMessage}
          autoHideDuration={4000}
          onClose={() => setUploadMessage(null)}
        >
          <Alert severity={isError ? "error" : "success"}>{uploadMessage}</Alert>
        </Snackbar>
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
