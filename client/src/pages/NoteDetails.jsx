import {
	useGetNoteOneQuery,
	useUpdateNoteMutation,
} from "../redux/api/noteApi";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMeQuery } from "../redux/api/userApi"
import { toast } from "react-hot-toast";
import { setUsername } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
export default function NoteDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isLoading, isError, error } = useGetNoteOneQuery(id);
	const [noteData, setNoteData] = useState({ title: "", description: "" });
	const dispatch = useDispatch();
	const { data: getUserData, isLoading: getUserLoading } = useMeQuery();

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
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<button
					className="btn btn-link p-0"
					onClick={() => navigate("/")}
				>
					← Back
				</button>
				<h2 className="h4 text-secondary mb-0">Edit Note</h2>
				<div className="d-flex justify-content-end">
					<button
						className="btn btn-secondary me-3"
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
						Cancel
					</button>
					<button
						className="btn btn-primary"
						disabled={updatedIsLoading}
						onClick={handleUpdate}
					>
						{updatedIsLoading ? (
							<span
								className="spinner-border spinner-border-sm"
								role="status"
							/>
						) : (
							"Save Changes"
						)}
					</button>
				</div>
				<div />
			</div>

			<form className="w-100">
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						className="form-control"
						value={noteData.title}
						onChange={handleChange}
						placeholder="Enter note title"
						required
					/>
				</div>

				<div className="mb-3">
					<label htmlFor="description" className="form-label">
						Description
					</label>
					<textarea
						id="description"
						name="description"
						className="form-control py-2"
						value={noteData.description}
						onChange={handleChange}
						rows={18}
						placeholder="Write your note here..."
					/>
				</div>

				{updatedIsError && (
					<div className="alert alert-danger mt-3">
						{updatedError?.data?.message ||
							"Failed to update note."}
					</div>
				)}
			</form>

			{isLoading && (
				<div className="text-center mt-5">
					<div
						className="spinner-border text-secondary"
						role="status"
					>
						<span className="visually-hidden">Loading...</span>
					</div>
				</div>
			)}
			{isError && (
				<div className="alert alert-warning mt-4">
					{error?.data?.message || "Could not fetch note details."}
				</div>
			)}
		</div>
	);
}
