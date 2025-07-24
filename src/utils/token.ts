// 封装本地存储的存储数据和读取数据的方法
export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}