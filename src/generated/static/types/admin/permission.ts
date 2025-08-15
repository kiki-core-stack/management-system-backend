export type AdminPermission =
  | 'admin.create'
  | 'admin.delete'
  | 'admin.list'
  | 'admin.log.list'
  | 'admin.role.create'
  | 'admin.role.delete'
  | 'admin.role.list'
  | 'admin.role.update'
  | 'admin.toggle'
  | 'admin.update'
  | 'home.dashboard.view';

export type AdminPermissionGroup =
  | 'admin'
  | 'admin.log'
  | 'admin.role'
  | 'home'
  | 'home.dashboard';
