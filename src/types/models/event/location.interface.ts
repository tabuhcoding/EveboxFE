export interface TranslatedName {
  vi: string;
  en: string;
}

export interface District {
  id: number;
  name: TranslatedName;
}

export interface Province {
  id: number;
  name: TranslatedName;
  districts: District[];
}
