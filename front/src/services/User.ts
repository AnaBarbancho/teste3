import { ErrorProps, LoginProps, UserProps } from "../types";
import api from "./api";

class User {
  async login(
    mail: string,
    password: string
  ): Promise<LoginProps | ErrorProps> {
    try {
      const { data } = await api.post("/login", { mail, password });
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async create(
    mail: string,
    password: string,
    profile:string
  ): Promise<LoginProps | ErrorProps> {
    try {
      const { data } = await api.post("/usuario", { mail, password, profile });
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async list(): Promise<UserProps[] | ErrorProps> {
    try {
      const { data } = await api.get("/usuario");
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async delete(id:number): Promise<UserProps | ErrorProps>{
    try {
        // No Axios o método HTTP DELETE não aceita passar parâmetros pelo body
        const { data } = await api.delete(`/usuario/${id}`);
        return data;
      } catch (error: any) {
        return { erro: error.message };
      }
  }


  async updateProfile(
    id: string,
    profile: string
  ): Promise<UserProps | ErrorProps> {
    try {
      const { data } = await api.put("/usuario/perfil", { id, profile });
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async updateMail(
    id: string,
    mail: string
  ): Promise<UserProps | ErrorProps> {
    try {
      const { data } = await api.put("/usuario/mail", { id, mail });
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async updatePassword(
    id: string,
    password: string
  ): Promise<UserProps | ErrorProps> {
    try {
      const { data } = await api.put("/usuario/senha", { id, password });
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }
}

const user = new User();
export default user;