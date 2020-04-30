import React from 'react';
import { useOvermind } from 'app/overmind';
import { Header } from '../../../Components/Header';

export const TeamSettings = () => {
  const {
    state: { dashboard },
  } = useOvermind();
  return (
    <>
      <Header title="Team Settings" />
      {dashboard.activeTeam}
    </>
  );
};
