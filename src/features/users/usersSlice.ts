import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
}

interface UsersState {
  users: User[];
  filteredUsers: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  filters: {
    name: string;
    username: string;
    email: string;
    phone: string;
  };
  sort: {
    field: keyof User | null;
    direction: 'asc' | 'desc' | null;
  };
}

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  status: 'idle',
  error: null,
  filters: {
    name: '',
    username: '',
    email: '',
    phone: '',
  },
  sort: {
    field: null,
    direction: null 
  },
};

// Async thunk to fetch users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
  return response.data;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<{ key: string; value: string }>) {
      const { key, value } = action.payload;
      state.filters[key as keyof UsersState['filters']] = value;

      // Update filtered users using current filters and sorting
      state.filteredUsers = state.users
        .filter((user) =>
          Object.keys(state.filters).every((filterKey) => {
            const filterValue = state.filters[filterKey as keyof typeof state.filters];
            if (!filterValue) return true;
            return user[filterKey as keyof User]?.toString().toLowerCase().includes(filterValue.toLowerCase());
          })
        )
        .sort((a, b) => {
          // Apply sorting if a field and direction are set
          if (state.sort.field) {
            const field = state.sort.field;
            const direction = state.sort.direction === 'asc' ? 1 : -1;
            if (a[field]! > b[field]!) return direction;
            if (a[field]! < b[field]!) return -direction;
          }
          return 0; 
        });
    },
    setSort(state, action: PayloadAction<{ field: keyof User }>) {
      const { field } = action.payload;

      // Toggle the sort direction or reset if the same field is clicked three times
      if (state.sort.field === field) {
        if (state.sort.direction === 'asc') {
          state.sort.direction = 'desc';
        } else if (state.sort.direction === 'desc') {
          state.sort.direction = null; 
          state.sort.field = null;     
        } else {
          state.sort.direction = 'asc'; 
        }
      } else {
        state.sort.field = field;
        state.sort.direction = 'asc'; 
      }

      // Apply the sorting logic
      state.filteredUsers = state.filteredUsers.sort((a, b) => {
        const direction = state.sort.direction === 'asc' ? 1 : -1;
        if (a[field]! > b[field]!) return direction;
        if (a[field]! < b[field]!) return -direction;
        return 0;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.status = 'succeeded';
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

// Memoized selector using createSelector to optimize filtering
export const selectFilteredUsers = createSelector(
  (state: UsersState) => state.users,
  (state: UsersState) => state.filters,
  (state: UsersState) => state.sort,
  (users, filters, sort) => {
    let filtered = users.filter((user) => {
      return Object.keys(filters).every((key) => {
        const filterValue = filters[key as keyof typeof filters];
        if (!filterValue) return true;
        return user[key as keyof User]?.toString().toLowerCase().includes(filterValue.toLowerCase());
      });
    });

    if (sort.field && sort.direction) {
      const direction = sort.direction === 'asc' ? 1 : -1;
      filtered = filtered.sort((a, b) => {
        // Check if the field exists and is comparable
        if (sort.field !== null && a[sort.field]! > b[sort.field]!) return direction;
        if (sort.field !== null && a[sort.field]! < b[sort.field]!) return -direction;
        return 0;
      });
    }

    return filtered;
  }
);

export const { setFilter, setSort } = usersSlice.actions;
export default usersSlice.reducer;
