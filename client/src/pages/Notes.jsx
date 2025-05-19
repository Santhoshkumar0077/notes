import { useSelector } from "react-redux";
import {
	useGetNoteAllQuery,
	useDeleteNoteMutation,
} from "../redux/api/noteApi";
import { useLogoutMutation } from "../redux/api/userApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useMeQuery } from "../redux/api/userApi";
import { setUsername } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";

export default function Notes() {
	const username = useSelector((state) => state.user.username);
	const {
		data: fetchedNotes,
		isLoading,
		isSuccess: fetchedNotesStatus,
	} = useGetNoteAllQuery();
	const [deleteNote, { data, isSuccess, isError, error }] =
		useDeleteNoteMutation();
	const [logout] = useLogoutMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data: getUserData, isLoading: getUserLoading } = useMeQuery();

	useEffect(() => {
		if (getUserData) {
			dispatch(setUsername(getUserData.username));
		}
	}, [getUserData, dispatch]);
	const handleNoteClick = async (note) => {
		navigate(`/notedetails/${note._id}`);
	};
	const handleNoteClickDelete = async (note) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this note?",
		);
		if (!confirmDelete) return;

		try {
			const res = await deleteNote(note._id).unwrap();
			toast.success(res.message);
		} catch (err) {
			console.error("Delete failed:", err);
			alert("Failed to delete note.");
		}
	};
	const handelLogout = async () => {
		try {
			const res = await logout().unwrap();
			toast.success(res.message);
			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (error) {
			console.log(error.data?.message);
		}
	};
	return (
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h2 className="text-primary">My Notes</h2>
				<button
					className="btn btn-success"
					onClick={() => navigate("/create")}
				>
					Create New +
				</button>
				<button className="btn btn-danger" onClick={handelLogout}>
					Logout
				</button>
			</div>

			{getUserLoading ? (
				<div className="spinner-border text-secondary" role="status">
					<span className="visually-hidden">Loading user...</span>
				</div>
			) : (
				<div className="alert alert-info">
					Welcome, <strong>{username}</strong>
				</div>
			)}

			{isLoading && (
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			)}
			{isError && (
				<div className="alert alert-danger">{error.data?.message}</div>
			)}

			{fetchedNotesStatus && fetchedNotes?.notes?.length > 0 ? (
				<div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
					{fetchedNotes.notes.map((note, index) => (
						<div key={note._id} className="col">
							<div
								className="card h-100 shadow-sm"
								onClick={() => handleNoteClick(note)}
								style={{ cursor: "pointer" }}
							>
								<div className="card-body">
									<h5 className="card-title">{note.title}</h5>
									<p className="card-text">
										{note.description.length > 30
											? note.description.slice(0, 30) +
												"..."
											: note.description}
									</p>
								</div>
								<div className="card-footer bg-white border-top-0">
									<button
										className="btn btn-outline-danger btn-sm"
										onClick={(e) => {
											e.stopPropagation(); // prevent card click
											handleNoteClickDelete(note);
										}}
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			) : (
				<div className="alert alert-warning mt-4">
					Notes are not created yet.
				</div>
			)}
		</div>
	);
}
