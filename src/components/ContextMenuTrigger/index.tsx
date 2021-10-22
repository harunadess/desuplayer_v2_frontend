import { FC } from 'react';
import { ContextMenuTrigger as CtxMenuTrigger } from 'react-contextmenu';

interface Props {
  id: string;
}

const ContextMenuTrigger: FC<Props> = (props) => {
  const { children, id } = props;

  return (
    <CtxMenuTrigger id={id}>
      {children}
    </CtxMenuTrigger>
  );
};

export default ContextMenuTrigger;