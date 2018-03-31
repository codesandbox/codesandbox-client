// UNUSED FOR NOW, WILL CONVERT OR REUSE

import * as React from 'react';
import * as CodeMirror from 'codemirror';

import { getCodeMirror } from 'app/utils/codemirror';

import { Container } from './elements';

type Props = {
    readOnly: boolean;
    code: string;
    onChange: (code: string) => void;
};

export default class Editor extends React.PureComponent<Props> {
    codemirror: any;
    setUpCodeMirror = (el) => {
        const { code, readOnly } = this.props;
        const doc = new CodeMirror.Doc(code, 'jsx');
        this.codemirror = getCodeMirror(el, doc);
        this.codemirror.setOption('lineNumbers', false);
        this.codemirror.setOption('readOnly', readOnly);

        this.codemirror.on('change', this.handleChange);
    };

    handleChange = (cm: any, change: any) => {
        if (change.origin !== 'setValue' && this.props.onChange) {
            this.props.onChange(cm.getValue());
        }
    };

    render() {
        const { readOnly } = this.props;
        return (
            <Container readOnly={readOnly}>
                <div ref={this.setUpCodeMirror} />
            </Container>
        );
    }
}
