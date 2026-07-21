interface Window {
  RSO_CONFIG: any;
  RSO_CULTURE_NOTES: any;
  luxon: any;
  tzlookup: any;
  d3: any;
  Celestial: any;
  __RSO_LOCAL_DATA__: Record<string, any>;
  __RSO_LOAD_COUNTS__: Record<string, number>;
  __RSO_DATA_MODE__: string;
  registerSkyData: (path: string, data: any) => void;
  __RSO_PLANET_OBJECTS__: any[];
  __RSO_PLANET_ORIGIN__: any;
}

declare const d3: any;
declare const Celestial: any;
