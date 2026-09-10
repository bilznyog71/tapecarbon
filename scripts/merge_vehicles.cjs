const fs = require('fs');
const path = require('path');

// 1. Read NobreCar data
const nobreRaw = fs.readFileSync(path.join(__dirname, 'nobrecar_dados.js'), 'utf8');
const nobreMatch = nobreRaw.match(/const dadosCarros\s*=\s*(\{[\s\S]*?\});/);
if (!nobreMatch) {
  console.error('Could not find dadosCarros in scripts/nobrecar_dados.js');
  process.exit(1);
}
const dadosCarros = eval('(' + nobreMatch[1] + ')');

// 2. Read current data/vehicles.ts
const currentVehiclesPath = path.join(__dirname, '..', 'data', 'vehicles.ts');
const currentCode = fs.readFileSync(currentVehiclesPath, 'utf8');

const startIndex = currentCode.indexOf('export const MOCK_MODELS: VehicleModel[] = [');
const endIndex = currentCode.indexOf('\n]\n\nexport function getModelsByBrand');
const rawModels = currentCode.substring(startIndex + 'export const MOCK_MODELS: VehicleModel[] = '.length, endIndex + 2);

const range = (start, end = 2026) => {
  const arr = [];
  const min = Math.max(2000, start);
  for (let y = end; y >= min; y--) arr.push(y);
  return arr;
};
const existingModels = eval(rawModels);

const brandsMatch = currentCode.match(/export const MOCK_BRANDS: VehicleBrand\[\] = (\[[\s\S]*?\])\.sort/);
const existingBrands = eval(brandsMatch[1]);

