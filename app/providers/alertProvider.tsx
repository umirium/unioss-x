import type { ReactElement } from "react";
import { createContext, useContext } from "react";
import type { NoticeType } from "~/types/outline";

interface Props {
  onShowAlert: (i18nObj: NoticeType | undefined) => void;
  children: ReactElement;
}

interface ContextInterface {
  showAlert: (i18nObj: NoticeType | undefined) => void;
}

const ShowAlertContext = createContext<ContextInterface | undefined>(undefined);

export function useShowAlertContext() {
  const context = useContext(ShowAlertContext);

  if (context === undefined) {
    throw new Error(
      "useShowAlertContext must be used within a ShowAlertProvider"
    );
  }

  return context;
}

export function ShowAlertProvider(props: Props) {
  const value: ContextInterface = { showAlert: props.onShowAlert };

  return (
    <ShowAlertContext.Provider value={value}>
      {props.children}
    </ShowAlertContext.Provider>
  );
}
