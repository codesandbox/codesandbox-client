import * as React from 'react';
import { connect, WithCerebral } from 'app/fluent';

import { Title, SubContainer, PreferenceContainer, PaddedPreference, SubDescription, Rule } from '../../elements';

type Props = WithCerebral;

const PreviewSettings: React.SFC<Props> = ({ store, signals }) => {
    const bindValue = (name) => ({
        value: store.preferences.settings[name],
        setValue: (value) =>
            signals.preferences.settingChanged({
                name,
                value
            })
    });

    return (
        <div>
            <Title>Preview</Title>

            <SubContainer>
                <PreferenceContainer>
                    <PaddedPreference
                        title="Preview on edit"
                        type="boolean"
                        {...bindValue('livePreviewEnabled')}
                        tooltip="Only update on save"
                    />
                    <SubDescription>Preview the latest code without saving.</SubDescription>
                    <Rule />
                    <PaddedPreference
                        title="Clear console"
                        type="boolean"
                        {...bindValue('clearConsoleEnabled')}
                        tooltip="Clear console when executing"
                    />
                    <SubDescription>Clear your developer console between every execution.</SubDescription>
                    <Rule />
                    <PaddedPreference title="Instant preview" type="boolean" {...bindValue('instantPreviewEnabled')} />
                    <SubDescription>Show preview on every keypress.</SubDescription>
                </PreferenceContainer>
            </SubContainer>
        </div>
    );
};

export default connect<Props>()(PreviewSettings);