// Map of NobreCar brand names to internal brand configs
const brandConfig = {
  'Abarth': { id: 'abarth', name: 'Abarth', slug: 'abarth' },
  'Alfa Romeo': { id: 'alfa-romeo', name: 'Alfa Romeo', slug: 'alfa-romeo' },
  'Alpine': { id: 'alpine', name: 'Alpine', slug: 'alpine' },
  'Aston Martin': { id: 'aston-martin', name: 'Aston Martin', slug: 'aston-martin' },
  'Audi': { id: 'audi', name: 'Audi', slug: 'audi' },
  'Bentley': { id: 'bentley', name: 'Bentley', slug: 'bentley' },
  'BMW': { id: 'bmw', name: 'BMW', slug: 'bmw' },
  'BYD': { id: 'byd', name: 'BYD', slug: 'byd' },
  'Cadillac': { id: 'cadillac', name: 'Cadillac', slug: 'cadillac' },
  'Caoa Chery': { id: 'caoa-chery', name: 'Caoa Chery', slug: 'caoa-chery' },
  'Chevrolet': { id: 'chevrolet', name: 'Chevrolet', slug: 'chevrolet' },
  'Chrysler': { id: 'chrysler', name: 'Chrysler', slug: 'chrysler' },
  'Citroën': { id: 'citroen', name: 'Citroën', slug: 'citroen' },
  'Cupra': { id: 'cupra', name: 'Cupra', slug: 'cupra' },
  'Dacia': { id: 'dacia', name: 'Dacia', slug: 'dacia' },
  'Daewoo': { id: 'daewoo', name: 'Daewoo', slug: 'daewoo' },
  'Daihatsu': { id: 'daihatsu', name: 'Daihatsu', slug: 'daihatsu' },
  'Dodge': { id: 'dodge', name: 'Dodge', slug: 'dodge' },
  'DS Automobiles': { id: 'ds', name: 'DS Automobiles', slug: 'ds' },
  'Ferrari': { id: 'ferrari', name: 'Ferrari', slug: 'ferrari' },
  'Fiat': { id: 'fiat', name: 'Fiat', slug: 'fiat' },
  'Ford': { id: 'ford', name: 'Ford', slug: 'ford' },
  'Genesis': { id: 'genesis', name: 'Genesis', slug: 'genesis' },
  'Great Wall': { id: 'gwm', name: 'GWM', slug: 'gwm' },
  'GWM': { id: 'gwm', name: 'GWM', slug: 'gwm' },
  'Honda': { id: 'honda', name: 'Honda', slug: 'honda' },
  'Hyundai': { id: 'hyundai', name: 'Hyundai', slug: 'hyundai' },
  'Ineos': { id: 'ineos', name: 'Ineos', slug: 'ineos' },
  'Isuzu': { id: 'isuzu', name: 'Isuzu', slug: 'isuzu' },
  'Iveco': { id: 'iveco', name: 'Iveco', slug: 'iveco' },
  'JAC Motors': { id: 'jac', name: 'JAC Motors', slug: 'jac' },
  'Jaecoo': { id: 'jaecoo', name: 'Jaecoo', slug: 'jaecoo' },
  'Jaguar': { id: 'jaguar', name: 'Jaguar', slug: 'jaguar' },
  'Jeep': { id: 'jeep', name: 'Jeep', slug: 'jeep' },
  'Kia': { id: 'kia', name: 'Kia', slug: 'kia' },
  'Lada': { id: 'lada', name: 'Lada', slug: 'lada' },
  'Lamborghini': { id: 'lamborghini', name: 'Lamborghini', slug: 'lamborghini' },
  'Lancia': { id: 'lancia', name: 'Lancia', slug: 'lancia' },
  'Land Rover': { id: 'land-rover', name: 'Land Rover', slug: 'land-rover' },
  'Leapmotor': { id: 'leapmotor', name: 'Leapmotor', slug: 'leapmotor' },
  'Lexus': { id: 'lexus', name: 'Lexus', slug: 'lexus' },
  'Lynk & Co': { id: 'lynk-co', name: 'Lynk & Co', slug: 'lynk-co' },
  'Maserati': { id: 'maserati', name: 'Maserati', slug: 'maserati' },
  'Maxus': { id: 'maxus', name: 'Maxus', slug: 'maxus' },
  'Mazda': { id: 'mazda', name: 'Mazda', slug: 'mazda' },
  'Mercedes-Benz': { id: 'mercedes', name: 'Mercedes-Benz', slug: 'mercedes' },
  'MG': { id: 'mg', name: 'MG', slug: 'mg' },
  'Mini': { id: 'mini', name: 'Mini', slug: 'mini' },
  'Mitsubishi': { id: 'mitsubishi', name: 'Mitsubishi', slug: 'mitsubishi' },
  'NIO': { id: 'nio', name: 'NIO', slug: 'nio' },
  'Nissan': { id: 'nissan', name: 'Nissan', slug: 'nissan' },
  'Omoda': { id: 'omoda', name: 'Omoda', slug: 'omoda' },
  'Opel': { id: 'opel', name: 'Opel', slug: 'opel' },
  'Peugeot': { id: 'peugeot', name: 'Peugeot', slug: 'peugeot' },
  'Polestar': { id: 'polestar', name: 'Polestar', slug: 'polestar' },
  'Porsche': { id: 'porsche', name: 'Porsche', slug: 'porsche' },
  'Proton': { id: 'proton', name: 'Proton', slug: 'proton' },
  'RAM': { id: 'ram', name: 'RAM', slug: 'ram' },
  'Renault': { id: 'renault', name: 'Renault', slug: 'renault' },
  'Rolls-Royce': { id: 'rolls-royce', name: 'Rolls-Royce', slug: 'rolls-royce' },
  'Rover': { id: 'rover', name: 'Rover', slug: 'rover' },
  'Saab': { id: 'saab', name: 'Saab', slug: 'saab' },
  'Seat': { id: 'seat', name: 'Seat', slug: 'seat' },
  'Smart': { id: 'smart', name: 'Smart', slug: 'smart' },
  'SsangYong / KGM': { id: 'ssangyong', name: 'SsangYong / KGM', slug: 'ssangyong' },
  'Subaru': { id: 'subaru', name: 'Subaru', slug: 'subaru' },
  'Suzuki': { id: 'suzuki', name: 'Suzuki', slug: 'suzuki' },
  'Tata': { id: 'tata', name: 'Tata', slug: 'tata' },
  'Tesla': { id: 'tesla', name: 'Tesla', slug: 'tesla' },
  'Toyota': { id: 'toyota', name: 'Toyota', slug: 'toyota' },
  'Troller': { id: 'troller', name: 'Troller', slug: 'troller' },
  'Volkswagen': { id: 'volkswagen', name: 'Volkswagen', slug: 'volkswagen' },
  'Volvo': { id: 'volvo', name: 'Volvo', slug: 'volvo' },
  'Xpeng': { id: 'xpeng', name: 'Xpeng', slug: 'xpeng' },
  'Škoda': { id: 'skoda', name: 'Škoda', slug: 'skoda' },
};

