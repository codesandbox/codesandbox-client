import React, { Fragment } from 'react';
import Modal from 'app/components/Modal';
import { observer } from 'mobx-react';
import DelayedAnimation from 'app/components/DelayedAnimation';
import getTemplate from 'common/templates';

import {
  ModalContainer,
  NextIconStyled,
  PrevIconStyled,
  Content,
  Tag,
  Name,
  Author,
} from './elements';

import ShowcasePreview from '../../common/ShowcasePreview';

const SelectedSandboxModal = ({
  onClose,
  modalOpen,
  selectedSandbox,
  settings,
  next,
  prev,
  indexes,
  ...props
}) => {
  const notFirst = selectedSandbox && indexes.indexOf(selectedSandbox.id) > 0;
  const notLast =
    selectedSandbox && indexes.indexOf(selectedSandbox.id) + 1 < indexes.length;

  return (
    <Modal {...props} onClose={onClose} isOpen={Boolean(modalOpen)} width={900}>
      <ModalContainer>
        {selectedSandbox ? (
          <Fragment>
            {notFirst ? <PrevIconStyled onClick={prev} /> : null}
            <ShowcasePreview sandbox={selectedSandbox} settings={settings} />
            {notLast ? <NextIconStyled onClick={next} /> : null}

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
                  Tags:{' '}
                  {selectedSandbox.tags.map(t => (
                    <Tag>{t}</Tag>
                  ))}
                </span>
              </section>

              <aside>
                <Author>
                  <img
                    src={selectedSandbox.author.avatarUrl}
                    width="50"
                    alt={selectedSandbox.author.name}
                  />

                  <section>
                    <span>{selectedSandbox.author.name}</span>
                    <span>
                      Sandboxes: {selectedSandbox.author.sandboxCount}
                    </span>
                  </section>
                </Author>
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
          <DelayedAnimation
            style={{
              textAlign: 'center',
              marginTop: '2rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            Fetching Sandbox...
          </DelayedAnimation>
        )}
      </ModalContainer>
    </Modal>
  );
};

export default observer(SelectedSandboxModal);
