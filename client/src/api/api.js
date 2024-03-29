import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  sendOtpRequest,
  sendOtpSuccess,
  sendOtpFailure,
  loginUserSuccess,
  loginUserFailure,
  loadUserRequest,
  loadUserSuccess,
  loadUserFailure,
  logoutUserSuccess,
  loginUserRequest,
  addtoFavoritesRequest,
  addtoFavoritesSuccess,
  addtoFavoritesFaliure,
  removeFromFavoritesRequest,
  removeFromFavoritesSuccess,
  removeFromFavoritesFaliure,
} from "../userSlice";
export const mealApi = createApi({
  reducerPath: "mealApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.themealdb.com/api/json/v1/1/",
  }),
  endpoints: (builder) => ({
    fetchMeals: builder.query({
      query: (term) => {
        if (term.trim() === "") return [];
        return `search.php?s=${term}`;
      },

      transformResponse: (response) => (response.meals ? response.meals : []),
    }),

    fetchMealById: builder.query({
      query: (id) => `lookup.php?i=${id}`,
      transformResponse: (response) => {
        return response.meals ? response.meals[0] : {};
      },
    }),

    fetchMealByType: builder.query({
      query: (query) => `filter.php?${query.type}=${query.value}`,
      transformResponse: (response) => {
        return response.meals ? response.meals : [];
      },
    }),
  }),
});
export const {
  useFetchMealsQuery,
  useFetchMealByIdQuery,
  useFetchMealByTypeQuery,
} = mealApi;

const BASE_URL = "https://recipe-app-r5a2.vercel.app";

export const sendOtp = async (dispatch, email, name) => {
  try {
    dispatch(sendOtpRequest());
    const { data } = await axios.post(`${BASE_URL}/api/v1/sendotp`, {
      email,
      name,
    });
    dispatch(sendOtpSuccess(data.message));
  } catch (error) {
    console.log(error);
    dispatch(sendOtpFailure(error.response.data.message));
  }
};

export const login = async (dispatch, name, email, otp) => {
  try {
    dispatch(loginUserRequest());
    const { data } = await axios.post(
      `${BASE_URL}/api/v1/login`,
      {
        email,
        name,
        otp,
      },
      { withCredentials: true },
    );
    dispatch(loginUserSuccess({ user: data.user, message: data.message }));
  } catch (error) {
    console.log(error);
    dispatch(loginUserFailure());
  }
};
export const logoutUser = async (dispatch) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/api/v1/logout`, {
      withCredentials: true,
    });
    dispatch(logoutUserSuccess());
    return data.message;
  } catch (error) {
    console.log(error);
  }
};
export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());
    const { data } = await axios.get(`${BASE_URL}/api/v1/me`, {
      withCredentials: true,
    });
    dispatch(loadUserSuccess(data.user));
  } catch (error) {
    console.log(error);
    dispatch(loadUserFailure());
  }
};

export const addToFav = async (dispatch, meal) => {
  try {
    dispatch(addtoFavoritesRequest());
    const { data } = await axios.put(
      `${BASE_URL}/api/v1/addorremovefavorite`,
      {
        meal,
      },
      { withCredentials: true },
    );
    dispatch(addtoFavoritesSuccess(meal));
  } catch (error) {
    dispatch(addtoFavoritesFaliure(error.response.data.message));
  }
};

export const removeFromFav = async (dispatch, meal) => {
  try {
    dispatch(removeFromFavoritesRequest());
    const { data } = await axios.put(
      `${BASE_URL}/api/v1/addorremovefavorite`,
      {
        meal,
      },
      { withCredentials: true },
    );
    dispatch(removeFromFavoritesSuccess(meal));
  } catch (error) {
    dispatch(removeFromFavoritesFaliure(error.response.data.message));
  }
};
