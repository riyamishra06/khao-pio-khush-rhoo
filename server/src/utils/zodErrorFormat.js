export const zodError = (error) => {
  var errors = [];
  error.map((err) => {
    errors.push({ message: err.message, path: err.path[0] });
  });
  return errors;
};
