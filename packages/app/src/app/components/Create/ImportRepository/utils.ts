export const getOwnerAndNameFromInput = (input: string) => {
  let sanitizedInput = input.replace(/\s/, '');

  // Invalidate if input is empty.
  if (!sanitizedInput) {
    return null;
  }

  // If it starts with "www.", "github.com" or "http(s?)://", it
  // should be an url.
  if (sanitizedInput.match(/(^www.)|(^github.com)|(^http(s?):\/\/)/g)) {
    try {
      // If the input doesn't start with "http(s?)://", add it so
      // the new URL constructor.
      const parsedUrl = new URL(
        /^(?!https?:\/\/)/g.test(sanitizedInput)
          ? `https://${sanitizedInput}`
          : sanitizedInput
      );

      // Remove slashes from the beginning and end of the
      // pathname before splitting it, also remove ".git".
      const pathnameParts = parsedUrl.pathname
        .replace(/^\/|(\/$)|(\.git$)/g, '')
        .split('/');

      // If the pathname is correctly formed (owner/name),
      // the length should equal 2.
      if (pathnameParts.length !== 2) {
        throw new Error('Invalid pathanme.');
      }

      return { owner: pathnameParts[0], name: pathnameParts[1] };
    } catch (error) {
      return null;
    }
  }

  // Check if the input is a SSH clone url.
  if (sanitizedInput.startsWith('git@')) {
    // If it's the case, extract the owner and name
    // to be returned in the next step.
    sanitizedInput = sanitizedInput.replace(/^git@github.com:|(\.git$)/g, '');
  }

  // Check if the input matches "owner/name".
  if (sanitizedInput.includes('/')) {
    const splitInput = sanitizedInput.split('/');
    
    if (splitInput.length === 2) {
      return { owner: splitInput[0], name: splitInput[1] };
    }
  }

  return null;
};
