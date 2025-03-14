
export interface ClientItem {
  ver: string;
  group_count: string;
}

export interface ApiResponse {
  code: number;
  msg: string;
  data: {
    list: ClientItem[];
    count: number;
  };
}

export interface ClientData {
  [key: string]: number;
}
