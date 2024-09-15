import React from 'react';
import UserTable from './components/UserTable';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { People } from '@mui/icons-material';

const App: React.FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <People fontSize="large" sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management Table
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <UserTable />
      </Container>
    </>
  );
};

export default App;
