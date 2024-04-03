## CRD client generator

It generates a typescript client based on `@kubernetes/client` custom objects client from a Kubernetes `CustomResourceDefinition`.


## How to install
```
wget https://github.com/SomeBlackMagic/crd-client-generator-js/releases/latest/download/crd-client-generator-js-linux-amd64
chmod +x crd-client-generator-js-linux-amd64
mv crd-client-generator-js-linux-amd64 /usr/local/bin/crd-client-generator-js
```


### Usage

```bash
$ npm run generate -- <path_to_your_crd> <path_to_the_target_generated_js_file> [optional_type_prefix]
```

#### Sample

```bash
$ npm run generate -- src/__TESTS__/storage.metalk8s.scality.com_volumes.yaml sample/GeneratedClient.js Metalk8s
```

### How to contribute ?

#### Install dependencies

```bash
$ npm i
```

#### Run tests

```bash
$ npm run test -- --watch
```
