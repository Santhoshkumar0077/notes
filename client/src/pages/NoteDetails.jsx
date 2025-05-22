import {
	useGetNoteOneQuery,
	useUpdateNoteMutation,
} from "../redux/api/noteApi";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMeQuery } from "../redux/api/userApi";
import { toast } from "react-hot-toast";
import { setUsername } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";

export default function NoteDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, isError, error } = useGetNoteOneQuery(id);
	const [noteData, setNoteData] = useState({ title: "", description: "" });
	const dispatch = useDispatch();
	const { data: getUserData } = useMeQuery();

	useEffect(() => {
		if (getUserData) {
			dispatch(setUsername(getUserData.username));
		}
	}, [getUserData, dispatch]);

	const [
		update,
		{
			data: updatedDate,
			isLoading: updatedIsLoading,
			isError: updatedIsError,
			error: updatedError,
		},
	] = useUpdateNoteMutation();

	useEffect(() => {
		if (data) {
			setNoteData({
				title: data.note.title,
				description: data.note.description,
			});
		}
	}, [data]);

	if (isError) {
		toast(error?.data?.message, { icon: "😒" });
		return navigate("/");
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNoteData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUpdate = async () => {
		const res = await update({ noteId: id, ...noteData }).unwrap();
		toast.success(res.message);
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
				<button
					className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
					onClick={() => navigate("/")}
				>
					<FaArrowLeft />
					<span>Back</span>
				</button>
				<h2 className="text-2xl font-bold text-gray-800">Edit Note</h2>
				<div className="flex gap-3">
					<button
						className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg transition"
						onClick={(e) => {
							e.preventDefault();
							if (data) {
								setNoteData({
									title: data.note.title,
									description: data.note.description,
								});
								toast("Changes discarded", { icon: "↩️" });
							}
						}}
					>
						<FaTimes />
						<span>Cancel</span>
					</button>
					<button
						className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition disabled:opacity-50"
						disabled={updatedIsLoading}
						onClick={handleUpdate}
					>
						{updatedIsLoading ? (
							<span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
						) : (
							<>
								<FaSave />
								<span>Save</span>
							</>
						)}
					</button>
				</div>
			</div>

			<form className="space-y-6">
				<div>
					<label
						htmlFor="title"
						className="block text-gray-700 font-semibold mb-2"
					>
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={noteData.title}
						onChange={handleChange}
						placeholder="Enter note title"
						required
					/>
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-gray-700 font-semibold mb-2"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
						value={noteData.description}
						onChange={handleChange}
						rows={15}
						placeholder="Write your note here..."
					/>
				</div>

				{updatedIsError && (
					<div className="text-red-600 bg-red-100 p-3 rounded-lg">
						{updatedError?.data?.message || "Failed to update note."}
					</div>
				)}
			</form>

			{isLoading && (
				<div className="text-center mt-10">
					<div className="w-6 h-6 border-4 border-blue-400 border-dashed rounded-full animate-spin mx-auto"></div>
					<p className="text-gray-500 mt-2">Loading note...</p>
				</div>
			)}

			{isError && (
				<div className="text-yellow-700 bg-yellow-100 mt-6 p-3 rounded-lg">
					{error?.data?.message || "Could not fetch note details."}
				</div>
			)}
		</div>
	);
						
