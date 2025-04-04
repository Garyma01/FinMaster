import { Box, useMediaQuery } from "@mui/material";
import Row1 from "./Row1";
import Row2 from "./Row2";
const gridTemplateLargeScreens = `
    "g g h h"
    "g g h h"
    "g g h h"
    "g g h h"
    "g g h h"
    "g g h h"
    "i i j j"
    "i i j j"
    "i i j j"
    "i i j j"
    "i i j j"
    "i i j j"
`;
const gridTemplateSmallScreens = `
  "g"
  "g"
  "g"
  "g"
  "g"
  "h"
  "h"
"h"
"h"
"h"
"i"
"i"
"i"
"i"
"j"
"j"
"j"
"j"`;

const Products = () => {
  const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");
  return (
    <Box
      width="100%"
      height="100%"
      display="grid"
      gap="1.5rem"
      sx={
        isAboveMediumScreens
          ? {
              gridTemplateColumns: "repeat(4, minmax(270px, 1fr))",
              gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
              gridTemplateAreas: gridTemplateLargeScreens,
            }
          : {
              gridAutoColumns: "1fr",
              gridAutoRows: "80px",
              gridTemplateAreas: gridTemplateSmallScreens,
            }
      }
    >
      <Row1 />
      <Row2/>
    </Box>
  );
};

export default Products;
