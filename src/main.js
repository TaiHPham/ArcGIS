import esriConfig from "@arcgis/core/config.js"
import { authenticate } from "./authenticate.js";
import { map as initializeMap } from './map_esm.js';
import { search as searchAddress } from './search_esm.js';

const apiKey = "AAPK1697531f68154e52a7af9c1ab0d57d1106Rjv_iHhZKlpG4OuGST9Hr_YdnA5I96Q8vO-N-xgAUU92k7U1hk9JbaQ2C4Ak4m"
esriConfig.apiKey = apiKey;

authenticate();