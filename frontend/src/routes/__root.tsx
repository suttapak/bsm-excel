import AppIcon from "@/components/appicon";
import { Providers } from "@/components/provider";
import RunningLed from "@/components/running-led";
import SidebarItem from "@/components/sidbar-item";
import { useDataStore } from "@/hooks/use-data";
import { useGetInstantRunning } from "@/hooks/use-setting";
import { Navbar, NavbarBrand, NavbarContent, Button, Drawer, DrawerContent, DrawerHeader, DrawerBody, DrawerFooter, useDisclosure, Input } from "@heroui/react";
import { createRootRoute, Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Home, Link, Menu, Search, Settings } from "lucide-react";
import { Fragment } from "react";
import { Link as HeroLink } from "@heroui/react";

export const Route = createRootRoute({
  component: () => <Layout />,
});

const Layout = () => {
  const { onOpen, ...modal } = useDisclosure();
  const { setSearch } = useDataStore();

  const { isRunning, isLoading, len } = useGetInstantRunning();
  return (
    <Providers>
      <Navbar maxWidth="full" isBordered>
        <NavbarContent justify="start">
          <NavbarBrand className="mr-4">
            <HeroLink href="/">
              <AppIcon />
            </HeroLink>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent justify="end">
          <Input onValueChange={setSearch} isClearable placeholder="ค้นหาจาก หมายเลขประจำตัว" startContent={<Search />} />
          <RunningLed isRunning={isRunning} isLoading={isLoading} badge={`${len}`} />
          <Button size="sm" onPress={onOpen} isIconOnly variant="ghost" color="primary">
            <Menu size={18} />
          </Button>
        </NavbarContent>
      </Navbar>
      <div className="container mx-auto px-2 py-3">
        <Outlet />
      </div>
      <Drawer size="xs" {...modal}>
        <DrawerContent>
          {(onClose) => (
            <Fragment>
              <DrawerHeader>BSM 370 Computer Interface</DrawerHeader>
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
      <TanStackRouterDevtools />
    </Providers>
  );
};
