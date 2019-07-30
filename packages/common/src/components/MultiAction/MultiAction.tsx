import React, { cloneElement, Children } from 'react';
import GoChevronDown from 'react-icons/lib/go/chevron-down';
import GoChevronUp from 'react-icons/lib/go/chevron-up';
import { useMenuState } from 'reakit/Menu';
import { ButtonIcon } from '../Button';
import {
  Container,
  PrimaryAction,
  ToggleActionsList,
  ActionsList,
  SecondaryAction,
} from './elements';

interface IMultiActionProps {
  Icon?: any;
  primaryActionLabel: string;
  onPrimaryClick?: (event: React.MouseEvent) => void;
  small?: boolean;
  block?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  red?: boolean;
  danger?: boolean;
  children: React.ReactElement[];
}

export const MultiAction: React.FC<IMultiActionProps> = ({
  onPrimaryClick,
  Icon,
  primaryActionLabel,
  small,
  block,
  disabled,
  secondary,
  red,
  danger,
  children,
}) => {
  const menu = useMenuState();
  const buttonProps = { small, block, disabled, secondary, red, danger };
  return (
    <Container>
      {/*
        // @ts-ignore */}
      <PrimaryAction onClick={onPrimaryClick} {...buttonProps}>
        {Icon && (
          <ButtonIcon>
            <Icon />
          </ButtonIcon>
        )}
        {primaryActionLabel}
      </PrimaryAction>
      <ToggleActionsList {...menu} {...buttonProps}>
        {menu.visible ? <GoChevronUp /> : <GoChevronDown />}
      </ToggleActionsList>
      <ActionsList {...menu} aria-label="Additional Options">
        {children && children.length ? (
          /* eslint-disable react/no-array-index-key */
          children.map((child, i) => (
            <SecondaryAction key={i} {...menu}>
              {itemProps => cloneElement(Children.only(child), itemProps)}
            </SecondaryAction>
          ))
        ) : (
          <SecondaryAction {...menu}>
            {itemProps => cloneElement(Children.only(children), itemProps)}
          </SecondaryAction>
        )}
      </ActionsList>
    </Container>
  );
};
