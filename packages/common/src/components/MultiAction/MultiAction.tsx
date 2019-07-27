import React, { memo, cloneElement, Children } from 'react';
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
  disablePrimary?: boolean;
  small?: boolean;
  block?: boolean;
  disabled?: boolean;
  secondary?: boolean;
  red?: boolean;
  danger?: boolean;
  children: React.ReactElement;
}

export const MultiAction: React.FC<IMultiActionProps> = memo(
  ({
    Icon,
    primaryActionLabel,
    onPrimaryClick,
    disablePrimary = false,
    small = false,
    block = false,
    disabled = false,
    secondary = false,
    red = false,
    danger = false,
    children,
  }) => {
    const menu = useMenuState();
    const buttonProps = { small, block, disabled, secondary, red, danger };

    return (
      <Container>
        {/*
        // @ts-ignore */}
        <PrimaryAction
          onClick={onPrimaryClick}
          {...buttonProps}
          disabled={disablePrimary || disabled}
        >
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
          {children && (children as React.ReactElement[]).length
            ? /* eslint-disable react/no-array-index-key */
              (children as React.ReactElement[]).map((child, i) => (
                <SecondaryAction key={i} {...menu} {...child.props || {}}>
                  {itemProps => cloneElement(Children.only(child), itemProps)}
                </SecondaryAction>
              ))
            : !Array.isArray(children) && (
                <SecondaryAction
                  {...menu}
                  {...(children as React.ReactElement).props || {}}
                >
                  {itemProps =>
                    cloneElement(Children.only(children), itemProps)
                  }
                </SecondaryAction>
              )}
        </ActionsList>
      </Container>
    );
  }
);
