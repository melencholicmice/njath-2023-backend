export const validateBody = (schema) => {
	return (req, res, next) => {
		const { error, value } = schema.validate(req.body);

		if (error) {
			const errorMessage = error.details
				.map((detail) => detail.message)
				.join("; ");
			return res.status(400).json({
				success: false,
				message: errorMessage
			});
		}

		req.validatedData = value;
		next();
	};
};
