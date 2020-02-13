import React, {
  ComponentProps,
  ComponentType,
  FunctionComponent,
  useEffect,
  useState,
} from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Container } from './Container';
import {
  Animate,
  AnimatedChevron,
  ChevronPlaceholder,
  IconContainer,
  ItemName,
} from './elements';

type ContainerProps = ComponentProps<typeof Container>;
type Props = {
  active?: boolean;
  Icon: ComponentType;
  name: string;
  openByDefault?: boolean;
  path: ContainerProps['to'];
} & Omit<
  ComponentProps<typeof Container>,
  'active' | 'children' | 'exact' | 'to'
>;
export const Item: FunctionComponent<Props> = ({
  active = false,
  children,
  Icon,
  name,
  openByDefault,
  path,
  ...props
}) => {
  const match = useRouteMatch(path);
  const [open, setOpen] = useState(openByDefault);
  const isActive = match?.isExact || active;
  const isOpen = open || isActive;

  useEffect(() => {
    if (openByDefault) {
      setOpen(true);
    }
  }, [openByDefault]);

  useEffect(() => {
    if ((match || isActive) && open === undefined && children) {
      setOpen(true);
    }
  }, [children, isActive, match, open]);

  const toggleOpen = event => {
    event.preventDefault();

    setOpen(show => !show);
  };

  return (
    <>
      <Container active={isActive} exact to={path} {...props}>
        {children ? (
          <AnimatedChevron onClick={toggleOpen} open={isOpen} />
        ) : (
          <ChevronPlaceholder />
        )}

        <IconContainer>
          <Icon />
        </IconContainer>

        <ItemName>{name}</ItemName>
      </Container>

      {children && (
        <Animate
          duration={250}
          show={isOpen}
          start={{
            height: 0, // The starting style for the component.
            // If the 'leave' prop isn't defined, 'start' is reused!
          }}
          stayMounted={false}
          transitionOnMount
        >
          {children}
        </Animate>
      )}
    </>
  );
};
