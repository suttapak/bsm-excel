import { Button, PressEvent } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";
import React, { PropsWithChildren } from "react";

type Props = PropsWithChildren & {
  Icon: React.ReactNode;
  path: string;
  onPress?: ((e: PressEvent) => void) | undefined;
};

const SidebarItem = ({ path, Icon, onPress, children }: Props) => {
  const { pathname } = useLocation();
  const active = path ? pathname === path : false;
  return (
    <li>
      <Button
        fullWidth
        as={Link}
        className={"flex justify-start"}
        color={active ? "primary" : "default"}
        size="sm"
        startContent={Icon}
        to={path}
        variant={active ? "solid" : "light"}
        onPress={onPress}
      >
        {children}
      </Button>
    </li>
  );
};

export default SidebarItem;
