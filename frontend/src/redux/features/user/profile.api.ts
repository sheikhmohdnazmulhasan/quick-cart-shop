import { TApiResponse } from "../../../interfaces/api_response.types";
import { baseApi } from "../../api/base_api";

const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query({
      query: (args: Record<string, string>) => {
        const params = new URLSearchParams();

        Object.entries(args).forEach(([key, value]) => {
          params.append(key, value);
        });

        return {
          url: "/users/me",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TApiResponse) => {
        if (!response || !response.data) {
          throw new Error("Invalid response structure");
        }
        return response.data;
      },
      providesTags: ["profile"],
    }),

    // fetch all vendors (admin)
    getAllVendors: builder.query({
      query: (args: Record<string, unknown>) => {
        const params = new URLSearchParams();

        Object.entries(args).forEach(([key, value]) => {
          params.append(key, String(value));
        });

        return {
          url: "/users/vendors",
          method: "GET",
          params,
        };
      },
      transformResponse: (response: TApiResponse) => {
        if (!response || !response.data) {
          throw new Error("Invalid response structure");
        }
        return response.data;
      },
      providesTags: ["users"],
    }),
  }),
});

export const { useGetMyProfileQuery, useGetAllVendorsQuery } = profileApi;
