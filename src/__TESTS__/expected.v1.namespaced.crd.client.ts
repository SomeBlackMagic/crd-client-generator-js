// /!\ WARNING :  THIS FILE IS AUTOGENERATED FROM A KUBERNETES CUSTOM RESOURCE DEFINITION FILE. DO NOT CHANGE IT, use crd-client-generator-ts to update it.
import { CustomObjectsApi } from '@kubernetes/client-node/dist/gen/api/customObjectsApi';
export type Result<T> = T | { error: any };

export type V1alpha1DataService = {
  apiVersion?: string;
  kind?: string;
  metadata?: {};
  spec?: {
    data: Array<{
      hostPath?: string;
      name: string;
      persistentVolume?: {
        selector?: {
          matchExpressions?: Array<{
            key: string;
            operator: string;
            values?: Array<string>;
          }>;
          matchLabels?: {};
        };
        storageClassName: string;
      };
    }>;
    debug?: { logs?: string };
    diskMode?: 'Filesystem' | 'Block';
    image?: {
      name?: string;
      pullPolicy?: string;
      repository?: string;
      tag?: string;
    };
    index: {
      hostPath?: string;
      name: string;
      persistentVolume?: {
        selector?: {
          matchExpressions?: Array<{
            key: string;
            operator: string;
            values?: Array<string>;
          }>;
          matchLabels?: {};
        };
        storageClassName: string;
      };
    };
    nodeName: string;
    prometheus: { enable: boolean };
    service: string;
    traits?: Array<string>;
  };
  status?: {
    conditions?: Array<{
      lastHeartbeatTime?: string;
      lastTransitionTime?: string;
      message?: string;
      reason?: string;
      status: 'True' | 'False' | 'Unknown';
      type:
        | 'Ready'
        | 'ConfigReady'
        | 'ServiceReady'
        | 'MonitoringReady'
        | 'StorageReady'
        | 'StatefulSetReady';
    }>;
  };
};
export type V1alpha1DataServiceList = {
  body: { items: V1alpha1DataService[] };
};

export class V1alpha1DataServiceClient {
  constructor(private customObjects: CustomObjectsApi) {}
  async getV1alpha1DataServiceList(
    namespace: string,
  ): Promise<Result<V1alpha1DataServiceList>> {
    try {
      return await this.customObjects.listNamespacedCustomObject(
        'hd.scality.com',
        'undefined',
        namespace,
        'dataservices',
      );
    } catch (error) {
      return { error };
    }
  }

  async getV1alpha1DataService(
    namespace: string,
    V1alpha1DataServiceName: string,
  ): Promise<Result<V1alpha1DataService>> {
    try {
      return await this.customObjects.getNamespacedCustomObject(
        'hd.scality.com',
        'undefined',
        namespace,
        'dataservices',
        V1alpha1DataServiceName,
      );
    } catch (error) {
      return { error };
    }
  }

  async deleteV1alpha1DataService(
    namespace: string,
    V1alpha1DataServiceName: string,
  ) {
    try {
      return await this.customObjects.deleteNamespacedCustomObject(
        'hd.scality.com',
        'undefined',
        namespace,
        'dataservices',
        V1alpha1DataServiceName,
        {},
      );
    } catch (error) {
      return { error };
    }
  }

  async createV1alpha1DataService(
    namespace: string,
    body: V1alpha1DataService,
  ): Promise<Result<V1alpha1DataService>> {
    try {
      return await this.customObjects.createNamespacedCustomObject(
        'hd.scality.com',
        'undefined',
        namespace,
        'dataservices',
        body,
      );
    } catch (error) {
      return { error };
    }
  }

  async patchV1alpha1DataService(
    namespace: string,
    body: Partial<V1alpha1DataService>,
  ): Promise<Result<V1alpha1DataService>> {
    try {
      return await this.customObjects.patchNamespacedCustomObject(
        'hd.scality.com',
        'undefined',
        namespace,
        'dataservices',
        body,
      );
    } catch (error) {
      return { error };
    }
  }
}
