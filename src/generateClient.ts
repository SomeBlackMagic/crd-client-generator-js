import Generator from "openapi-to-flowtype/dist/Generator";
import {
  V1beta1CustomResourceDefinition,
  V1CustomResourceDefinition
} from "@kubernetes/client-node";
const YAML = require("yaml");
const fs = require("fs");
const prettier = require("prettier");
const merge = require('deepmerge')

export const DEFAULT_PRETTIER_OPTIONS = {
  parser: "typescript",
};

export function generateClient(
  crdFile: string,
  destinationFile: string,
  prefix?: string
) {
  const prettierOptions = {
    ...DEFAULT_PRETTIER_OPTIONS,
    ...(prettier.resolveConfig.sync(destinationFile) || {}),
  };

  const file = fs.readFileSync(crdFile, "utf8");
  const crdSpec = YAML.parse(file) as V1beta1CustomResourceDefinition &
    V1CustomResourceDefinition;

  const generator = new Generator();

  const versions = crdSpec.spec.version
    ? [crdSpec.spec.version]
    : (crdSpec.spec.versions || []).map((version) => version.name);
  const jsonSchemas = crdSpec.spec.version
    ? { [crdSpec.spec.version]: crdSpec.spec.validation.openAPIV3Schema }
    : (crdSpec.spec.versions || []).reduce(
        (aggregatedJsonSchemas, version) => ({
          ...aggregatedJsonSchemas,
          [version.name]:
            version.schema?.openAPIV3Schema ||
            crdSpec.spec.validation.openAPIV3Schema,
        }),
        {}
      );

  const generateClientHeader = `
  // /!\\ WARNING :  THIS FILE IS AUTOGENERATED FROM A KUBERNETES CUSTOM RESOURCE DEFINITION FILE. DO NOT CHANGE IT, use crd-client-generator-ts to update it.
  import { CustomObjectsApi } from '@kubernetes/client-node/dist/gen/api/customObjectsApi';
  export type Result<T> = T | {error: any};
  
  `;

  const versionsClients = versions.map((version) => {
    const jsonSchema = jsonSchemas[version];
    const typePrefix =
      (prefix || "") + version.replace(/^\w/, (c) => c.toUpperCase());

    const isClusterScoped = crdSpec.spec.scope === "Cluster";
    const isNamespacedScoped = crdSpec.spec.scope === "Namespaced";

    const clusterOrNamespacedCustomObject = isClusterScoped
      ? `ClusterCustomObject(
    '${crdSpec.spec.group}',
    '${version}',
    '${crdSpec.spec.names.plural}',`
      : `NamespacedCustomObject(
      '${crdSpec.spec.group}',
      '${crdSpec.spec.version}',
      namespace,
      '${crdSpec.spec.names.plural}',`;

    const generateTypeDefinition = (typeName: string, typeDefinition) =>
      `export type ${typeName} = ${generator
        .propertiesTemplate(generator.propertiesList(typeDefinition))
        .replace(/"/g, "")};`;
    const metadata = {
      required: [
          'apiVersion',
          'kind',
          'metadata',
          'status',
      ],
      properties: {
        apiVersion: {
          type: 'string'
        },
        kind: {
          type: 'string'
        },
        metadata: {
          type: 'object',
          properties: {
            name: { type: 'string'},
            namespace: { type: 'string'},
            annotations: { type: 'object'},
            labels: { type: 'object'},
            resourceVersion: { type: 'string'},
            generation: { type: 'number'},
            deletionTimestamp: { type: 'string'},
            deletionGracePeriodSeconds: { type: 'string'},
            creationTimestamp: { type: 'string'},

          }
        }

      }
    }

    const singleName = typePrefix + crdSpec.spec.names.kind;
    const singleType = generateTypeDefinition(singleName, merge(metadata, jsonSchema));

    const listName = typePrefix + crdSpec.spec.names.listKind;
    const listType = `export type ${listName} = {
    body: {items: ${singleName}[]};
  }`;

    return `
  ${singleType}
  ${listType}
  
  export class ${singleName}Client {
  public  constructor(private customObjects: CustomObjectsApi) {}
  public  async get${listName}(${
      isNamespacedScoped ? "namespace: string" : ""
    }): Promise<Result<${listName}>> {
    
    try {
      return await this.customObjects.list${clusterOrNamespacedCustomObject}
      ).then((res) => {
        return res.body
      }).catch((data) => {
        return data;
      });
    } catch (error) {
      return { error };
    }
  }

  public  async get${singleName}(${
      isNamespacedScoped ? "namespace: string, " : ""
    }${singleName}Name: string): Promise<Result<${singleName}>> {
    
    try {
      return await this.customObjects.get${clusterOrNamespacedCustomObject}
        ${singleName}Name,
      ).then((res) => {
        return res.body
      }).catch((data) => {
        return data;
      });
    } catch (error) {
      return { error };
    }
  }
  
  public async delete${singleName}(${
      isNamespacedScoped ? "namespace: string, " : ""
    }${singleName}Name: string) {
    
    try {
      return await this.customObjects.delete${clusterOrNamespacedCustomObject}
        ${singleName}Name,
      ).then((res) => {
        return res.body
      }).catch((data) => {
        return data;
      });
    } catch (error) {
      return { error };
    }
  }
  
  public async create${singleName}(${
      isNamespacedScoped ? "namespace: string, " : ""
    }body: ${singleName}): Promise<Result<${singleName}>> {
    
    try {
      return await this.customObjects.create${clusterOrNamespacedCustomObject}
        body,
      ).then((res) => {
        return res.body
      }).catch((data) => {
        return data;
      });
    } catch (error) {
      return { error };
    }
  }
  
  public async patch${singleName}(${
      isNamespacedScoped ? "namespace: string, " : ""
    }${singleName}Name: string, body: Partial<${singleName}>): Promise<Result<${singleName}>> {
    
    try {
      return await this.customObjects.patch${clusterOrNamespacedCustomObject}
        ${singleName}Name,
        body,
      ).then((res) => {
        return res.body
      }).catch((data) => {
        return data;
      });
    } catch (error) {
      return { error };
    }
  }
  }
  `;
  });

  return prettier.format(
    generateClientHeader + versionsClients.join("\n"),
    prettierOptions
  );
}
