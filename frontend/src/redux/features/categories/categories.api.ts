import { TApiResponse } from "../../../interfaces/api_response.types";
import { baseApi } from "../../api/base_api";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // retrieve all categories
    getCategories: builder.query({
      query: () => ({
        url: "/category",
        method: "GET",
      }),

      transformResponse: (response: TApiResponse) => response.data,
      providesTags: ["categories"],
    }),

    // create new category
    createNewCategory: builder.mutation({
      query: (args: { name: string }) => ({
        url: "/category",
        method: "POST",
        body: args,
      }),
      invalidatesTags: ["categories"],
    }),
  }),
});

export const { useGetCategoriesQuery, useCreateNewCategoryMutation } =
  categoryApi;