// 1. Merge Brands
const brandsMap = new Map();
// Add all existing brands first
for (const b of existingBrands) {
  brandsMap.set(b.id, b);
}
// Add NobreCar brands
for (const [nobreName, cfg] of Object.entries(brandConfig)) {
  if (!brandsMap.has(cfg.id)) {
    brandsMap.set(cfg.id, { id: cfg.id, name: cfg.name, slug: cfg.slug });
  }
}

// 2. Helper functions for model normalization and slugification
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function cleanBaseKey(name) {
  const primary = name.split('/')[0];
  return primary
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\b(novo|nova|new|hatch|sedan|pick-up|pickup|eletrico|cabine|dupla|simples)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

// 3. Process Models
const modelCatalogByBrand = new Map();

function registerExistingModel(m) {
  const list = modelCatalogByBrand.get(m.brandId) || [];
  list.push({
    id: m.id,
    name: m.name,
    slug: m.slug,
    brandId: m.brandId,
    startYear: Math.min(...m.years),
    endYear: Math.max(...m.years),
    isExisting: true
  });
  modelCatalogByBrand.set(m.brandId, list);
}

existingModels.forEach(registerExistingModel);

// Process NobreCar models
let addedFromNobre = 0;
let mergedFromNobre = 0;

for (const [nobreBrandName, models] of Object.entries(dadosCarros)) {
  const cfg = brandConfig[nobreBrandName];
  if (!cfg) continue;
  const brandId = cfg.id;

  const brandModels = modelCatalogByBrand.get(brandId) || [];

  for (const [nobreModelName, yearsObj] of models) {
    const rawFim = yearsObj.fim;
    const rawInicio = yearsObj.inicio;

    // Filter out obsolete models that ended before 2000
    if (rawFim !== null && rawFim < 2000) {
      continue;
    }

    const startYear = Math.max(2000, rawInicio || 2000);
    const endYear = rawFim === null ? 2026 : Math.min(2026, rawFim);

    if (startYear > endYear) continue;

    // Clean up NobreCar Portuguese model name for Brazilian context
    let displayName = nobreModelName
      .replace(/\(Carrinha \/ SW\)/g, '(SW / Perua)')
      .replace(/\(Carrinha\)/g, '(Perua / SW)')
      .replace(/\s*\(2 lugares\)/g, '')
      .replace(/\s*\(4 lugares\)/g, '')
      .replace(/\s*\(3 lugares\)/g, '')
      .replace(/\s*\(5 lugares\)/g, '')
      .replace(/\s*\(Pick-up\)/g, '')
      .trim();

    // Check if there is already a matching model in this brand
    const nobreKey = cleanBaseKey(displayName);
    const existing = brandModels.find(m => {
      const existingKey = cleanBaseKey(m.name);
      return existingKey === nobreKey && existingKey.length > 1;
    });

    if (existing) {
      // Merge years
      existing.startYear = Math.min(existing.startYear, startYear);
      existing.endYear = Math.max(existing.endYear, endYear);
      mergedFromNobre++;
    } else {
      // Check if another model in brandModels has exact same displayName
      const exactMatch = brandModels.find(m => m.name.toLowerCase() === displayName.toLowerCase());
      if (exactMatch) {
        exactMatch.startYear = Math.min(exactMatch.startYear, startYear);
        exactMatch.endYear = Math.max(exactMatch.endYear, endYear);
        mergedFromNobre++;
        continue;
      }

      // Create new model
      let baseSlug = slugify(displayName);
      if (!baseSlug) baseSlug = 'model-' + Math.floor(Math.random() * 1000);
      let modelId = `${brandId}-${baseSlug}`;

      // Ensure unique model ID
      let counter = 1;
      while (brandModels.some(m => m.id === modelId)) {
        modelId = `${brandId}-${baseSlug}-${counter++}`;
      }

      brandModels.push({
        id: modelId,
        name: displayName,
        slug: baseSlug,
        brandId: brandId,
        startYear: startYear,
        endYear: endYear,
        isExisting: false
      });
      addedFromNobre++;
    }
  }

  modelCatalogByBrand.set(brandId, brandModels);
}

console.log(`Merged models: ${mergedFromNobre} updated, ${addedFromNobre} new models added.`);

// Flatten all models and verify
const finalModels = [];
const brandList = Array.from(brandsMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

for (const brand of brandList) {
  const models = modelCatalogByBrand.get(brand.id) || [];
  // Sort models alphabetically
  models.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  for (const m of models) {
    finalModels.push(m);
  }
}

console.log(`Total final brands: ${brandList.length}`);
console.log(`Total final models: ${finalModels.length}`);

// Generate TypeScript code
let tsCode = `// ============================================================
// TAPECARBON — Catálogo Completo de Veículos (Brasil 2000–2026)
// Modelos nacionais e importados com anos de 2000 a 2026
// Integrado com catálogo completo NobreCar + Mercado Brasileiro
// ============================================================

export interface VehicleBrand {
  id: string
  name: string
  slug: string
}

export interface VehicleModel {
  id: string
  name: string
  slug: string
  brandId: string
  years: number[]
}

export interface SelectedVehicle {
  brand: VehicleBrand | null
  model: VehicleModel | null
  year: number | null
}

// Gerador de anos decrescente
function range(start: number, end: number = 2026): number[] {
  const years: number[] = []
  const minYear = Math.max(2000, start)
  for (let y = end; y >= minYear; y--) {
    years.push(y)
  }
  return years
}

// ────────────────────────────────────────────────────────────
// MARCAS DISPONÍVEIS (NACIONAIS E IMPORTADOS)
// ────────────────────────────────────────────────────────────
export const MOCK_BRANDS: VehicleBrand[] = [
`;

for (const b of brandList) {
  tsCode += `  { id: '${b.id}', name: '${b.name.replace(/'/g, "\\'")}', slug: '${b.slug}' },\n`;
}

tsCode += `].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))

// ────────────────────────────────────────────────────────────
// MODELOS DISPONÍVEIS (2000 A 2026)
// ────────────────────────────────────────────────────────────
export const MOCK_MODELS: VehicleModel[] = [
`;

let currentBrandId = '';
for (const m of finalModels) {
  if (m.brandId !== currentBrandId) {
    currentBrandId = m.brandId;
    const brandObj = brandList.find(b => b.id === currentBrandId);
    tsCode += `\n  // ── ${brandObj ? brandObj.name.toUpperCase() : currentBrandId.toUpperCase()} ──\n`;
  }
  tsCode += `  { id: '${m.id}', name: '${m.name.replace(/'/g, "\\'")}', slug: '${m.slug}', brandId: '${m.brandId}', years: range(${m.startYear}, ${m.endYear}) },\n`;
}

tsCode += `]

export function getModelsByBrand(brandId: string): VehicleModel[] {
  return MOCK_MODELS
    .filter(model => model.brandId === brandId)
    .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

export function getYearsByModel(modelId: string): number[] {
  const model = MOCK_MODELS.find(m => m.id === modelId)
  if (model && model.years && model.years.length > 0) {
    return [...model.years].sort((a, b) => b - a)
  }
  // Fallback para todos os anos de 2026 a 2000
  return Array.from({ length: 27 }, (_, i) => 2026 - i)
}
`;

fs.writeFileSync(currentVehiclesPath, tsCode, 'utf8');
console.log(`Successfully updated ${currentVehiclesPath}!`);
