// Validates req.body against a zod schema and replaces it with the parsed (stripped) value.
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body ?? {});
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue.path.join('.');
    return res.status(400).json({ message: field ? `${field}: ${issue.message}` : issue.message });
  }
  req.body = result.data;
  next();
};

module.exports = validate;
