import { generateClient } from "./generateClient";
import * as console from "console";

const fs = require('fs');

console.log('crd-client-generator-js version: dev-dirty');

const args = process.argv.slice(2);

if (args.length < 2 || args.length > 3) {
  console.log('usage : <apptication> path/to/crd/file.yaml path/to/generated/js/file.ts [typePrefix]');
  process.exit(-1);
}
const crdFile = args[0];
const destinationFile = args[1];
const typePrefix = args[2];

fs.writeFileSync(destinationFile, generateClient(crdFile, destinationFile, typePrefix));
