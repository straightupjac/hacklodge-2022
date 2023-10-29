import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import MuiNextLink from "@components/core-components/MuiNextLink";

const Navbar = ({ navLinks }) => {
  return (
    <Toolbar
      component="nav"
      sx={{
        display: { xs: `none`, md: `flex` },
      }}
    >
      <Stack direction="row" spacing={4}>
        {navLinks.map(({ title, path, target }, i) => (
          <MuiNextLink
            key={`${title}${i}`}
            href={path}
            variant="button"
            target={target}
            sx={{ fontSize: '20px', opacity: 0.7, color: 'black', textDecoration: 'none', textTransform: 'none' }}
          >
            {title}
          </MuiNextLink>
        ))}
      </Stack>
    </Toolbar>
  );
};

export default Navbar;
