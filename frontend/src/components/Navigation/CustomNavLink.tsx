import React, { forwardRef } from 'react';
import { NavLink } from 'react-router-dom';

// eslint-disable-next-line react/display-name
export default forwardRef<any, any>((props, ref) => (
  <NavLink
    ref={ref}
    {...props}
    className={({ isActive }) => (isActive ? `${props.className} Mui-selected` : props.className)}
    end
  />
));
