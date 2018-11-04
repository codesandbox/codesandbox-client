import React, { Fragment } from 'react';
import Modal from 'app/components/Modal';
import { observer } from 'mobx-react';
import getTemplate from 'common/templates';

import {
  ModalContainer,
  NextIconStyled,
  PrevIconStyled,
  Content,
  Tag,
  Name,
} from './elements';

import ShowcasePreview from '../../Profile/Showcase/ShowcasePreview';

const SelectedSandboxModal = ({
  onClose,
  modalOpen,
  selectedSandbox,
  settings,
  next,
  prev,
}) => (
  <Modal onClose={onClose} isOpen={Boolean(modalOpen)} width={900}>
    <ModalContainer style={{ position: 'relative' }}>
      {selectedSandbox ? (
        <Fragment>
          <PrevIconStyled onClick={prev} />
          <ShowcasePreview sandbox={selectedSandbox} settings={settings} />
          <NextIconStyled onClick={next} />
          <Content>
            <section>
              {/* {JSON.stringify(selectedSandbox)} */}
              {/* {JSON.stringify(getTemplate(selectedSandbox.template).color())} */}
              <Name>{selectedSandbox.title}</Name>
              <span style={{ display: 'block' }}>
                Description: {selectedSandbox.description}
              </span>
              <span style={{ display: 'block' }}>
                Template: {getTemplate(selectedSandbox.template).niceName}
              </span>
              <span style={{ display: 'block' }}>
                Tags: {selectedSandbox.tags.map(t => <Tag>{t}</Tag>)}
              </span>
            </section>

            <aside>
              <span style={{ display: 'block' }}>Author: </span>
              <span style={{ display: 'block' }}>
                <img
                  src={selectedSandbox.author.avatarUrl}
                  width="50"
                  alt={selectedSandbox.author.name}
                />
              </span>
              <span style={{ display: 'block' }}>
                {selectedSandbox.author.name}
              </span>
              <span style={{ display: 'block' }}>
                Views:{selectedSandbox.viewCount}
              </span>
              <span style={{ display: 'block' }}>
                Forks:{selectedSandbox.forkCount}
              </span>
            </aside>
          </Content>
        </Fragment>
      ) : (
        'loading'
      )}
    </ModalContainer>
  </Modal>
);

export default observer(SelectedSandboxModal);
