import React, { createContext, Component, ComponentType } from "react";
import { User } from "../types";

export interface UserContextProps {
  user?: User;
}

const UserContext = createContext({});

/* 
    used guidance from https://stackoverflow.com/a/51717096
    and https://medium.com/@jrwebdev/react-higher-order-component-patterns-in-typescript-42278f7590fb
    to figure out the HOC and typings
*/
export const injectUserContext = <P extends UserContextProps>(
  WrappedComponent: ComponentType<P>
) => {
  return class WithUserContext extends Component<
    Pick<P, Exclude<keyof P, keyof UserContextProps>>
  > {
    public render() {
      return (
        <UserContext.Consumer>
          {(value: UserContextProps) => (
            <WrappedComponent {...(this.props as P)} {...value} />
          )}
        </UserContext.Consumer>
      );
    }
  };
};

export default UserContext;
