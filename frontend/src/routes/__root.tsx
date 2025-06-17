import { Providers } from "@/components/provider";
import SidebarItem from "@/components/sidbar-item";
import { Navbar, NavbarBrand, NavbarContent, Button, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure } from "@heroui/react";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Home, Link, Menu, Settings } from "lucide-react";
import { Fragment } from "react";

export const Route = createRootRoute({
  component: () => <Layout />,
});

const Layout = () => {
  const { onOpen, ...modal } = useDisclosure();
  return (
    <Providers>
      <Navbar maxWidth="full" isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <p className="font-bold text-inherit">ACME</p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <Button size="sm" onPress={onOpen} isIconOnly variant="ghost" color="primary">
            <Menu size={18} />
          </Button>
        </NavbarContent>
      </Navbar>
      <div className="container mx-auto p-2">
        <Outlet />
      </div>
      <Drawer size="xs" {...modal}>
        <DrawerContent>
          {(onClose) => (
            <Fragment>
              <DrawerHeader>ACME</DrawerHeader>
              <DrawerBody>
                <ul className="flex flex-col gap-1">
                  <SidebarItem Icon={<Home />} onPress={onClose} path="/">
                    ตารางข้อมูล
                  </SidebarItem>
                  <SidebarItem Icon={<Settings />} onPress={onClose} path="/setting">
                    ตั้งค่าการรับข้อมูล
                  </SidebarItem>
                </ul>
              </DrawerBody>
              <DrawerFooter>
                <Link>Privacy Policy</Link>
              </DrawerFooter>
            </Fragment>
          )}
        </DrawerContent>
      </Drawer>
    </Providers>
  );
};
