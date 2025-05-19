import { useCreateNoteMutation } from "../redux/api/noteApi";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMeQuery } from "../redux/api/userApi";
import { setUsername } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
export default function CreateNote() {
	const [create, { data, isLoading, isSuccess, isError, error }] =
		useCreateNoteMutation();
	const [noteDate, setNoteDate] = useState({ title: "", description: "" });
	const { data: getUserData, isLoading: getUserLoading } = useMeQuery();
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
			toast.error(error.data?.message || "server error");
			if (
				error.data?.message === "Unauthorized" ||
				error.data?.message === "Invalid token"
			) {
				return navigate("/login");
			} else {
				toast.error(error.data?.message);
			}
		}
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
				<h2 className="h4 text-primary mb-0">Create Note</h2>
				<div className="d-flex justify-content-end">
					<button
						type="submit"
						className="btn btn-success"
						disabled={isLoading}
					>
						{isLoading ? (
							<span
								className="spinner-border spinner-border-sm"
								role="status"
							/>
						) : (
							"Create"
						)}
					</button>
				</div>
				<div /> {/* spacer to balance layout */}
			</div>

			<form
				className="w-100"
				onSubmit={(e) => {
					e.preventDefault();
					handleCreate();
				}}
			>
				<div className="mb-3">
					<label htmlFor="title" className="form-label">
						Title
					</label>
					<input
						id="title"
						name="title"
						type="text"
						className="form-control"
						placeholder="Enter a note title"
						value={noteDate.title}
						onChange={handleChange}
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
						value={noteDate.description}
						onChange={handleChange}
						rows={18}
						placeholder="Write your note..."
					/>
				</div>

				{isError && (
					<div className="alert alert-danger mt-3">
						{error?.data?.message || "An error occurred."}
					</div>
				)}
			</form>
		</div>
	);
}
