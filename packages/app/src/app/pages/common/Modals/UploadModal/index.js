import React from 'react';
import { inject, observer } from 'mobx-react';
import UploadProgress from 'app/components/UploadProgress';

function UploadModal({ store }) {
  return <UploadProgress message="Uploading File..." />;
}

export default inject('store')(observer(UploadModal));
