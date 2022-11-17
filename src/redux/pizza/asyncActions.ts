import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Pizza } from "./types";

export const fetchPizzas = createAsyncThunk<Pizza[], Record<string, string>>(
    'pizza/fetchPizzasStatus',
    async (params /*, thunkApi*/) => {
      const { currentPage, category, sortBy, order, search } = params;
      const { data } = await axios.get<Pizza[]>(
        `https://635b6dd46f97ae73a6438cab.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
      );
  
      // if (data.length === 0) {
      //   return thunkApi.rejectWithValue('Пустые данные');
      // }
  
      // return thunkApi.fulfillWithValue(data);
      console.log('data = ' + data);
      return data;
    },
  );
  