import { IProduct } from "../../../interfaces/api.products.res.type";
import { TApiResponse } from "../../../interfaces/api_response.types";
import { baseApi } from "../../api/base_api";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // create new product
    createNewProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["products"],
    }),

    // update product
    updateProduct: builder.mutation({
      query: (args: { data: Partial<IProduct>; id: string }) => ({
        url: `/products/${args.id}`,
        method: "PATCH",
        body: args.data,
      }),
      invalidatesTags: ["products"],
    }),

    // fetch all product
    getAllProducts: builder.query({
      query: (args: Record<string, unknown>) => {
        const params = new URLSearchParams();

        Object.entries(args).forEach(([key, value]) => {
          params.append(key, String(value));
        });

        return {
          url: "/products",
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
      providesTags: ["products"],
    }),

    // fetch single product
    getSingleProduct: builder.query({
      query: (args: { id: string }) => ({
        url: `/products/${args.id}`,
        method: "GET",
      }),
      transformErrorResponse: (response: TApiResponse) => {
        if (!response || !response.data) {
          throw new Error("Invalid response structure");
        }
        return response.data;
      },
    }),

    // delete product
    deleteProduct: builder.mutation({
      query: (args: { id: string }) => ({
        url: `/products/${args.id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useCreateNewProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
