import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function Modal({ children, show }) {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);
  const ShowModal = show ? (
    <div className="fixed bg-[rgba(49,49,49,0.8)] top-0 right-0 w-screen h-screen flex flex-col items-center justify-center">
      {children}
    </div>
  ) : null;
  if (isBrowser) {
    return ReactDOM.createPortal(
      ShowModal,
      document.getElementById("modal-root")
    );
  } else {
    return null;
  }
}
