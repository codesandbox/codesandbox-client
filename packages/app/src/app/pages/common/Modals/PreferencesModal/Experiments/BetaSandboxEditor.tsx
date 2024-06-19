import { Stack, Text } from "@codesandbox/components";
import React from "react";

import { useBetaSandboxEditor } from "app/hooks/useBetaSandboxEditor";
import track from "@codesandbox/common/lib/utils/analytics";
import { PaddedPreference } from "../elements";

export const BetaSandboxEditor = () => {
  const [betaSandboxEditor, setBetaSandboxEditor] = useBetaSandboxEditor();

  return (
    <>
      <PaddedPreference
        setValue={() => {
          if (!betaSandboxEditor) {
            track("Enable new sandbox editor - User preferences");
          } else {
            track("Disable new sandbox editor - User preferences");
          }

          setBetaSandboxEditor(!betaSandboxEditor);
        }}
        title="Unified Platform Editor"
        tooltip="Use Unified Platform Editor"
        type="boolean"
        value={betaSandboxEditor}
      />

      <Stack gap={3} direction="vertical">
        <Text block marginTop={2} size={3} variant="muted">
          Run your sandboxes in a faster and more stable editor.
        </Text>
      </Stack>
    </>
  );
};
