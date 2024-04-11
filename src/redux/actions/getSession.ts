import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../Config/axios';

export const getSession = createAsyncThunk(
  'getSession',
  async (id: string | undefined) => {
    try {
      const response = await axiosInstance.get(`/user/session/${id}`);
      console.log('session: ', response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);
