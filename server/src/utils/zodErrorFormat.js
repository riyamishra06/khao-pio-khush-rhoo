export const zodError = (zodIssues) => {
  const errors = zodIssues.map((err) => ({
    message: err.message,
    path: err.path[0],
  }));
  return errors;
};
