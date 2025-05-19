import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const noteApi = createApi({
	reducerPath: "noteApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "/api/note",
		credentials: "include",
	}),
	tagTypes: ["notes"], //
	endpoints: (builder) => ({
		getNoteAll: builder.query({
			query: () => "/getAll",
			providesTags: ["notes"],
		}),
		getNoteOne: builder.query({
			query: (id) => `/getOne/${id}`,
			providesTags: ["notes"],
		}),
		createNote: builder.mutation({
			query: (data) => ({
				url: "/create",
				method: "POST",
				body: data,
			}),
			invalidatesTags: ["notes"],
		}),
		updateNote: builder.mutation({
			query: ({ noteId, ...body }) => ({
				url: `/update/${noteId}`,
				method: "PUT",
				body,
			}),
			invalidatesTags: ["notes"],
		}),
		deleteNote: builder.mutation({
			query: (noteId) => ({
				url: `/delete/${noteId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["notes"],
		}),
	}),
});

export const {
	useGetNoteAllQuery,
	useGetNoteOneQuery,
	useCreateNoteMutation,
	useUpdateNoteMutation,
	useDeleteNoteMutation,
} = noteApi;

export default noteApi;
