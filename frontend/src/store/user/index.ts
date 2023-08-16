import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status, User } from "@/features/auth/types";

export type UserState = {
  user: User | null;
  uid: string | null;
  email: string | null;
  status: Status | null;
};

const initialState: UserState = {
  user: null,
  uid: null,
  email: null,
  status: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUid(state, action: PayloadAction<string | null>) {
      state.uid = action.payload;
    },
    updateUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    updateEmail(state, action: PayloadAction<string | null>) {
      state.email = action.payload;
    },
    updateStatus(state, action: PayloadAction<Status | null>) {
      state.status = action.payload;
    },
    reset(): UserState {
      return initialState;
    },
  },
});

export const { updateUid, updateUser, updateEmail, updateStatus, reset } =
  userSlice.actions;
