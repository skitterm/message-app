import React, {
  FC,
  useState,
  useEffect,
  useRef,
  MouseEvent,
  ReactElement,
} from "react";
import styled from "styled-components";
import variables from "../../styles/variables"

const AnchorContainer = styled.div`
  position: relative;
`;

const Anchor = styled.button`
  position: relative;
  border: none;
  background-color: transparent;
  padding: 2px;
  cursor: pointer;

  &:hover {
    background-color: ${variables.color.offWhite};
  }
`;
const Popover = styled.ul`
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 1;
  transform: translateY(100%);
  min-width: 100px;
  background-color: ${variables.color.white};
  box-shadow: 1px 1px 5px 1px rgba(30,30,30,0.3);
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const PopoverItem = styled.li`
  white-space: nowrap;

  & + & {
    border-top: 1px solid ${variables.color.offWhite};
  }
`;

const PopoverItemButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  text-align: right;
  width: 100%;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${variables.color.offWhite};
  }
`;

interface DropdownItem {
  id: string;
  label: string;
  onClick: () => void;
}

interface Props {
  target: ReactElement;
  items: DropdownItem[];
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
    <AnchorContainer>
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
        
      </Anchor>
      {isShowing && <Popover>{props.items.map(item => (
        <PopoverItem key={item.id}>
          <PopoverItemButton onClick={item.onClick}>{item.label}</PopoverItemButton>
        </PopoverItem>
      ))}</Popover>}
    </AnchorContainer>
  );
};

export default Dropdown;
