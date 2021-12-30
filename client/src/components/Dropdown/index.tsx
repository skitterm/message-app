import React, {
  FC,
  useState,
  useEffect,
  useRef,
  RefObject,
  MouseEvent,
  ReactElement,
} from "react";
import styled from "styled-components";

const Anchor = styled.button`
  position: relative;
`;
const Popover = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  transform: translateY(100%);
`;

interface Props {
  target: ReactElement;
}

const Dropdown: FC<Props> = (props) => {
  const [isShowing, setIsShowing] = useState(false);
  const anchorRef = useRef<HTMLButtonElement | undefined>(undefined);

  useEffect(() => {
    const closeDropdown = (event: Event) => {
      if (!anchorRef.current?.contains(event.target as HTMLElement)) {
        setIsShowing(false);
      }
    };

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  });

  return (
    <Anchor
    // @ts-ignore
      ref={anchorRef}
      onClick={(event: MouseEvent) => {
        console.log("event handler");
        event.stopPropagation();
        setIsShowing(!isShowing);
      }}
    >
      {props.target}
      {isShowing && <Popover>Here is an item</Popover>}
    </Anchor>
  );
};

export default Dropdown;
