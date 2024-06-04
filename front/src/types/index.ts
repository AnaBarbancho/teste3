import { ReactNode } from "react";

export interface ErrorProps {
    erro: string;
  }
  
  export interface LoginProps {
    id: number;
    mail: string;
    profile: string;
    token: string;
  }
  
  export interface UserProps {
    id: number;
    mail: string;
    profile: string;
  }
  
  export interface GridsByProjectProps {
    idproject: number;
    name: string;
    total_grids: number;
    finished_grids: number;
    total_area: number;
    finished_area: number;
  }
  
  export interface MappingByProjectProps {
    idproject: number;
    name: string;
    total_changes: number;
    area_changes: number;
  }
  
  export interface PointersByProjectProps {
    id: number;
    name: string;
    total_pointers: number;
  }
  export interface UserContextProps {
    users: UserProps[] | null;
    mail: string | null;
    profile: string | null;
    token: string | null;
    login: (mail: string, password: string) => void;
    logout: () => void;
    create: (mail: string, password: string,profile:string) => void;
    getUsers: () => void;
    updateProfile: (id: string, profile: string) => void;
    error: ErrorProps | null;
    setError: (error: ErrorProps | null) => void;
    isErrorProps: (object: any) => object is ErrorProps;
  }
  export interface ProviderProps {
    children: ReactNode;
  }