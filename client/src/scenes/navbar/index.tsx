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
import { Box, Typography, useTheme, Button } from "@mui/material";
import FlexBetween from "@/components/FlexBetween";

type Props = {};

const Navbar = (props: Props) => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File Uploaded:", file.name);
      // Handle file upload logic here
    }
  };

  return (
    <FlexBetween mb="0.25rem" p="0.5rem 0rem" color={palette.grey[300]}>
      {/* LEFT SIDE */}
      <FlexBetween gap="0.75rem">
        <PixIcon sx={{ fontSize: "28px" }} />
        <Typography variant="h4" fontSize="22px" color= {palette.primary[100]}>
          FinMaster
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap="2rem">
      <Box
          sx={{
            "&:hover" : {color: palette.primary[100] },  // Lighter blue on hover
            color: selected === "dashboard" ? palette.primary : palette.primary[100],  // Whitish blue
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
            "&:hover" : {color: palette.primary[100] },  // Lighter blue on hover
            color: selected === "dashboard" ? palette.primary : palette.primary[100],  // Whitish blue
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
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </FlexBetween>
    </FlexBetween>
  );
};

export default Navbar;
