import * as React from 'react';

import { Container, DeleteIcon } from './elements';

type Props = {
    tag: string;
    removeTag?: (tag: { tag: string }) => void;
};

const Tag: React.SFC<Props> = ({ tag, removeTag }) => {
    return (
        <Container canRemove={Boolean(removeTag)}>
            {tag}
            {removeTag && (
                <DeleteIcon
                    onClick={() => {
                        removeTag({ tag });
                    }}
                />
            )}
        </Container>
    );
};

export default Tag;
