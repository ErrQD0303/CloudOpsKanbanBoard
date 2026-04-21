export const checkTitle = (title: string) => {
  if (title.trim().length === 0) {
    return "Title is required";
  }

  return null;
};
