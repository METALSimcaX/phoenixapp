import { SubMenuItem } from "./submenu-item.interface";

export interface MenuItem
{
    path: string;
    title: string;
    type?: string;
    collapse?: string;
    children?: SubMenuItem[];
    isCollapsed?: boolean;
}