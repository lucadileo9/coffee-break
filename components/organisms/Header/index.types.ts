export interface MenuItemConfig {
  href: string;
  text: string;
  requiresAuth?: boolean;
  adminOnly?: boolean;
}

export interface MenuItem extends MenuItemConfig {
  active: boolean;
}

export interface HeaderProps {}
