import { MenuItem } from "./menu-item.interface";

export interface RouteInfo
{
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    isCollapsed?: boolean;
    isCollapsing?: any;
    children?: MenuItem[];
}