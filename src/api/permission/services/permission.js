'use strict';

const permissionMap = {
  'Super Admin': {
    'contentHomepage': ['home'],
    'branch': ['home', 'view', 'add', 'edit', 'delete'],
    'warehouseInventory': ['home', 'export_excel'],
    'warehouseImport': ['home', 'add', 'edit', 'submit', 'delete'],
    'warehouseExport': ['home', 'add', 'edit', 'submit', 'delete'],
    'warehouseCatalogue': ['home', 'add', 'edit', 'submit', 'delete'],
    'productCategory': ['home', 'add', 'edit', 'delete'],
    'productColor': ['home', 'add', 'edit', 'delete'],
    'productPattern': ['home', 'add', 'edit', 'delete'],
    'productWidth': ['home', 'add', 'edit', 'delete'],
    'productStretch': ['home', 'add', 'edit', 'delete'],
    'productOrigin': ['home', 'add', 'edit', 'delete'],
    'product': ['home', 'add', 'edit', 'delete'],
    'order': [
      'home',
      'view',
      'view_invoice',
      'add',
      'export_excel',
      'create_export',
      'create_invoice',
      'check_success',
      'export_pdf_invoice'
    ],
    'transactionVNPAY': ['home', 'export_excel'],
    'refund': ['home', 'view', 'view_invoice', 'add', 'edit', 'export_excel', 'approve', 'export_pdf_invoice'],
    'user': ['home', 'view', 'add', 'edit', 'reset_password'],
    'userSchedule': ['home'],
    'userLeave': ['home', 'view', 'add', 'edit', 'delete', 'approve'],
    'voucher': ['home', 'view', 'add', 'edit'],
    'customer': ['home', 'view', 'update_debt', 'change_status', 'delete', 'export_excel'],
    'customerDebt': ['home', 'update_debt', 'export_excel'],
    'statisticsRevenue': ['home', 'export_excel'],
    'statisticsSoldvolume': ['home', 'export_excel'],
    'statisticsCustomer': ['home', 'export_excel'],
  },
  'Branch Manager': {
    'warehouseInventory': ['home', 'export_excel'],
    'warehouseImport': ['home', 'add', 'edit', 'submit', 'delete'],
    'warehouseExport': ['home', 'add', 'edit', 'submit', 'delete'],
    'warehouseCatalogue': ['home', 'add', 'edit', 'submit', 'delete'],
    'productCategory': ['home', 'add', 'edit', 'delete'],
    'productColor': ['home', 'add', 'edit', 'delete'],
    'productPattern': ['home', 'add', 'edit', 'delete'],
    'productWidth': ['home', 'add', 'edit', 'delete'],
    'productStretch': ['home', 'add', 'edit', 'delete'],
    'productOrigin': ['home', 'add', 'edit', 'delete'],
    'product': ['home', 'add', 'edit', 'delete'],
    'order': [
      'home',
      'view',
      'view_invoice',
      'add',
      'export_excel',
      'create_export',
      'create_invoice',
      'check_success',
      'export_pdf_invoice'
    ],
    'refund': ['home', 'view', 'view_invoice', 'add', 'edit', 'export_excel', 'approve', 'export_pdf_invoice'],
    'user': ['home', 'view', 'add', 'edit', 'reset_password'],
    'userSchedule': ['home'],
    'userLeave': ['home', 'view', 'add', 'edit', 'delete', 'approve'],
    'customer': ['home', 'view', 'update_debt', 'change_status', 'delete', 'export_excel'],
    'customerDebt': ['home', 'update_debt', 'export_excel'],
    'statisticsRevenue': ['home', 'export_excel'],
    'statisticsSoldvolume': ['home', 'export_excel'],
    'statisticsCustomer': ['home', 'export_excel'],
  },
  'Sales User': {
    'order': [
      'home',
      'view',
      'view_invoice',
      'add',
      'export_excel',
      'create_export',
      'create_invoice',
      'check_success',
      'export_pdf_invoice'
    ],
    'refund': ['home', 'view', 'view_invoice', 'add', 'edit', 'export_excel', 'export_pdf_invoice'],
    'customer': ['home', 'view', 'update_debt', 'export_excel'],
    'customerDebt': ['home', 'update_debt', 'export_excel'],
  },
  'Warehouses User': {
    'warehouseInventory': ['home', 'export_excel'],
    'warehouseImport': ['home', 'add', 'edit', 'submit', 'delete'],
    'warehouseExport': ['home', 'add', 'edit', 'submit', 'delete'],
    'warehouseCatalogue': ['home', 'add', 'edit', 'submit', 'delete'],
  },
}

module.exports = () => ({
  async checkPermission(ctx, moduleName, functionName) {
    const { user } = ctx.state;
    if (!user) return false;
    if (!permissionMap[user.role.name].hasOwnProperty(moduleName)) {
      return false;
    }
    return permissionMap[user.role.name][moduleName].includes(functionName);
  }
});
