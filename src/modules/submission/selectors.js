import { getRoot } from "../selectors";

export const getSubmission = (name, state) => getRoot(name, state).submission;
