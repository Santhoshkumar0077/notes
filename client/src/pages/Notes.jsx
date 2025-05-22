import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { FiLogOut } from "react-icons/fi";
import { AiOutlinePlus } from "react-icons/ai";
import {
	useGetNoteAllQuery,
	useDeleteNoteMutation,
} from "../redux/api/noteApi";
import { useLogoutMutation, useMeQuery } from "../redux/api/userApi";
import { setUsername } from "../redux/slices/userSlice";

export default function Notes() {
	const username = useSelector((state) => state.user.username);
	const { data: fetchedNotes, isLoading, isSuccess: fetchedNotesStatus } =
		useGetNoteAllQuery();
	const [deleteNote, { isError, error }] = useDeleteNoteMutation();
	const [logout] = useLogoutMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { data: getUserData, isLoading: getUserLoading } = useMeQuery();

	useEffect(() => {
		if (getUserData) {
			dispatch(setUsername(getUserData.username));
		}
	}, [getUserData, dispatch]);

	const handleNoteClick = (note) => {
		navigate(`/notedetails/${note._id}`);
	};

	const handleNoteClickDelete = async (note) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this note?"
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
		<div className="max-w-7xl mx-auto px-4 py-6">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<h2 className="text-2xl font-bold text-gray-800">My Notes</h2>
				<div className="flex gap-2">
					<button
						className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
						onClick={() => navigate("/create")}
					>
						<AiOutlinePlus size={20} />
						Create New
					</button>
					<button
						className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
						onClick={handelLogout}
					>
						<FiLogOut size={20} />
						Logout
					</button>
				</div>
			</div>

			{getUserLoading ? (
				<div className="text-center text-gray-500">Loading user...</div>
			) : (
				<div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-md mb-4">
					Welcome, <strong>{username}</strong>
				</div>
			)}

			{isLoading && (
				<div className="text-center text-gray-500">Loading notes...</div>
			)}

			{isError && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
					{error.data?.message}
				</div>
			)}

			{fetchedNotes && fetchedNotes?.notes?.length === 0 && (
				<div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
					Notes are not created yet.
				</div>
			)}

			{fetchedNotes && fetchedNotes?.notes?.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{fetchedNotes.notes.map((note) => (
						<div
							key={note._id}
							className="bg-white shadow-md rounded-lg p-4 cursor-pointer transition hover:shadow-lg"
							onClick={() => handleNoteClick(note)}
						>
							<h3 className="text-lg font-semibold text-gray-800 mb-2">
								{note.title}
							</h3>
							<p className="text-gray-600 text-sm mb-4">
								{note.description.length > 30
									? `${note.description.slice(0, 30)}...`
									: note.description}
							</p>
							<div className="text-right">
								<button
									className="text-red-600 hover:text-red-800 text-sm font-medium"
									onClick={(e) => {
										e.stopPropagation();
										handleNoteClickDelete(note);
									}}
								>
									Delete
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
			}			 
