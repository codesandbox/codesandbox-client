import * as React from 'react';
import Input from 'common/components/Input';
import Button from 'app/components/Button';
import { Container, Title, SubTitle, Image, MaxWidth } from './elements';
import { Props as CodeEditorProps } from '../';

type Props = CodeEditorProps & {
    dependencies: any;
};

export default class ImageViewer extends React.Component<Props> {
    input: HTMLInputElement;

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (this.props.onSave) {
            this.props.onSave(this.input.value);
        }
    };

    doChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.props.onChange(e.target.value);
    };

    render() {
        const { currentModule } = this.props;

        return (
            <Container style={{ width: this.props.width, height: this.props.height }} horizontal>
                <Title>Image</Title>
                <SubTitle>We refer to these files by URL, you can edit this url to change the image.</SubTitle>

                <Image src={currentModule.code} alt={currentModule.code} />

                <MaxWidth onSubmit={this.onSubmit}>
                    <Input
                        innerRef={(el) => {
                            this.input = el;
                        }}
                        onChange={this.doChangeCode}
                        value={currentModule.code}
                    />
                    <Button type="submit">Save</Button>
                </MaxWidth>
            </Container>
        );
    }
}
