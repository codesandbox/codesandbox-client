import React from 'react';
import { Avatar } from '.';
import { sid, sara } from './stubs';

export default {
  title: 'components/Avatar',
  component: Avatar,
};

export const Sid = () => <Avatar user={sid} />;
export const Sara = () => <Avatar user={sara} />;
export const Together = () => (
  <>
    <Avatar user={sid} />
    <Avatar user={sara} />
  </>
);
