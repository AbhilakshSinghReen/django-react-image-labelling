import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CloudUploadOutlined, SaveOutlined } from "@mui/icons-material";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttons: {
    "& > *": {
      marginLeft: 50,
    },
  },
  title: {
    flexGrow: 1,
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        {/* <IconButton edge="start" color="inherit" component={Link} to="/">
          <Typography variant="h6">Image Labelling App</Typography>
        </IconButton> */}
        <div className={classes.buttons}>
          <Button
            component={Link}
            to="/upload-new"
            color="inherit"
            startIcon={<CloudUploadOutlined />}
          >
            New
          </Button>
          <Button
            component={Link}
            to="/history"
            color="inherit"
            startIcon={<SaveOutlined />}
          >
            History
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
