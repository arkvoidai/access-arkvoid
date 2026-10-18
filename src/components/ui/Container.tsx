import React from 'react';

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
}) => {
  return (
    <Component
      className={`mx-auto w-full max-w-[1680px] ${className}`}
      style={{
        paddingLeft: 'clamp(20px, 4vw, 72px)',
        paddingRight: 'clamp(20px, 4vw, 72px)',
      }}
    >
      {children}
    </Component>
  );
};
