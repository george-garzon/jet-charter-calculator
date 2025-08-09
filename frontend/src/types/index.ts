// src/types/index.ts
export type Airport = { icao: string; fees: number; rwy: number };
export type Jet = { category: string; model: string };

export type Catalog = {
    airports: Airport[];
    jets: Jet[];
};

export type PricePayload = {
    depart_icao: string;
    arrive_icao: string;
    jet_model: string;
    avg_wind_kts: number;
    margin_pct: number;
    taxi_min: number;
    reposition_nm: number;
    oat_c_depart: number;
    oat_c_arrive: number;
};

export type PriceResult = {
    error?: string;
    route?: { depart: string; arrive: string; distance_nm: number };
    aircraft?: { category: string; model: string; speed_kts: number };
    assumptions?: {
        avg_wind_kts: number;
        taxi_min: number;
        reposition_nm: number;
        margin_pct: number;
        oat_c_depart?: number;
        oat_c_arrive?: number;
        density_altitude_ft?: { depart: number; arrive: number };
        required_runway_ft?: number;
    };
    time?: { air_time_hr: number; taxi_hr: number; block_hr: number };
    costs?: { doc_total: number; airport_fees: number; fuel_surcharge?: number; cost_basis: number };
    sell_price_usd?: number;
    ml_prediction_usd?: number;
    ml_delta_usd?: number;
};

export type OptimizerAircraft = { tail: string; position: string };
export type OptimizerLeg = { id: string; start: string; end: string; etd?: string; eta?: string };

export type OptimizerResponse = {
    error?: string;
    assignment?: Record<string, string[]>;
    objective_nm?: number;
};
