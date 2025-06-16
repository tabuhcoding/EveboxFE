interface District {
  id: number;
  name: string;
}

export interface Province {
  id: number;
  name: string;
  districts: District[];
}