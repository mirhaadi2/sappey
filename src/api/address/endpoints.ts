// Address API endpoints
export const ADDRESS_LIST = '/users/addresses';
export const ADDRESS_CREATE = '/users/addresses';
export const ADDRESS_UPDATE = (id: string) => `/users/addresses/${id}`;
export const ADDRESS_DELETE = (id: string) => `/users/addresses/${id}`;
export const ADDRESS_SET_DEFAULT = (id: string) => `/users/addresses/${id}/set-default`;
