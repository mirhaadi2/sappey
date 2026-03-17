// Address API endpoints
export const ADDRESS_LIST = '/addresses';
export const ADDRESS_CREATE = '/addresses';
export const ADDRESS_GET_DEFAULT = '/addresses/default';
export const ADDRESS_GET = (id: string) => `/addresses/${id}`;
export const ADDRESS_UPDATE = (id: string) => `/addresses/${id}`;
export const ADDRESS_DELETE = (id: string) => `/addresses/${id}`;
export const ADDRESS_SET_DEFAULT = (id: string) => `/addresses/${id}/set-default`;
