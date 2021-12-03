# Preparando seu ambiente para trabalhar com AWS

Após [criar seu bucket no S3](criando-um-bucket-no-s3.md) e [criar as permissões no IAM](criando-permissoes-no-iam.md)
é hora de preparar seu ambiente para rodar os scripts de teste.

### AWS-CLI
Alguns dos exemplos e testes deste tutorial incluem comandos executados no terminal/shell/prompt e é diferente 
dependendo do sistema operacional que está executando. Recomendo fortemente que utilize o 
[Docker](https://www.docker.com/) para executar um container Linux e executar estes testes, assim você mantém o 
sistema operacional base da sua máquina limpo.

Caso prefira, você pode rodar um container com o [AWS Linux](https://hub.docker.com/_/amazonlinux).

[Baixe e instale o AWS-CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) compatível com 
o sistema operacional que você escolheu para rodar os testes.

Após a instalação você pode rodar o `aws configure` e inserir os dados iniciais de acesso.

### Autenticação
Para enviar requisições à API da AWS você precisa autenticar utilizando as credenciais criadas na etapa do IAM.

Na instância onde irá executar os testes, após instalar o AWS-CLI, você deve criar/editar o arquivo `~/.aws/credentials`
e inserir as seguintes linhas:
```shell
[tutorials3]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

O parâmetro `[tutorials3]` representa um profile específico, se você executou o `aws configure` na etapa anterior, 
você verá no seu arquivo de credenciais um item `[default]` que será usando sempre que nenhum profile é especificado 
em seu código, porém o uso de profiles permite inserir diversas credenciais em uma única máquina sem criar conflitos.

Este é um exemplo de uso de credenciais sem profile:
```javascript
import { S3Client } from "@aws-sdk/client-s3";
const config = {
    region: 'us-east-1'
};
const s3Client = new S3Client(config);
```

Este é um exemplo utilizando o profile `tutorials3`:
```javascript
import { S3Client } from "@aws-sdk/client-s3";
const config = {
    region: 'us-east-1',
    credentials: fromIni({profile: 'tutorials3'})
};
const s3Client = new S3Client(config);
```

Você ainda pode utilizar variáveis de ambiente padrão do sistema passando as credenciais através do código:
```javascript
import { S3Client } from "@aws-sdk/client-s3";
const config = {
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS
    }
};
const s3Client = new S3Client(config);
```

**ATENÇÃO**: É absolutamente NÃO RECOMENDÁVEL que você utilize o modelo acima para passar as credenciais diretamente
dentro do seu código.

Para saber mais sobre sobre os diversos modos de autenticação da AWS acesse a 
[documentação da AWS](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html).
