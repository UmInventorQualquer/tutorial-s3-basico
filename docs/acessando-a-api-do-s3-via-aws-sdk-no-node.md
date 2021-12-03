# Operando o AWS S3 através do AWS-SDK com Node JS

Claro que além da facilidade e automatizar processos através do [AWS-CLI](acessando-a-api-do-s3-via-command-line.md) 
nos seus scripts shell, a principal vantagem de consumir uma infra-estrutura as a service (IaaS) é você poder 
integrá-la à sua aplicação. E fazer isso é mais fácil do que você imagina.

Neste tutorial vou mostrar como configurar e consumir a API do AWS S3 utilizando o aWS-SDK com o Node JS.

### Requisitos
- https://nodejs.org/ alterativamente você pode rodar um container docker do Node JS https://hub.docker.com/_/node

### Instalação
Na pasta do seu projeto, onde encontra-se o arquivo `package.json` execute o comando de instalação do paco do S3:

#### NPM:
```shell
npm install @aws-sdk/client-s3
```

#### YARN:
```shell
yarn add @aws-sdk/client-s3
```

#### PNPM:
```shell
pnpm add @aws-sdk/client-s3
```

### Configuração

Se você já [instalou o AWS-CLI](preparando-seu-ambiente.md) e fez as configurações das suas credenciais no sistema 
operacional onde o sistema vai rodar, ou fez isso no seu docker, a configuração do seu script será muito mais simples.

Basta importar a lib do `"@aws-sdk/client-s3` e criar uma constante de configuração contendo a região onde seus buckets
estão. 
```javascript
import { S3Client } from "@aws-sdk/client-s3";

const config = {
    region: 'us-east-1'
};

const client = new S3Client(config);
```

Através do objeto `client` será possível interagir com todos os seus buckets da região `us-east-1`.

Caso você esteja rodando este script fora da infra-estrutura da AWS, ou em uma máquina onde você não tem permissão 
para alterar/criar o arquivo `~/.aws/credentials`, ainda há a possibilidade de passar as credenciais diretamente pelo
código, mas...

### ATENÇÃO aos critérios de segurança, armazenar credenciais de acesso dentro do código pode causar:
- Vazamento de dados por invasão de contas de GitHub/BitBucket/etc; :poop:
- Vazamento de dados por invasão de máquinas de desenvolvedores; :poop:
- Vazamento de dados por desenvolvedores mau intencionados, inconsequentes ou inexperientes; :poop:
- Adulteração e/ou perda de dados de produção por erro humano; :fire:

<span style="color:red">**Credenciais de acesso a recursos de produção devem ficar isoladas nos ambientes de produção, de preferência através
das variáveis de ambiente das máquinas ou através de serviços de configuração distribuídos. Fora do ambiente de 
produção estas credenciais devem estar protegidas com criptografia e disponíveis ao menos número de pessoas possível,
para maior controle de danos.**</span>

Para inserir as credenciais diretamente através do código use a seguinte sintaxe:
```javascript
import { S3Client } from "@aws-sdk/client-s3";

const config = {
    region: 'us-east-1',
    credentials: {
        accessKeyId: '<YOUR_ACCESS_KEY_ID>',
        secretAccessKey: '<YOUR_SECRET_ACCESS_KEY>'
    }
};

const client = new S3Client(config);
```

Mas se você está pensando em fazer isso porque precisa utilizar várias credenciais diferentes na mesma aplicação, você
pode utilizar os `profiles` do arquivo de configurações do AWS-CLI.

Veja um exemplo do `~/.aws/credentials` com várias credenciais:
```shell
[default]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>

[meuperfilum]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>

[meuperfildois]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

O primeiro perfil `[default]` será utilizado mesmo que você não especifique nenhum perfil na carga das configurações,
os outros devem ser chamados da seguinte forma no seu código:

```javascript
import { S3Client } from "@aws-sdk/client-s3";

const config = {
    region: 'us-east-1',
    credentials: fromIni({profile: 'meuperfilum'})
};

const client = new S3Client(config);
```

Desta forma você pode instanciar quantos S3Client's precisar com credenciais diferentes dentro de uma única aplicação.

### Preparando seu ambiente
Siga as instruções do tutorial [Criando Permissões do S3 no IAM](criando-permissoes-no-iam.md) e insira as credenciais 
geradas no seu arquivo `~/.aws/credentials` da seguinte forma:
```shell
[tutorials3]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

Agora você pode entrar na pasta scripts `cd scripts` para executar os scripts de teste.

### Instalação de dependências
Antes de mais nada é necessário instalar as dependências dos scripts em Node JS.
```shell
npm i
```

### Upload
```shell
node upload.js
```

Você deve ver algo similar a isto no seu terminal:
```shell
response:  {
  '$metadata': {
    httpStatusCode: 200,
    requestId: undefined,
    extendedRequestId: '55aoeeJXOFB4S8W53E4+q4ictivVfk1s9IUPxD8DtcGIswODglIw2wLYcHULv927C26U/LUd480=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  BucketKeyEnabled: undefined,
  ETag: '"535a8b268d78765c6ebc47eed8835e01"',
  Expiration: undefined,
  RequestCharged: undefined,
  SSECustomerAlgorithm: undefined,
  SSECustomerKeyMD5: undefined,
  SSEKMSEncryptionContext: undefined,
  SSEKMSKeyId: undefined,
  ServerSideEncryption: undefined,
  VersionId: undefined
}
```

### Download
```shell
node download.js
```

O resultado será o arquivo `photo.jpg` gravado na pasta `downloads`.

### Delete
```shell
node delete.js
```

O resultado exibido no terminal será o seguinte:
```shell
response:  {
  '$metadata': {
    httpStatusCode: 204,
    requestId: undefined,
    extendedRequestId: 'seCJRBPT0z0Cp/KxCMeNMijoB4qpP48GZAMLelXKBrqa6wgPyowefKMValTzeLgPXmMONUbV7TE=',
    cfId: undefined,
    attempts: 1,
    totalRetryDelay: 0
  },
  DeleteMarker: undefined,
  RequestCharged: undefined,
  VersionId: undefined
}
```

E o arquivo `photo.jpg` removido do seu bucket.

### Hora de morphar

Agora que você vu o quanto é fácil interagir com a API da AWS é hora de começar a implantar o AWS-SDK à sua aplicação.

Boa sorte

### Documentação oficial do AWS-SDK
Versão padrão:
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/index.html

Utilizando o client S3 diretamente:
https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/s3.html

