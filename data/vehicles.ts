// ============================================================
// TAPECARBON — Catálogo Oficial de Veículos (Base Rodalux)
// Modelos nacionais e importados com anos de fabricação
// ============================================================

export interface VehicleRange {
  inicio: number;
  fim: number | null;
}

export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
}

export interface VehicleModel {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  years: number[];
}

export interface SelectedVehicle {
  brand: VehicleBrand | null;
  model: VehicleModel | null;
  year: number | null;
}

export const DADOS_CARROS: Record<string, Record<string, VehicleRange>> = {
  "Fiat": {
    "Uno Vivace": { inicio: 2010, fim: 2016 },
    "Grande Panda (Híbrido)": { inicio: 2025, fim: null },
    "147 (Hatch)": { inicio: 1976, fim: 1987 },
    "147 Pick-Up": { inicio: 1980, fim: 1995 },
    "Oggi (Sedan do 147)": { inicio: 1983, fim: 1985 },
    "Panorama (Perua do 147)": { inicio: 1980, fim: 1986 },
    "Uno (Hatch)": { inicio: 1984, fim: 2021 },
    "Uno Mille": { inicio: 1990, fim: 2013 },
    "Uno Furgão": { inicio: 1988, fim: 2013 },
    "Prêmio (Sedan)": { inicio: 1985, fim: 1996 },
    "Duna (Sedan Argentina)": { inicio: 1987, fim: 1996 },
    "Elba (Perua)": { inicio: 1986, fim: 1996 },
    "Tempra (Sedan)": { inicio: 1990, fim: 1999 },
    "Tempra SW (Perua)": { inicio: 1994, fim: 1997 },
    "Tipo (Hatch)": { inicio: 1988, fim: 1995 },
    "Marea (Sedan)": { inicio: 1996, fim: 2007 },
    "Marea Weekend (Perua)": { inicio: 1998, fim: 2007 },
    "Brava (Hatch)": { inicio: 1999, fim: 2003 },
    "Bravo (Hatch)": { inicio: 2010, fim: 2016 },
    "Stilo (Hatch)": { inicio: 2002, fim: 2010 },
    "Palio (Hatch)": { inicio: 1996, fim: 2018 },
    "Palio Weekend (Perua)": { inicio: 1997, fim: 2018 },
    "Palio Weekend Adventure (Perua)": { inicio: 1999, fim: 2018 },
    "Siena (Sedan)": { inicio: 1997, fim: 2017 },
    "Grand Siena (Sedan)": { inicio: 2012, fim: 2021 },
    "Strada Cabine Simples": { inicio: 1998, fim: null },
    "Strada Cabine Estendida": { inicio: 1999, fim: 2013 },
    "Strada Cabine Dupla 2 Portas": { inicio: 2010, fim: 2020 },
    "Strada Cabine Dupla 3 Portas": { inicio: 2014, fim: 2020 },
    "Strada Nova Cabine Plus (CS)": { inicio: 2020, fim: null },
    "Strada Nova Cabine Dupla (CD)": { inicio: 2020, fim: null },
    "Fiorino (Furgão/Picape - Antiga)": { inicio: 1980, fim: 2013 },
    "Fiorino (Furgão - Nova Geração)": { inicio: 2013, fim: null },
    "Idea (Minivan)": { inicio: 2003, fim: 2016 },
    "Punto (Hatch)": { inicio: 2005, fim: 2018 },
    "Linea (Sedan)": { inicio: 2007, fim: 2017 },
    "500 (Hatch)": { inicio: 2007, fim: null },
    "500e (Elétrico)": { inicio: 2020, fim: null },
    "Toro (Picape)": { inicio: 2016, fim: null },
    "Titano (Picape)": { inicio: 2024, fim: null },
    "Argo (Hatch)": { inicio: 2017, fim: null },
    "Cronos (Sedan)": { inicio: 2018, fim: null },
    "Pulse (SUV)": { inicio: 2021, fim: null },
    "Pulse Abarth (Esportivo)": { inicio: 2022, fim: null },
    "Fastback (SUV Coupé)": { inicio: 2022, fim: null },
    "Fastback Abarth (Esportivo)": { inicio: 2023, fim: null },
    "Mobi (Subcompacto)": { inicio: 2016, fim: null },
    "Doblo Passageiro": { inicio: 2001, fim: 2021 },
    "Doblo Cargo (Furgão)": { inicio: 2002, fim: 2021 },
    "Freemont (SUV)": { inicio: 2011, fim: 2016 }
  },
  "Volkswagen": {
    "Terra (Novo SUV)": { inicio: 2025, fim: null },
    "Fusca (Clássico)": { inicio: 1938, fim: 1986 },
    "Fusca (Itamar)": { inicio: 1993, fim: 1996 },
    "Brasília": { inicio: 1973, fim: 1982 },
    "Variant I": { inicio: 1969, fim: 1977 },
    "Variant II": { inicio: 1977, fim: 1981 },
    "TL": { inicio: 1970, fim: 1976 },
    "SP2 (Esportivo)": { inicio: 1972, fim: 1976 },
    "Karmann Ghia": { inicio: 1962, fim: 1975 },
    "New Beetle": { inicio: 1997, fim: 2011 },
    "Fusca (A5/The Beetle)": { inicio: 2011, fim: 2019 },
    "Kombi (Perua/Furgão)": { inicio: 1950, fim: 2013 },
    "Gol (Hatch - G1 a G8)": { inicio: 1980, fim: 2022 },
    "Voyage (Sedan)": { inicio: 1981, fim: null },
    "Parati (Perua)": { inicio: 1982, fim: 2012 },
    "Saveiro Cabine Simples": { inicio: 1982, fim: null },
    "Saveiro Cabine Estendida": { inicio: 1999, fim: 2014 },
    "Saveiro Cabine Dupla": { inicio: 2014, fim: null },
    "Apollo": { inicio: 1990, fim: 1992 },
    "Logus": { inicio: 1993, fim: 1997 },
    "Pointer": { inicio: 1993, fim: 1996 },
    "Santana (Sedan)": { inicio: 1984, fim: 2006 },
    "Quantum (Perua)": { inicio: 1985, fim: 2003 },
    "Passat (Sedan/Perua - Antigo)": { inicio: 1973, fim: 1988 },
    "Passat (Sedan - Importado)": { inicio: 1994, fim: null },
    "Polo (Hatch)": { inicio: 2002, fim: null },
    "Polo Sedan": { inicio: 2002, fim: 2014 },
    "Polo GTS (Esportivo)": { inicio: 2020, fim: null },
    "Polo Track (Entrada)": { inicio: 2023, fim: null },
    "Virtus (Sedan)": { inicio: 2017, fim: null },
    "Fox (Hatch)": { inicio: 2003, fim: 2021 },
    "CrossFox (Aventureiro)": { inicio: 2005, fim: 2021 },
    "SpaceFox / Space Cross (Perua)": { inicio: 2006, fim: 2019 },
    "Up! (Subcompacto)": { inicio: 2014, fim: 2021 },
    "Golf (Hatch)": { inicio: 1994, fim: 2020 },
    "Bora (Sedan)": { inicio: 2000, fim: 2011 },
    "Jetta (Sedan)": { inicio: 1981, fim: null },
    "Jetta Variant (Perua)": { inicio: 2008, fim: 2014 },
    "T-Cross (SUV Compacto)": { inicio: 2018, fim: null },
    "Nivus (SUV Coupé)": { inicio: 2020, fim: null },
    "Nivus GTS": { inicio: 2025, fim: null },
    "Taos (SUV Médio)": { inicio: 2021, fim: null },
    "Tiguan (SUV - Geração 1)": { inicio: 2007, fim: 2018 },
    "Tiguan Allspace (SUV - 7 Lugares)": { inicio: 2017, fim: null },
    "Touareg (SUV Grande)": { inicio: 2002, fim: 2017 },
    "Amarok Cabine Simples": { inicio: 2010, fim: null },
    "Amarok Cabine Dupla": { inicio: 2010, fim: null },
    "ID.3 (Elétrico Hatch)": { inicio: 2019, fim: null },
    "ID.4 (Elétrico SUV)": { inicio: 2020, fim: null },
    "ID.Buzz (Kombi Elétrica)": { inicio: 2022, fim: null }
  },
  "Chevrolet": {
    "Meriva (Minivan)": { inicio: 2002, fim: 2012 },
    "Blazer EV": { inicio: 2025, fim: null },
    "Equinox EV": { inicio: 2025, fim: null },
    "Opala (Sedan/Coupé)": { inicio: 1968, fim: 1992 },
    "Caravan (Perua)": { inicio: 1975, fim: 1992 },
    "Chevette (Sedan/Hatch)": { inicio: 1973, fim: 1994 },
    "Marajó (Perua)": { inicio: 1981, fim: 1989 },
    "Chevy 500 (Picape)": { inicio: 1983, fim: 1995 },
    "C-10 / C-14": { inicio: 1964, fim: 1984 },
    "Veraneio (SUV)": { inicio: 1964, fim: 1994 },
    "Bonanza (SUV)": { inicio: 1989, fim: 1994 },
    "D20 (Picape)": { inicio: 1985, fim: 1997 },
    "Silverado (Antiga)": { inicio: 1997, fim: 2001 },
    "Nova Silverado (V8)": { inicio: 2023, fim: null },
    "Monza (Sedan/Hatch)": { inicio: 1982, fim: 1996 },
    "Kadett (Hatch)": { inicio: 1989, fim: 1998 },
    "Ipanema (Perua)": { inicio: 1989, fim: 1997 },
    "Omega (Sedan/Perua)": { inicio: 1992, fim: 1998 },
    "Suprema (Perua)": { inicio: 1993, fim: 1996 },
    "Corsa Hatch (Geração 1)": { inicio: 1994, fim: 2002 },
    "Corsa Sedan (Geração 1)": { inicio: 1996, fim: 2001 },
    "Corsa Wagon (Perua)": { inicio: 1997, fim: 2001 },
    "Corsa Hatch (Geração 2 - Novo Corsa)": { inicio: 2002, fim: 2012 },
    "Corsa Sedan (Geração 2 - Classic)": { inicio: 2002, fim: 2016 },
    "Corsa Pickup": { inicio: 1995, fim: 2003 },
    "Tigra (Coupé)": { inicio: 1998, fim: 1999 },
    "Vectra (Geração 1, 2 e 3)": { inicio: 1993, fim: 2011 },
    "Vectra GT (Hatch)": { inicio: 2007, fim: 2011 },
    "Astra Hatch": { inicio: 1998, fim: 2011 },
    "Astra Sedan": { inicio: 1999, fim: 2011 },
    "Celta (Hatch)": { inicio: 2000, fim: 2015 },
    "Prisma (Sedan - 1ª Geração Celta)": { inicio: 2006, fim: 2012 },
    "Onix (Hatch - 1ª Geração)": { inicio: 2012, fim: 2019 },
    "Onix Plus (Sedan - 2ª Geração)": { inicio: 2019, fim: null },
    "Onix Hatch (2ª Geração)": { inicio: 2019, fim: null },
    "Cobalt (Sedan)": { inicio: 2011, fim: 2020 },
    "Agile (Hatch)": { inicio: 2009, fim: 2014 },
    "Montana (Picape Compacta - Geração 1)": { inicio: 2003, fim: 2010 },
    "Montana (Picape Compacta - Geração 2)": { inicio: 2011, fim: 2021 },
    "Nova Montana (Picape Média/Compacta)": { inicio: 2023, fim: null },
    "Spin (Minivan)": { inicio: 2012, fim: null },
    "Cruze (Sedan)": { inicio: 2011, fim: null },
    "Cruze Sport6 (Hatch)": { inicio: 2012, fim: null },
    "Tracker (SUV)": { inicio: 2013, fim: null },
    "Equinox (SUV Médio)": { inicio: 2017, fim: null },
    "S10 Cabine Simples": { inicio: 1995, fim: null },
    "S10 Cabine Dupla": { inicio: 1995, fim: null },
    "Blazer (SUV - Base S10 Geração 1)": { inicio: 1995, fim: 2011 },
    "Trailblazer (SUV - Base S10 Geração 2)": { inicio: 2012, fim: null },
    "Captiva (SUV)": { inicio: 2008, fim: 2017 },
    "Camaro (Esportivo)": { inicio: 2010, fim: null },
    "Bolt (Elétrico)": { inicio: 2017, fim: null }
  },
  "Ford": {
    "Galaxie / Landau": { inicio: 1967, fim: 1983 },
    "Maverick (Antigo V8/4cil)": { inicio: 1973, fim: 1979 },
    "Corcel (Sedan/Coupé)": { inicio: 1968, fim: 1986 },
    "Corcel II (Sedan/Coupé)": { inicio: 1977, fim: 1986 },
    "Belina (Perua)": { inicio: 1970, fim: 1991 },
    "Del Rey (Sedan)": { inicio: 1981, fim: 1991 },
    "Pampa (Picape)": { inicio: 1982, fim: 1997 },
    "F-100": { inicio: 1957, fim: 1986 },
    "F-1000 (Picape)": { inicio: 1979, fim: 1998 },
    "F-250 (Picape)": { inicio: 1998, fim: 2011 },
    "F-150 (Nova Geração)": { inicio: 2023, fim: null },
    "Escort (Hatch/Perua)": { inicio: 1983, fim: 2003 },
    "Escort Hobby": { inicio: 1993, fim: 1996 },
    "Verona (Sedan/Coupé - Base Escort)": { inicio: 1989, fim: 1996 },
    "Versailles (Sedan - Base Santana)": { inicio: 1991, fim: 1996 },
    "Royale (Perua - Base Quantum)": { inicio: 1992, fim: 1996 },
    "Ka (Hatch Compacto - Geração 1)": { inicio: 1996, fim: 2013 },
    "Ka (Hatch Compacto - Geração 2)": { inicio: 2008, fim: 2013 },
    "Ka (Hatch Compacto - Geração 3)": { inicio: 2014, fim: 2021 },
    "Ka Sedan (Geração 3)": { inicio: 2014, fim: 2021 },
    "Fiesta (Hatch - Importado/Street)": { inicio: 1994, fim: 2006 },
    "Fiesta (Hatch - Rocam)": { inicio: 2002, fim: 2014 },
    "Fiesta (New Fiesta)": { inicio: 2011, fim: 2019 },
    "Fiesta Sedan": { inicio: 1999, fim: 2019 },
    "Courier (Picape)": { inicio: 1997, fim: 2013 },
    "Ecosport (SUV Compacto - Geração 1)": { inicio: 2003, fim: 2012 },
    "Ecosport (SUV Compacto - Geração 2)": { inicio: 2012, fim: 2021 },
    "Focus Hatch": { inicio: 1998, fim: 2019 },
    "Focus Sedan": { inicio: 2000, fim: 2019 },
    "Fusion (Sedan Médio/Grande)": { inicio: 2006, fim: 2020 },
    "Edge (SUV)": { inicio: 2008, fim: 2020 },
    "Mondeo (Sedan/Perua)": { inicio: 1993, fim: 2006 },
    "Ranger Cabine Simples": { inicio: 1994, fim: null },
    "Ranger Cabine Estendida": { inicio: 1994, fim: 2012 },
    "Ranger Cabine Dupla": { inicio: 1997, fim: null },
    "Territory (SUV Médio)": { inicio: 2019, fim: null },
    "Bronco Sport (SUV Off-Road)": { inicio: 2020, fim: null },
    "Maverick (Picape Compacta/Média)": { inicio: 2021, fim: null },
    "Mustang (Esportivo Coupé/Conversível)": { inicio: 2017, fim: null },
    "Mustang Mach-E (Elétrico SUV)": { inicio: 2020, fim: null }
  },
  "BMW": {
    "iX1 (Elétrico SUV)": { inicio: 2023, fim: null },
    "Série 1 (Hatch)": { inicio: 2004, fim: null },
    "Série 2 (Coupé/Gran Coupé)": { inicio: 2013, fim: null },
    "Série 3 (Sedan/Perua)": { inicio: 1975, fim: null },
    "Série 4 (Coupé/Conversível)": { inicio: 2013, fim: null },
    "Série 5 (Sedan/Perua)": { inicio: 1972, fim: null },
    "Série 7 (Sedan Luxo)": { inicio: 1977, fim: null },
    "X1 (SUV Compacto)": { inicio: 2009, fim: null },
    "X2 (SUV Compacto)": { inicio: 2018, fim: null },
    "X3 (SUV Médio)": { inicio: 2003, fim: null },
    "X4 (SUV Coupé)": { inicio: 2014, fim: null },
    "X5 (SUV Grande)": { inicio: 1999, fim: null },
    "X6 (SUV Coupé Grande)": { inicio: 2008, fim: null },
    "Z4 (Roadster)": { inicio: 2002, fim: null },
    "M3 (Esportivo)": { inicio: 1986, fim: null },
    "M4 (Esportivo)": { inicio: 2014, fim: null },
    "i3 (Elétrico/Híbrido)": { inicio: 2013, fim: 2022 },
    "i4 (Elétrico Gran Coupé)": { inicio: 2021, fim: null },
    "iX (Elétrico SUV)": { inicio: 2021, fim: null }
  },
  "Audi": {
    "Q6 e-tron": { inicio: 2025, fim: null },
    "A1 (Hatch)": { inicio: 2010, fim: 2022 },
    "A3 Sportback (Hatch)": { inicio: 1996, fim: null },
    "A3 Sedan": { inicio: 2013, fim: null },
    "A4 (Sedan/Perua)": { inicio: 1994, fim: null },
    "A5 (Coupé/Sportback)": { inicio: 2007, fim: null },
    "A6 (Sedan/Perua)": { inicio: 1994, fim: null },
    "A7 Sportback (Coupé 4 Portas)": { inicio: 2010, fim: null },
    "A8 (Sedan Luxo)": { inicio: 1994, fim: null },
    "Q3 (SUV Compacto)": { inicio: 2011, fim: null },
    "Q5 (SUV Médio)": { inicio: 2008, fim: null },
    "Q7 (SUV Grande 7 Lugares)": { inicio: 2005, fim: null },
    "Q8 (SUV Coupé Grande)": { inicio: 2018, fim: null },
    "TT (Coupé/Roadster)": { inicio: 1998, fim: 2023 },
    "R8 (Esportivo)": { inicio: 2006, fim: null },
    "E-Tron (Elétrico SUV)": { inicio: 2018, fim: null },
    "Q4 e-tron": { inicio: 2021, fim: null }
  },
  "Mercedes-Benz": {
    "Classe A (Hatch/Sedan)": { inicio: 1997, fim: null },
    "Classe C (Sedan/Coupé/Perua)": { inicio: 1993, fim: null },
    "Classe E (Sedan/Coupé/Perua)": { inicio: 1953, fim: null },
    "Classe S (Sedan Luxo)": { inicio: 1972, fim: null },
    "CLA (Coupé 4 Portas)": { inicio: 2013, fim: null },
    "GLA (SUV Compacto)": { inicio: 2013, fim: null },
    "GLB (SUV 7 Lugares)": { inicio: 2019, fim: null },
    "GLC (SUV Médio)": { inicio: 2015, fim: null },
    "GLE (SUV Grande)": { inicio: 1997, fim: null },
    "GLS (SUV Luxo 7 Lugares)": { inicio: 2006, fim: null },
    "Classe G (Jipe Off-Road)": { inicio: 1979, fim: null },
    "AMG GT (Esportivo)": { inicio: 2014, fim: null },
    "Sprinter (Van/Furgão)": { inicio: 1995, fim: null },
    "EQA (Elétrico SUV Compacto)": { inicio: 2021, fim: null },
    "EQB (Elétrico SUV 7 Lugares)": { inicio: 2021, fim: null },
    "EQC (Elétrico SUV Médio)": { inicio: 2019, fim: null },
    "EQE (Sedan Elétrico)": { inicio: 2022, fim: null },
    "EQS (Sedan Luxo Elétrico)": { inicio: 2021, fim: null }
  },
  "Volvo": {
    "EX90 (Elétrico SUV Grande)": { inicio: 2024, fim: null },
    "EX30 (Elétrico SUV Subcompacto)": { inicio: 2023, fim: null },
    "C30 (Hatch Coupé)": { inicio: 2006, fim: 2013 },
    "S60 (Sedan)": { inicio: 2000, fim: null },
    "S90 (Sedan Luxo)": { inicio: 2016, fim: null },
    "V40 (Hatch)": { inicio: 2012, fim: 2019 },
    "V60 (Perua)": { inicio: 2010, fim: null },
    "XC40 (SUV Compacto)": { inicio: 2017, fim: null },
    "XC40 Recharge (Elétrico/Híbrido)": { inicio: 2020, fim: null },
    "C40 (SUV Coupé Elétrico)": { inicio: 2021, fim: null },
    "XC60 (SUV Médio)": { inicio: 2008, fim: null },
    "XC90 (SUV Grande 7 Lugares)": { inicio: 2002, fim: null }
  },
  "Land Rover": {
    "Defender (Jipe Off-Road - Antigo)": { inicio: 1983, fim: 2016 },
    "Defender (SUV - Novo)": { inicio: 2020, fim: null },
    "Discovery (SUV Grande)": { inicio: 1989, fim: null },
    "Discovery Sport (SUV Médio)": { inicio: 2014, fim: null },
    "Freelander (SUV)": { inicio: 1997, fim: 2015 },
    "Range Rover Evoque (SUV Compacto)": { inicio: 2011, fim: null },
    "Range Rover Velar (SUV Coupé)": { inicio: 2017, fim: null },
    "Range Rover Sport (SUV Esportivo)": { inicio: 2005, fim: null },
    "Range Rover (SUV Luxo)": { inicio: 1970, fim: null }
  },
  "Porsche": {
    "Macan EV (Elétrico)": { inicio: 2025, fim: null },
    "911 (Coupé/Conversível)": { inicio: 1963, fim: null },
    "Boxster/718 Boxster (Roadster)": { inicio: 1996, fim: null },
    "Cayman/718 Cayman (Coupé)": { inicio: 2005, fim: null },
    "Panamera (Sedan Coupé 4 Portas)": { inicio: 2009, fim: null },
    "Cayenne (SUV Grande)": { inicio: 2002, fim: null },
    "Macan (SUV Compacto)": { inicio: 2014, fim: null },
    "Taycan (Sedan Elétrico)": { inicio: 2019, fim: null }
  },
  "Lexus": {
    "RZ 450e (Elétrico)": { inicio: 2024, fim: null },
    "CT 200h (Hatch Híbrido)": { inicio: 2011, fim: 2022 },
    "IS (Sedan)": { inicio: 1998, fim: null },
    "ES (Sedan Luxo)": { inicio: 1989, fim: null },
    "UX (SUV Compacto/Híbrido)": { inicio: 2018, fim: null },
    "NX (SUV Médio/Híbrido)": { inicio: 2014, fim: null },
    "RX (SUV Grande/Híbrido)": { inicio: 1998, fim: null }
  },
  "Mini": {
    "Cooper (Nova Geração)": { inicio: 2025, fim: null },
    "Countryman (Nova Geração)": { inicio: 2025, fim: null },
    "Cooper (Hatch 3 Portas)": { inicio: 2001, fim: 2024 },
    "Cooper S (Hatch Esportivo)": { inicio: 2001, fim: 2024 },
    "Cooper E/SE (Elétrico)": { inicio: 2020, fim: null },
    "Countryman (SUV Compacto)": { inicio: 2010, fim: 2024 },
    "Clubman (Perua Compacta)": { inicio: 2007, fim: null },
    "Paceman": { inicio: 2012, fim: 2016 }
  },
  "GWM (Great Wall)": {
    "Tank 300 (Jipe)": { inicio: 2025, fim: null },
    "Haval H6 (SUV Híbrido/PHEV)": { inicio: 2023, fim: null },
    "Haval H6 GT (SUV Coupé Híbrido)": { inicio: 2023, fim: null },
    "Ora 03 (Hatch Elétrico)": { inicio: 2023, fim: null },
    "Poer (Picape)": { inicio: 2024, fim: null }
  },
  "JAC Motors": {
    "Hunter (Picape)": { inicio: 2024, fim: null },
    "J2 (Subcompacto)": { inicio: 2012, fim: 2016 },
    "J3 (Hatch)": { inicio: 2011, fim: 2015 },
    "J3 Turin (Sedan)": { inicio: 2011, fim: 2015 },
    "J5 (Sedan)": { inicio: 2011, fim: 2016 },
    "J6 (Minivan)": { inicio: 2011, fim: 2016 },
    "T40/E-JS4 (SUV Compacto)": { inicio: 2016, fim: null },
    "T50/iEV40 (SUV Médio)": { inicio: 2018, fim: null },
    "T60/T80 (SUV Grande)": { inicio: 2019, fim: null },
    "E-JS1 (Hatch Elétrico)": { inicio: 2021, fim: null },
    "V260 (Caminhão Leve)": { inicio: 2017, fim: null }
  },
  "Toyota": {
    "Yaris Cross (SUV Compacto)": { inicio: 2025, fim: null },
    "Yaris Cross Hybrid": { inicio: 2025, fim: null },
    "Corolla (Sedan - Geração 1 em diante)": { inicio: 1966, fim: null },
    "Corolla Fielder (Perua)": { inicio: 2004, fim: 2008 },
    "Corolla Hybrid (Sedan)": { inicio: 2019, fim: null },
    "Corolla Cross (SUV)": { inicio: 2020, fim: null },
    "Corolla Cross Hybrid (SUV)": { inicio: 2020, fim: null },
    "GR Corolla (Hatch Esportivo)": { inicio: 2022, fim: null },
    "GR Yaris (Esportivo)": { inicio: 2021, fim: null },
    "Etios Hatch": { inicio: 2010, fim: 2021 },
    "Etios Sedan": { inicio: 2012, fim: 2021 },
    "Yaris Hatch": { inicio: 2018, fim: null },
    "Yaris Sedan": { inicio: 2018, fim: null },
    "Hilux Cabine Simples": { inicio: 1968, fim: null },
    "Hilux Cabine Dupla": { inicio: 1968, fim: null },
    "Bandeirante (Jipe/Picape)": { inicio: 1962, fim: 2001 },
    "SW4 (SUV - Base Hilux)": { inicio: 1984, fim: null },
    "RAV4 (SUV Compacto)": { inicio: 1994, fim: null },
    "RAV4 Hybrid (SUV Compacto)": { inicio: 2019, fim: null },
    "Camry (Sedan Grande)": { inicio: 1982, fim: null },
    "Prius (Híbrido)": { inicio: 1997, fim: 2022 },
    "Mirai (Hidrogênio)": { inicio: 2014, fim: null }
  },
  "Hyundai": {
    "Palisade (SUV Grande)": { inicio: 2024, fim: null },
    "Ioniq 5": { inicio: 2024, fim: null },
    "HB20 (Hatch)": { inicio: 2012, fim: null },
    "HB20S (Sedan)": { inicio: 2013, fim: null },
    "HB20X (Aventureiro)": { inicio: 2013, fim: 2021 },
    "Creta (SUV Compacto)": { inicio: 2016, fim: null },
    "Creta N Line (Esportivo)": { inicio: 2022, fim: null },
    "Tucson (SUV Compacto - Geração 1)": { inicio: 2004, fim: null },
    "Ix35 (SUV Compacto - Geração 2)": { inicio: 2010, fim: null },
    "New Tucson (SUV Compacto - Geração 3)": { inicio: 2015, fim: null },
    "Santa Fe (SUV Médio)": { inicio: 2000, fim: null },
    "Vera Cruz (SUV Grande)": { inicio: 2007, fim: 2012 },
    "Elantra (Sedan)": { inicio: 1990, fim: null },
    "Azera (Sedan Grande)": { inicio: 1996, fim: 2018 },
    "Sonata (Sedan)": { inicio: 1985, fim: null },
    "Veloster (Hatch 3 Portas)": { inicio: 2011, fim: 2018 },
    "i30 (Hatch)": { inicio: 2007, fim: 2017 },
    "HR (Caminhonete)": { inicio: 2005, fim: null },
    "Kona (SUV Compacto)": { inicio: 2017, fim: null },
    "Ioniq (Híbrido/Elétrico)": { inicio: 2016, fim: null }
  },
  "Honda": {
    "WR-V (Nova Geração)": { inicio: 2025, fim: null },
    "Civic (Sedan/Hatch - Geração 1 em diante)": { inicio: 1972, fim: null },
    "Civic Si (Esportivo)": { inicio: 2007, fim: null },
    "Civic Type R (Esportivo)": { inicio: 2023, fim: null },
    "Accord (Sedan)": { inicio: 1976, fim: null },
    "Fit (Minivan Compacta)": { inicio: 2001, fim: 2021 },
    "City Hatch": { inicio: 2021, fim: null },
    "City Sedan": { inicio: 2009, fim: null },
    "HR-V (SUV Compacto)": { inicio: 2015, fim: null },
    "ZR-V (SUV Médio)": { inicio: 2023, fim: null },
    "CR-V (SUV Médio)": { inicio: 1995, fim: null },
    "Pilot (SUV Grande 7 Lugares)": { inicio: 2002, fim: null }
  },
  "Nissan": {
    "Kicks (Nova Geração)": { inicio: 2025, fim: null },
    "March (Hatch)": { inicio: 2010, fim: 2020 },
    "Versa (Sedan - 1ª Geração)": { inicio: 2011, fim: 2020 },
    "Novo Versa (Sedan - 2ª Geração)": { inicio: 2020, fim: null },
    "Sentra (Sedan)": { inicio: 1982, fim: null },
    "Tiida (Hatch)": { inicio: 2007, fim: 2013 },
    "Altima (Sedan)": { inicio: 1992, fim: null },
    "Kicks (SUV Compacto)": { inicio: 2016, fim: null },
    "Frontier Cabine Simples": { inicio: 1997, fim: 2010 },
    "Frontier Cabine Dupla": { inicio: 1997, fim: null },
    "X-Trail (SUV Médio)": { inicio: 2000, fim: null },
    "Livina (Minivan)": { inicio: 2009, fim: 2014 },
    "Grand Livina (Minivan 7 Lug)": { inicio: 2009, fim: 2014 },
    "Leaf (Elétrico)": { inicio: 2010, fim: null }
  },
  "Renault": {
    "Kardian (SUV Compacto)": { inicio: 2024, fim: null },
    "Megane E-Tech (Elétrico)": { inicio: 2022, fim: null },
    "Clio (Hatch)": { inicio: 1990, fim: 2016 },
    "Clio Sedan": { inicio: 2000, fim: 2009 },
    "Logan (Sedan)": { inicio: 2004, fim: null },
    "Sandero (Hatch)": { inicio: 2007, fim: null },
    "Sandero Stepway (Aventureiro)": { inicio: 2008, fim: null },
    "Sandero RS (Esportivo)": { inicio: 2015, fim: 2021 },
    "Duster (SUV Compacto)": { inicio: 2010, fim: null },
    "Duster Oroch (Picape)": { inicio: 2015, fim: null },
    "Megane (Sedan/Hatch/Perua)": { inicio: 1995, fim: 2010 },
    "Fluence (Sedan)": { inicio: 2011, fim: 2018 },
    "Kwid (Subcompacto)": { inicio: 2015, fim: null },
    "Captur (SUV Compacto)": { inicio: 2016, fim: 2023 },
    "Koleos (SUV Médio)": { inicio: 2007, fim: null },
    "Kangoo (Furgão/Passageiro)": { inicio: 1997, fim: null },
    "Master (Furgão/Van)": { inicio: 1997, fim: null },
    "Zoe (Elétrico)": { inicio: 2012, fim: null }
  },
  "Jeep": {
    "Avenger (SUV Compacto)": { inicio: 2025, fim: null },
    "Renegade (SUV Compacto)": { inicio: 2014, fim: null },
    "Compass (SUV Médio)": { inicio: 2006, fim: null },
    "Commander (SUV 7 Lugares)": { inicio: 2021, fim: null },
    "Wrangler (Jipe)": { inicio: 1986, fim: null },
    "Cherokee (SUV)": { inicio: 1974, fim: null },
    "Grand Cherokee (SUV Grande)": { inicio: 1992, fim: null },
    "Gladiator (Picape)": { inicio: 2020, fim: null }
  },
  "Peugeot": {
    "e-2008 (Nova Geração)": { inicio: 2024, fim: null },
    "205 (Hatch)": { inicio: 1983, fim: 1998 },
    "206 (Hatch/Sedan/Perua)": { inicio: 1998, fim: 2012 },
    "207 (Hatch/Sedan/Perua)": { inicio: 2006, fim: 2014 },
    "208 (Hatch)": { inicio: 2012, fim: null },
    "306 (Hatch/Sedan/Perua)": { inicio: 1993, fim: 2002 },
    "307 (Hatch/Sedan)": { inicio: 2001, fim: 2008 },
    "308 (Hatch/Perua)": { inicio: 2007, fim: null },
    "408 (Sedan)": { inicio: 2010, fim: null },
    "2008 (SUV Compacto)": { inicio: 2013, fim: null },
    "3008 (SUV Médio)": { inicio: 2008, fim: null },
    "5008 (SUV 7 Lugares)": { inicio: 2009, fim: null },
    "Hoggar (Picape)": { inicio: 2010, fim: 2014 },
    "Partner (Furgão/Passageiro)": { inicio: 1996, fim: null },
    "Boxer (Van)": { inicio: 1994, fim: null }
  },
  "Citroën": {
    "Basalt (SUV Coupé)": { inicio: 2024, fim: null },
    "C3 (Hatch)": { inicio: 2002, fim: null },
    "C3 Aircross (SUV/Monovolume)": { inicio: 2010, fim: null },
    "Novo C3 Aircross (SUV 7 Lug)": { inicio: 2023, fim: null },
    "C4 Hatch": { inicio: 2004, fim: 2014 },
    "C4 Pallas (Sedan)": { inicio: 2007, fim: 2013 },
    "C4 Lounge (Sedan)": { inicio: 2013, fim: 2021 },
    "C4 Cactus (Crossover)": { inicio: 2014, fim: null },
    "Xsara (Hatch/Perua)": { inicio: 1997, fim: 2005 },
    "Xsara Picasso (Minivan)": { inicio: 1999, fim: 2012 },
    "C5 (Sedan/Perua)": { inicio: 2001, fim: 2012 },
    "C5 Aircross (SUV Médio)": { inicio: 2017, fim: null },
    "Berlingo (Furgão/Passageiro)": { inicio: 1996, fim: null },
    "Jumpy (Furgão)": { inicio: 2017, fim: null }
  },
  "Kia": {
    "EV9 (SUV Elétrico)": { inicio: 2024, fim: null },
    "EV5": { inicio: 2025, fim: null },
    "Picanto (Subcompacto)": { inicio: 2004, fim: null },
    "Rio (Hatch/Sedan)": { inicio: 1999, fim: null },
    "Cerato (Sedan)": { inicio: 2003, fim: null },
    "Optima (Sedan)": { inicio: 2000, fim: 2020 },
    "Sportage (SUV Compacto)": { inicio: 1993, fim: null },
    "Sorento (SUV Médio 7 Lugares)": { inicio: 2002, fim: null },
    "Mohave (SUV Grande)": { inicio: 2008, fim: 2017 },
    "Soul (Crossover)": { inicio: 2008, fim: null },
    "Stonic (Crossover Compacto)": { inicio: 2017, fim: null },
    "Carnival (Minivan)": { inicio: 1998, fim: null },
    "Bongo K2500 (Caminhonete Leve)": { inicio: 1980, fim: null }
  },
  "Mitsubishi": {
    "L200 Triton (Nova Geração)": { inicio: 2025, fim: null },
    "L200 (Picape - Geração 1)": { inicio: 1978, fim: null },
    "L200 Triton (Picape - Geração 4 em diante)": { inicio: 2005, fim: null },
    "Pajero (SUV - Geração 1 e 2)": { inicio: 1982, fim: null },
    "Pajero Full (SUV Grande)": { inicio: 1999, fim: 2021 },
    "Pajero Sport (SUV - Base L200)": { inicio: 1996, fim: null },
    "Pajero TR4 (SUV Compacto - Base Jimny)": { inicio: 1999, fim: 2015 },
    "Pajero Dakar": { inicio: 2009, fim: 2016 },
    "ASX (SUV Compacto)": { inicio: 2010, fim: null },
    "Outlander (SUV Médio)": { inicio: 2001, fim: null },
    "Eclipse Cross (SUV Coupé)": { inicio: 2017, fim: null },
    "Lancer (Sedan)": { inicio: 2007, fim: 2017 }
  },
  "Subaru": {
    "Impreza (Sedan/Hatch)": { inicio: 1992, fim: null },
    "Legacy (Sedan/Perua)": { inicio: 1989, fim: null },
    "Forester (SUV Compacto)": { inicio: 1997, fim: null },
    "Outback (Perua Aventureira)": { inicio: 1994, fim: null },
    "XV / Crosstrek (Crossover)": { inicio: 2011, fim: null },
    "BRZ (Coupé Esportivo)": { inicio: 2012, fim: null },
    "WRX (Esportivo)": { inicio: 1992, fim: null }
  },
  "Suzuki": {
    "Vitara (SUV)": { inicio: 1988, fim: null },
    "Grand Vitara (SUV)": { inicio: 1998, fim: null },
    "Swift (Hatch)": { inicio: 1983, fim: null },
    "Jimny (Jipe - Geração 3)": { inicio: 1970, fim: null },
    "Jimny Sierra (Jipe - Geração 4)": { inicio: 2018, fim: null },
    "SX4 (Crossover)": { inicio: 2006, fim: 2014 },
    "S-Cross (Crossover)": { inicio: 2013, fim: null }
  },
  "Caoa Chery": {
    "Tiggo 2 (SUV)": { inicio: 2017, fim: 2023 },
    "Tiggo 3X (SUV)": { inicio: 2021, fim: 2022 },
    "Tiggo 5X (SUV)": { inicio: 2018, fim: 2020 },
    "Tiggo 5X Pro": { inicio: 2022, fim: null },
    "Tiggo 5X Pro Hybrid": { inicio: 2022, fim: null },
    "Tiggo 5X Sport": { inicio: 2023, fim: null },
    "Tiggo 7 (SUV)": { inicio: 2019, fim: 2021 },
    "Tiggo 7 Pro": { inicio: 2021, fim: null },
    "Tiggo 7 Pro Hybrid": { inicio: 2022, fim: null },
    "Tiggo 7 Sport": { inicio: 2024, fim: null },
    "Tiggo 8 (SUV 7 Lug)": { inicio: 2020, fim: null },
    "Tiggo 8 Pro Plug-in Hybrid": { inicio: 2022, fim: null },
    "Tiggo 8 Pro (Combustão)": { inicio: 2024, fim: null },
    "Tiggo 8 Max Drive": { inicio: 2022, fim: null },
    "Arrizo 5 (Sedan)": { inicio: 2018, fim: 2021 },
    "Arrizo 5 RX/RXT": { inicio: 2018, fim: 2021 },
    "Arrizo 6 (Sedan)": { inicio: 2020, fim: 2022 },
    "Arrizo 6 Pro": { inicio: 2021, fim: null },
    "Arrizo 6 Pro Hybrid": { inicio: 2022, fim: null },
    "iCar (Elétrico)": { inicio: 2022, fim: null },
    "QQ (Subcompacto)": { inicio: 2011, fim: 2019 },
    "Celer (Hatch/Sedan)": { inicio: 2013, fim: 2018 },
    "Face (Hatch)": { inicio: 2010, fim: 2015 },
    "Cielo (Hatch/Sedan)": { inicio: 2010, fim: 2012 }
  },
  "BYD": {
    "King (Sedan Híbrido)": { inicio: 2024, fim: null },
    "Shark (Picape Híbrida)": { inicio: 2024, fim: null },
    "Dolphin Mini (Elétrico Hatch)": { inicio: 2023, fim: null },
    "Dolphin (Elétrico Hatch)": { inicio: 2021, fim: null },
    "Dolphin Plus (Elétrico Hatch)": { inicio: 2023, fim: null },
    "Han (Elétrico Sedan)": { inicio: 2020, fim: null },
    "Seal (Elétrico Sedan)": { inicio: 2022, fim: null },
    "Song Plus (Híbrido SUV)": { inicio: 2020, fim: null },
    "Song Pro (Híbrido SUV)": { inicio: 2020, fim: null },
    "Yuan Plus (Elétrico SUV)": { inicio: 2021, fim: null },
    "Tan (SUV Elétrico 7 Lug)": { inicio: 2020, fim: null }
  },
  "Foton": {
    "Tunland Cabine Simples (Picape)": { inicio: 2013, fim: null },
    "Tunland Cabine Dupla (Picape)": { inicio: 2013, fim: null }
  },
  "Geely": {
    "EX2 (Elétrico)": { inicio: 2025, fim: null },
    "EX5 (Elétrico)": { inicio: 2023, fim: null },
    "EC7 (Sedan)": { inicio: 2009, fim: null }
  },
  "Ram": {
    "2500 Cabine Dupla (Picape Grande)": { inicio: 2003, fim: null },
    "3500 Cabine Dupla (Picape Heavy Duty)": { inicio: 2022, fim: null },
    "1500 Rebel (Picape)": { inicio: 2021, fim: null },
    "1500 Limited (Picape)": { inicio: 2021, fim: null },
    "Classic (Picape V8)": { inicio: 2022, fim: null },
    "Rampage Cabine Dupla (Picape Compacta/Média)": { inicio: 2023, fim: null }
  },
  "Haval": {
    "H6 (SUV)": { inicio: 2011, fim: null },
    "H6 GT (SUV Coupé)": { inicio: 2022, fim: null },
    "H6 HEV (Híbrido)": { inicio: 2023, fim: null },
    "H6 PHEV (Híbrido Plug-in)": { inicio: 2023, fim: null },
    "Jolion (SUV Compacto)": { inicio: 2020, fim: null }
  },
  "Troller": {
    "T4 (Jipe)": { inicio: 1997, fim: 2021 },
    "Pantanal (Picape)": { inicio: 2006, fim: 2008 }
  }
};

