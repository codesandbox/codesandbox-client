export const invariant = (assertion, error) => {
    if (!assertion) {
        console.error(error);
    }
};
