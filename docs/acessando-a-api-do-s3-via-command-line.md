# Operando o AWS S3 através da command-line (linha de comando) do AWS-CLI
Uma das maneiras mais práticas de controlar sua infra-estrutura é através da API da AWS, e o AWS-CLI te permite fazer
isso através do seu terminal shell, possibilitando executar tarefas através do cron ou através de scripts de automação.

Após [preparar seu ambiente e inserir suas credenciais](preparando-seu-ambiente.md) você pode executar o comando `aws` 
para interagir com qualquer recurso da AWS.

Com o `aws s3` você opera seus buckets e os objetos contidos neles.

Antes de iniciar os testes, vá até a raiz desde repositório em sua máquina e digite `cd scripts`

### Upload de arquivo individual
O comando abaixo copia `aws s3 cp` o arquivo indicado no primeiro parâmetro `./files/philippine-coins-1483943.jpg` para
o bucket informado no segundo parâmetro `s3://uiq-test-bucket/`.
```shell
aws s3 cp ./files/philippine-coins-1483943.jpg s3://uiq-test-bucket/ 
```

O comando a seguir executa exatamente a mesma ação, porém renomeando o objeto final dentro do bucket para `test.jpg` e 
inserindo ele dentro de uma pasta chamada `subfolder`.
```shell
aws s3 cp ./files/philippine-coins-1483943.jpg s3://uiq-test-bucket/subfolder/test.jpg
```

### Upload de pastas
O comando abaixo copia `aws s3 cp` todos os arquivos da pasta indicada no primeiro parâmetro `./files/` para
o bucket informado no segundo parâmetro `s3://uiq-test-bucket/`, de forma recursiva `--recursive`, excluindo por padrão
todos os arquivos da pasta `--exclude "*"` e incluindo somente os arquivos com extensão JPG `--include "*.jpg"`.
```shell
aws s3 cp ./files/ s3://uiq-test-bucket/ --recursive --exclude "*" --include "*.jpg"
```

### Listagem de arquivos
Para conferir o estado atual do nosso bucket, executamos o comando `ls`.
```shell
aws s3 ls s3://uiq-test-bucket
```

E obtemos o seguinte resultado:
```shell
                           PRE subfolder/
2021-10-11 02:06:52    1349755 natural-wonders-1400924.jpg
2021-10-11 02:06:52    2237188 philippine-coins-1483943.jpg
```

### Remoção de arquivo individual
```shell
aws s3 rm s3://uiq-test-bucket/subfolder/test.jpg
```

Agora nosso bucket está assim `aws s3 ls s3://uiq-test-bucket`:
```shell
2021-10-11 02:06:52    1349755 natural-wonders-1400924.jpg
2021-10-11 02:06:52    2237188 philippine-coins-1483943.jpg
```

### Remoção de multiplos arquivos
```shell
aws s3 rm s3://uiq-test-bucket --recursive
```
Após a remoção recursiva de todos os arquivos, nosso bucket está vazio.

### Sincronizando pastas inteiras
O comando `aws s3 sync` é uma ótima opção para backups e sincronização de arquivos como logs, que podem ser armazenados
no S3 para pesquisa e indexação posterior com um custo muito baixo.

Para subir arquivos já no modo de armazenamento de sua preferência, e ter o menor custo de armazenamento basta adicionar
no comando abaixo o parâmetro `--storage-class <value>`. Os valores válidos para esse parâmetro são:
```shell
STANDARD | REDUCED_REDUNDANCY | STANDARD_IA | ONEZONE_IA | INTELLIGENT_TIERING | GLACIER | DEEP_ARCHIVE
```

Sincronizando arquivos de uma pasta com o AWS S3
```shell
aws s3 sync ./files s3://uiq-test-bucket
```

Este é o output do comando:
```shell
upload: files/natural-wonders-1400924.jpg to s3://uiq-test-bucket/natural-wonders-1400924.jpg
upload: files/philippine-coins-1483943.jpg to s3://uiq-test-bucket/philippine-coins-1483943.jpg
```

Veja mais opções na [documentação do AWS-CLI para S3](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#single-local-file-and-s3-object-operations).
