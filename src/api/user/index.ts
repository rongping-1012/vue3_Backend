import request from "@/utils/request";
import { LoginParams, LoginResponse, UserInfoResponse } from "./type";
// 统一管理用户相关接口
enum UserApi {
  LOGIN_URL = "/user/login",
  USERINFO_URL = "/user/info"
}

export const reqLogin = (data: LoginParams) => request.post<any, LoginResponse>(UserApi.LOGIN_URL, data);
export const reqUserInfo = () => request.get<any, UserInfoResponse>(UserApi.USERINFO_URL);