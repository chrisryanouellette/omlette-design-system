import { ComponentType } from "react";
import { User, userStore } from "@Lib";

/**
 * A higher order component that handles setting the user from SSR hydrated props.
 *
 * This should only be used at the at the root of a page.
 */
export const withUser =
  <T extends { user: User | null }>() =>
  (Component: ComponentType<T>) =>
    function AuthUserHOC(props: T): JSX.Element {
      userStore.set(props.user);
      return <Component {...props} />;
    };
