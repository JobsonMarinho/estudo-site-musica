'use client'

import { useState, useCallback } from 'react'

interface AnimatedIconProps {
  disabled?: boolean;
  IconComponent: React.ComponentType<{ size: number; className: string; onClick: () => void }>;
  size: number;
  className: string;
  onClick?: () => void;
}

export default function AnimatedIcon({
  disabled = false,
  IconComponent,
  size,
  className,
  onClick,
}: AnimatedIconProps) {
  const [isClicked, setIsClicked] = useState(false)

  const handleClick = useCallback(() => {
    if (disabled) return
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 300)
    if (onClick) onClick()
  }, [disabled, onClick])

  return (
    <IconComponent
      size={size}
      className={`${className} transition-transform duration-300 ${isClicked ? 'scale-120' : ''} ${disabled ? '' : 'cursor-pointer hover:scale-110'}`}
      onClick={handleClick}
    />
  )
}