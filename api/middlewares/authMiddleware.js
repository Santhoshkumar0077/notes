import jwt from "jsonwebtoken";
const auth = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token) {
		res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const verifiedToken = jwt.verify(token, process.env.JWT);
		req.user = verifiedToken;
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export default auth;