export const VEHICLE_BRANDS: string[] = Object.keys(DADOS_CARROS).sort((a, b) =>
  a.localeCompare(b, 'pt-BR')
);

export function getModelsForBrand(brand: string): string[] {
  if (!brand || !DADOS_CARROS[brand]) return [];
  return Object.keys(DADOS_CARROS[brand]).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function getYearsForModel(brand: string, model: string): string[] {
  const info = DADOS_CARROS[brand]?.[model];
  if (!info) {
    const current = new Date().getFullYear() + 1;
    const fallback: string[] = [];
    for (let a = current; a >= 1970; a--) fallback.push(String(a));
    return fallback;
  }
  const inicio = Number(info.inicio);
  const fim = info.fim === null ? new Date().getFullYear() + 1 : Number(info.fim);
  const anos: string[] = [];
  for (let a = fim; a >= inicio; a--) anos.push(String(a));
  return anos;
}

export const getModelsByBrand = (brandIdOrName: string) => {
  // Can be brand name (e.g. "Fiat") or slug (e.g. "fiat")
  const direct = getModelsForBrand(brandIdOrName);
  if (direct.length > 0) return direct.map(m => ({ id: m, name: m, slug: m }));
  const matchedBrand = VEHICLE_BRANDS.find(b => b.toLowerCase().replace(/[^a-z0-9]+/g, '-') === brandIdOrName.toLowerCase());
  if (matchedBrand) {
    return getModelsForBrand(matchedBrand).map(m => ({ id: m, name: m, slug: m }));
  }
  return [];
};

export const getYearsByModel = (brandOrSlug: string, modelOrSlug: string) => {
  return getYearsForModel(brandOrSlug, modelOrSlug);
};

export interface SearchIndexItem {
  marca: string;
  modelo: string;
  chave: string;
}

export function normalizeText(s: string): string {
  return String(s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

let searchIndexCache: SearchIndexItem[] | null = null;

export function getSearchIndex(): SearchIndexItem[] {
  if (searchIndexCache) return searchIndexCache;
  const list: SearchIndexItem[] = [];
  Object.keys(DADOS_CARROS).forEach((marca) => {
    Object.keys(DADOS_CARROS[marca]).forEach((modelo) => {
      list.push({
        marca,
        modelo,
        chave: normalizeText(`${marca} ${modelo}`)
      });
    });
  });
  searchIndexCache = list;
  return list;
}

export function searchVehicles(term: string, limit: number = 8): SearchIndexItem[] {
  const parts = normalizeText(term).split(/\s+/).filter(Boolean);
  if (!parts.length) return [];
  return getSearchIndex()
    .filter((it) => parts.every((p) => it.chave.includes(p)))
    .slice(0, limit);
}

// ────────────────────────────────────────────────────────────
// Compatibilidade com componentes legados
// ────────────────────────────────────────────────────────────
export const MOCK_BRANDS: VehicleBrand[] = VEHICLE_BRANDS.map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
}));

export const MOCK_MODELS: VehicleModel[] = [];
Object.entries(DADOS_CARROS).forEach(([brand, models]) => {
  const brandId = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  Object.entries(models).forEach(([modelName, range]) => {
    const inicio = Number(range.inicio);
    const fim = range.fim === null ? new Date().getFullYear() + 1 : Number(range.fim);
    const years: number[] = [];
    for (let y = fim; y >= inicio; y--) years.push(y);
    MOCK_MODELS.push({
      id: `${brandId}-${modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      name: modelName,
      slug: modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      brandId,
      years
    });
  });
});
