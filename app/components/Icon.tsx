"use client";

import { Icon as IconifyIcon } from "@iconify/react";

interface IconProps {
  name: string;
  className?: string;
  size?: number | string;
}

export function Icon({ name, className = "", size = 20 }: IconProps) {
  return (
    <IconifyIcon
      icon={name}
      className={className}
      width={size}
      height={size}
    />
  );
}
