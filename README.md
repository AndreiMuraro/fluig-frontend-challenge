# Desafio Front-end Fluig

## O desafio
Criar um aplicativo de Lista de Tarefas que permite criar, editar, remover tarefas e alterar o status de cada tarefa (A fazer, Fazendo, Concluído).

## Tecnologias
- HTML
- CSS
- JavaScript (ES6)
- Bootstrap
- Web Components
- Testes Automatizados (JEST)

## Funcionalidades adicionadas
- Exibição de tarefas;
- Busca de tarefas pelo nome;
- Remoção de tarefas;
- Edição de informações da tarefa;
- Movimentar tarefas;
- Testes Automatizados/

## Rodando o projeto
É necessário ter o npm e o Node.js (versão 18 ou maior) instalados.

1. Utilizando o terminal, faça o clone do projeto:
   ```bash
   git clone git@github.com:AndreiMuraro/fluig-frontend-challenge.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o json-server:
    ```bash
    npm run server
    ```

3. Rode o projeto localmente:
   ```bash
   npm start
   ```
Isso abrirá automaticamente o seu navegador.

Para realizar os Testes Automatizados com Jest:
   ```bash
      npm test
   ```


Este projeto utiliza o `json-server` para simular as APIs das tarefas, garantindo que as operações de CRUD (criação, leitura, atualização e exclusão) funcionem corretamente.