import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User as FirebaseUser } from "firebase/auth";
import { Status, User } from "@/features/auth/types";

export type UserState = {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  status: Status | null;
};

const initialState: UserState = {
  user: null,
  firebaseUser: null,
  status: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateFirebaseUser(state, action: PayloadAction<FirebaseUser>) {
      state.firebaseUser = action.payload;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    updateStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
    reset(): UserState {
      return initialState;
    },
  },
});
