const components = {
  Tabs: {
    backgroundColor: 'grays.5',
    fontSize: 2,
    boxShadow: 'underline',
  },
  Tab: {
    color: 'white',
    paddingY: 3,
    paddingLeft: 2,
    cursor: 'pointer',

    '&[aria-selected]': {
      boxShadow: 'active',
      '& svg': {
        opacity: 1,
      },
    },
    '&:hover svg': {
      opacity: 1,
    },
  },
  TabCloseIcon: {
    fontSize: 1,
    marginY: 1,
    opacity: 0,
    // close icon is a lie, it's just a rotated PlusIcon
    // TODO: replace it with a skinny X
    transform: 'rotate(45deg)',
  },
};

export default components;
