import pkg from '@e-invoice-eu/core';
import fs from 'fs';
fs.writeFileSync('mapping-schema.json', JSON.stringify(pkg.mappingSchema, null, 2));
