import React from 'react';
import { ContextMenuTrigger as CtxMenuTrigger } from 'react-contextmenu';

const ContextMenuTrigger = (props) => {
  const { children, id } = props;

  return (
    <CtxMenuTrigger id={id}>
      {children}
    </CtxMenuTrigger>
  );
};

export default ContextMenuTrigger;