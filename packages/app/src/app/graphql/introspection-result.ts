export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'UNION',
        name: 'ReferenceMetadata',
        possibleTypes: [
          {
            name: 'CodeReferenceMetadata',
          },
          {
            name: 'ImageReferenceMetadata',
          },
          {
            name: 'PreviewReferenceMetadata',
          },
          {
            name: 'UserReferenceMetadata',
          },
        ],
      },
      {
        kind: 'UNION',
        name: 'BookmarkEntity',
        possibleTypes: [
          {
            name: 'Team',
          },
          {
            name: 'User',
          },
        ],
      },
    ],
  },
};
export default result;
