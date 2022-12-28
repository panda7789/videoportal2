import React, { forwardRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
// eslint-disable-next-line import/no-cycle
import { NavigationContext } from 'routes/Root';

// eslint-disable-next-line react/display-name
export default forwardRef<any, any>((props, ref) => {
  const context = useContext(NavigationContext);

  const handleClick = () => {
    context?.setOpen(true);
  };
  
  return (
    <NavLink
      ref={ref}
      {...props}
      onClick={handleClick}
      className={({ isActive }) => (isActive ? `${props.className} Mui-selected` : props.className)}
      end />
  );
});
