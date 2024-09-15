import React, { useEffect, useMemo, useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchUsers, setFilter, setSort } from '../features/users/usersSlice';
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  CircularProgress,
  Typography,
  Stack,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Search,
  Person,
  AccountCircle,
  Email,
  Phone,
} from '@mui/icons-material';

const UserTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const { filteredUsers, status, error, filters } = useAppSelector(
    (state) => state.users
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  // Memoize the column definitions to avoid unnecessary recalculations on render
  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      sortable: true,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
          <Person fontSize="small" sx={{ color: 'inherit', mr: 1 }} /> Name
        </Box>
      ),
      onHeaderClick: () => dispatch(setSort({ field: 'name' })),
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
      sortable: true,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
          <AccountCircle fontSize="small" sx={{ color: 'inherit', mr: 1 }} /> Username
        </Box>
      ),
      onHeaderClick: () => dispatch(setSort({ field: 'username' })), 
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1,
      sortable: true,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
          <Email fontSize="small" sx={{ color: 'inherit', mr: 1 }} /> Email
        </Box>
      ),
      onHeaderClick: () => dispatch(setSort({ field: 'email' })), 
    },
    {
      field: 'phone',
      headerName: 'Phone',
      flex: 1,
      sortable: true,
      renderHeader: () => (
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
          <Phone fontSize="small" sx={{ color: 'inherit', mr: 1 }} /> Phone
        </Box>
      ),
      onHeaderClick: () => dispatch(setSort({ field: 'phone' })), 
    },
  ], [dispatch]);

  // Handle filter changes
  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      dispatch(setFilter({ key: name, value }));
    },
    [dispatch]
  );

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === 'failed') {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
          {['name', 'username', 'email', 'phone'].map((key) => (
            <TextField
              key={key}
              label={`Search ${key}`}
              variant="outlined"
              name={key}
              value={filters[key as keyof typeof filters] ?? ''}
              onChange={handleFilterChange}
              size="small"
              sx={{ width: '24%' }} 
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          ))}
        </Stack>
      </Box>
      {filteredUsers.length === 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography>No users found matching the filters.</Typography>
        </Box>
      ) : (
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSizeOptions={[5, 10]}
          autoHeight
          disableColumnMenu
          getRowClassName={(params) =>
            params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
          }
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#0D47A1',  // Set header background color
              color: '#FFFFFF',             // Set header text color
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              color: '#FFFFFF',              // Set header title text color
              fontWeight: 'bold',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#0D47A1', 
              color: '#FFFFFF',              // Ensure all text in the header is white
            },
            '& .MuiSvgIcon-root': {
              color: '#FFFFFF',              // Ensure icons in the header are white
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: '#0D47A1',    // Footer background color
              color: '#FFFFFF',              // Footer text color
            },
            '& .MuiDataGrid-row.even': {
              backgroundColor: '#f9f9f9',    // Alternate row background color
            },
            '& .MuiDataGrid-cell': {
              color: '#212121',              // Cell text color
            },
            '& .MuiTablePagination-root': {
              color: '#FFFFFF',              // Pagination controls color
            },
          }}
        />
      )}
    </Paper>
  );
};

export default UserTable;
