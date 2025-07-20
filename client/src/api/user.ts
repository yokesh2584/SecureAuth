import axiosPrivate from "../utils/axios";
import { type User } from "../stores/authStore";

export const fetchUsersData = async (): Promise<User[]> => {
  try {
    const response = await axiosPrivate.get("/users/get-users");

    return response.data.refinedUsers || [];
  } catch (error: any) {
    console.error(
      "Error fetching users:",
      error?.response?.data || error.message
    );
    return [];
  }
};
