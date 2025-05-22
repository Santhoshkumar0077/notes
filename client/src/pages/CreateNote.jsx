import { useCreateNoteMutation } from "../redux/api/noteApi";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "../redux/api/userApi";
import { setUsername } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { FiArrowLeft, FiPlusCircle } from "react-icons/fi";

export default function CreateNote() {
	const [create, { data, isLoading, isSuccess, isError, error }] =
		useCreateNoteMutation();
	const [noteDate, setNoteDate] = useState({ title: "", description: "" });
	const { data: getUserData } = useMeQuery();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setNoteDate((prev) => ({ ...prev, [name]: value }));
	};

	useEffect(() => {
		if (getUserData) {
			dispatch(setUsername(getUserData.username));
		}
	}, [getUserData, dispatch]);

	const handleCreate = async () => {
		try {
			const res = await create(noteDate).unwrap();
			toast.success(res.message);
			navigate("/");
		} catch (error) {
			toast.error(error.data?.message || "Server error");
			if (
				error.data?.message === "Unauthorized" ||
				error.data?.message === "Invalid token"
			) {
				return navigate("/login");
			}
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-6">
			<div className="flex items-center justify-between mb-6">
				<button
					onClick={() => navigate("/")}
					className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
				>
					<FiArrowLeft className="text-xl" />
					<span>Back</span>
				</button>
				<h2 className="text-2xl font-semibold text-gray-800">
					Create Note
				</h2>
				<button
					type="submit"
					disabled={isLoading}
					onClick={handleCreate}
					className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
				>
					{isLoading ? (
						<span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
					) : (
						<>
							<FiPlusCircle className="text-lg" />
							<span>Create</span>
						</>
					)}
				</button>
			</div>

			<form className="space-y-6">
				<div>
					<label
						htmlFor="title"
						className="block text-sm font-medium text-gray-700"
					>
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter a note title"
						value={noteDate.title}
						onChange={handleChange}
						required
					/>
				</div>

				<div>
					<label
						htmlFor="description"
						className="block text-sm font-medium text-gray-700"
					>
						Description
					</label>
					<textarea
						id="description"
						name="description"
						rows={18}
						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Write your note..."
						value={noteDate.description}
						onChange={handleChange}
					/>
				</div>

				{isError && (
					<p className="text-red-600 font-medium">
						{error?.data?.message || "An error occurred."}
					</p>
				)}
			</form>
		</div>
	);
	}
