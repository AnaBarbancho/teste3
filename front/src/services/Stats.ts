import { ErrorProps, GridsByProjectProps, MappingByProjectProps, PointersByProjectProps } from "../types";
import api from "./api";

class Stats {
  async gridsByProject(): Promise<GridsByProjectProps[] | ErrorProps> {
    try {
      const { data } = await api.get("/estatisticas/gridsByProject");
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async mappingByProject(): Promise<MappingByProjectProps[] | ErrorProps> {
    try {
      const { data } = await api.get("/estatisticas/mappingByProject");
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }

  async pointersByProject(): Promise<PointersByProjectProps[] | ErrorProps> {
    try {
      const { data } = await api.get("/estatisticas/pointersByProject");
      return data;
    } catch (error: any) {
      return { erro: error.message };
    }
  }
}

const stats = new Stats();
export default stats;
