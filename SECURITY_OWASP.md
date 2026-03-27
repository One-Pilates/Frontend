# Relatório de Segurança — OWASP Top 6

**Projeto:** OnePilates Application  
**Data:** Março de 2026  
**Escopo:** Frontend (`src/`) + Backend (`agendamento/`)  
**Metodologia:** Análise estática de código (sem execução)  
**Referência:** [OWASP Top 10 2021](https://owasp.org/Top10/)

---

## Índice

1. [A01 — Broken Access Control](#a01--broken-access-control)
2. [A02 — Cryptographic Failures](#a02--cryptographic-failures)
3. [A03 — Injection](#a03--injection)
4. [A04 — Insecure Design](#a04--insecure-design)
5. [A05 — Security Misconfiguration](#a05--security-misconfiguration)
6. [A06 — Vulnerable and Outdated Components](#a06--vulnerable-and-outdated-components)
7. [Resumo Executivo](#resumo-executivo)

---

## Legenda de Risco

| Nível | Descrição |
|-------|-----------|
| 🔴 CRÍTICO | Exploração direta, impacto imediato em dados ou sistemas |
| 🟠 ALTO | Impacto significativo, requer atenção prioritária |
| 🟡 MÉDIO | Risco real mas com mitigações parciais já presentes |
| 🔵 BAIXO | Boa prática, risco reduzido mas existente |

---

## A01 — Broken Access Control

> Controles de acesso mal configurados permitem que usuários atuem fora de suas permissões pretendidas.

---

### A01-01 — Controle de Acesso Baseado Apenas no Cliente (Frontend)

**Risco:** 🟠 ALTO  
**Arquivo:** `src/routes/PrivateRoutes.jsx` (linhas 6–27)

**Descrição:**  
A proteção de rotas é feita 100% no browser, baseada no objeto `user` lido do `localStorage`. Um usuário pode manualmente editar `localStorage` no DevTools e alterar o campo `role` (ex.: de `SECRETARIA` para `ADMINISTRADOR`), obtendo acesso visual a rotas restritas sem nenhuma validação do servidor.

```jsx
// Vulnerável — decisão de acesso baseada em dado do localStorage
const PrivateRoutes = ({ allowedRoles }) => {
  const { user, isCheckingAuth } = useAuth(); // user vem do localStorage
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }
  return <Outlet />;
};
```

**Impacto:** Acesso indevido à interface de outros perfis. Sem impacto real nos dados se o backend rejeitar as chamadas — mas cria inconsistência e pode mascarar falhas no backend.

**Correção necessária:**
- Nunca confiar no `role` armazenado no cliente para decisões de segurança reais
- Garantir que **todos** os endpoints do backend validem o papel do usuário via `@PreAuthorize`
- Idealmente: validar a sessão com o servidor ao carregar a aplicação (ex.: endpoint `/auth/me`)

---

### A01-02 — Papel do JWT Ignorando Role Atual do Banco

**Risco:** 🟠 ALTO  
**Arquivo:** `Backend/.../security/JwtAuthFilter.java` (linhas 54–67)

**Descrição:**  
O filtro JWT carrega o funcionário do banco (`funcionarioRepository.findByEmail`) mas constrói as `authorities` a partir do **claim `role` do token**, não do papel atual no banco. Se o papel de um funcionário for alterado (ex.: revogação de privilégios de ADMINISTRADOR), o token antigo ainda carregará o papel anterior até expirar.

```java
// Vulnerável — role vem do token, não do banco
Funcionario funcionario = funcionarioRepository.findByEmail(email).orElse(null);
String role = jwtUtil.extractRole(token); // <-- claim do JWT, não do banco
List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
```

**Impacto:** Um funcionário demitido ou com papel rebaixado continua operando com permissões antigas pelo tempo de vida do token (configurado como 24h em `application.properties`).

**Correção necessária:**
```java
// Usar o role do banco, não do token
String role = funcionario.getRole().name(); // ou equivalente no modelo
List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
```

---

### A01-03 — Endpoint de Imagens Publicamente Acessível

**Risco:** 🟡 MÉDIO  
**Arquivo:** `Backend/.../config/SecurityConfig.java` (linha 83)

**Descrição:**  
O endpoint `/api/imagens/**` está configurado como `permitAll()`, mas o comentário no código indica que deveria exigir autenticação. Qualquer pessoa não autenticada pode acessar as imagens diretamente.

```java
// Intenção vs implementação divergem
.requestMatchers("/api/imagens/**").permitAll() // Requer autenticação mas permite qualquer role
```

**Impacto:** Exposição de fotos de perfil de funcionários e alunos sem autenticação. Permite enumeração de imagens por ID.

**Correção necessária:**
```java
// Remover da lista de permitAll e proteger com autenticação
.requestMatchers("/api/imagens/**").authenticated()
```

---

### A01-04 — Autorização em Nível de Objeto Ausente (IDOR)

**Risco:** 🟡 MÉDIO  
**Arquivos:**
- `Backend/.../controller/AgendamentoController.java` (linhas 56–59, 99–109)
- `Backend/.../controller/AlunoController.java` (linhas 40–43)
- `Backend/.../controller/ProfessorController.java` (linhas 41–44)

**Descrição:**  
Endpoints parametrizados por ID permitem que um `PROFESSOR` acesse ou modifique recursos de qualquer outro professor, aluno ou agendamento apenas conhecendo o ID numérico. Não há verificação de que o recurso pertence ao usuário autenticado.

```java
// Vulnerável — PROFESSOR pode acessar agendamento de qualquer outro professor
@GetMapping("/{id}")
@PreAuthorize("hasAnyAuthority('ADMINISTRADOR', 'SECRETARIA', 'PROFESSOR')")
public ResponseEntity<AgendamentoResponseDTO> buscarPorId(@PathVariable Long id) {
    return ResponseEntity.ok(agendamentoService.buscarPorIdDTO(id)); // sem verificar ownership
}

// PROFESSOR pode editar dados de qualquer aluno
@PatchMapping("/{id}")
@PreAuthorize("hasAnyAuthority('ADMINISTRADOR', 'SECRETARIA', 'PROFESSOR')")
public ResponseEntity<AlunoResponseDTO> atualizarAlunoParcial(@PathVariable Long id, ...) { ... }
```

**Impacto:** Um professor pode visualizar ou alterar dados de outros professores, agendamentos e alunos que não lhe pertencem.

**Correção necessária:**
- Nos services correspondentes, verificar se o recurso pertence ao usuário autenticado antes de retornar/modificar
- Exemplo no service:
```java
String emailAutenticado = SecurityContextHolder.getContext().getAuthentication().getName();
if (!agendamento.getProfessor().getEmail().equals(emailAutenticado) && !isAdminOrSecretary()) {
    throw new AccessDeniedException("Acesso negado ao agendamento de outro professor");
}
```

---

## A02 — Cryptographic Failures

> Falhas relacionadas à criptografia que expõem dados sensíveis.

---

### A02-01 — Credenciais e Secrets em Arquivo de Configuração

**Risco:** 🔴 CRÍTICO  
**Arquivo:** `Backend/.../resources/application.properties` (linhas 2–4, 15–16, 21–22)

**Descrição:**  
Credenciais de banco de dados, segredo JWT e senha de e-mail estão armazenados em **texto plano** no arquivo de configuração. Embora o `.gitignore` do backend exclua este arquivo do repositório git, o risco persiste em backups, compartilhamento de código, logs e acesso local não autorizado.

```properties
# Credenciais de banco expostas em texto plano
spring.datasource.username=root
spring.datasource.password=<senha_aqui>

# Segredo JWT em texto plano — qualquer um que ler pode forjar tokens
app.jwt.secret=<chave_base64_aqui>

# Credenciais de e-mail (app password do Gmail)
spring.mail.username=<email_aqui>
spring.mail.password=<senha_aqui>
```

**Impacto:** Se o arquivo vazar (backup, acesso ao servidor, repositório privado comprometido), um atacante pode: autenticar-se diretamente no banco, forjar JWTs para qualquer usuário com qualquer papel, e enviar e-mails em nome da aplicação.

**Correção necessária:**
- Usar variáveis de ambiente em vez de valores hardcoded:
```properties
spring.datasource.password=${DB_PASSWORD}
app.jwt.secret=${JWT_SECRET}
spring.mail.password=${MAIL_PASSWORD}
```
- Em produção, usar um gerenciador de secrets (ex.: AWS Secrets Manager, HashiCorp Vault, Azure Key Vault)
- Rotacionar **imediatamente** todas as credenciais que estiverem em texto plano

---

### A02-02 — Token JWT Armazenado em `localStorage`

**Risco:** 🟠 ALTO  
**Arquivos:**
- `src/hooks/AuthProvider.jsx` (linhas 15–18, 29–30)
- `src/services/api.js` (linhas 11–16)

**Descrição:**  
O JWT e o objeto `user` completo (incluindo `role`) são armazenados em `localStorage`. Qualquer script com acesso ao contexto da página (via XSS, extensão maliciosa ou dependência comprometida) pode ler e exfiltrar o token, assumindo a identidade do usuário sem limite de tempo até o token expirar.

```jsx
// AuthProvider.jsx — salva token e dados do usuário no localStorage
localStorage.setItem('token', data.token);
localStorage.setItem('user', JSON.stringify(data.funcionario));

// api.js — lê token do localStorage a cada requisição
const token = localStorage.getItem('token');
config.headers.Authorization = `Bearer ${token}`;
```

**Impacto:** Session hijacking completo se houver qualquer vetor de XSS na aplicação.

**Correção necessária:**
- Armazenar o token em **`httpOnly` + `Secure` cookies** (inacessíveis ao JavaScript)
- Se mantiver `localStorage` por ora, implementar uma política de CSP rígida para mitigar XSS
- Considerar tokens de vida curta (ex.: 15 min) com refresh token rotativo

---

### A02-03 — Fallback Inseguro na Decodificação do Secret JWT

**Risco:** 🟡 MÉDIO  
**Arquivo:** `Backend/.../security/JwtUtil.java` (linhas 25–30)

**Descrição:**  
Se o segredo JWT não for Base64 válido, o código faz fallback para `secret.getBytes()` **sem especificar charset**. Isso usa o charset padrão da JVM, que pode variar entre sistemas operacionais e locales, gerando chaves HMAC diferentes e imprevisíveis.

```java
try {
    keyBytes = Base64.getDecoder().decode(secret);
} catch (IllegalArgumentException ex) {
    keyBytes = secret.getBytes(); // charset padrão da JVM — não determinístico entre ambientes
}
```

**Impacto:** Chave HMAC diferente entre ambientes pode causar tokens inválidos em produção ou, inversamente, mascarar que a chave está sendo gerada incorretamente.

**Correção necessária:**
```java
// Sempre usar UTF-8 explicitamente
keyBytes = secret.getBytes(StandardCharsets.UTF_8);
```

---

### A02-04 — Comunicação via HTTP (sem TLS)

**Risco:** 🟡 MÉDIO  
**Arquivos:**
- `Frontend/.env` (linha 1): `VITE_BASE_URL_API=http://localhost:8080`
- `Backend/.../resources/application.properties` (linha 2): `useSSL=false`

**Descrição:**  
Em ambiente local, HTTP é aceitável. Em produção ou em redes não confiáveis, JWTs, senhas e dados de alunos trafegam em texto claro, suscetíveis a interceptação (man-in-the-middle).

**Correção necessária:**
- Usar `https://` na URL base da API em produção
- Habilitar TLS no banco de dados em produção: remover `useSSL=false` e configurar certificado
- Forçar HTTPS no servidor de aplicação (ex.: redirect 80 → 443)

---

## A03 — Injection

> Dados não confiáveis são enviados para um interpretador como parte de um comando ou query.

---

### A03-01 — Risco Potencial de XSS via Mensagens de Erro da API

**Risco:** 🔵 BAIXO (condicional)  
**Arquivo:** `src/pages/Secretary/RegisterAula/index.jsx` (linhas 201–208)

**Descrição:**  
A aplicação exibe mensagens de erro vindas diretamente do backend em toasts. Se a resposta da API contiver HTML e o componente de toast renderizá-lo como HTML (sem escape), configura-se um vetor de XSS refletido/baseado em DOM. A biblioteca `sonner` (usada no projeto) escapa texto por padrão, mas se `toast()` for chamado com `dangerouslySetInnerHTML` ou equivalente em alguma customização, o risco se materializa.

```jsx
// Mensagem de erro da API exibida diretamente
if (error.response?.data?.erro) {
  mensagem = error.response.data.erro;
} else if (error.response?.data?.message) {
  mensagem = error.response.data.message;
} else if (error.response?.data) {
  mensagem = JSON.stringify(error.response.data); // pode conter HTML/scripts
}
toast.error(mensagem);
```

**Correção necessária:**
- Confirmar que `sonner` escapa HTML nas mensagens (atualmente parece fazê-lo)
- Sanitizar mensagens de erro antes de exibir usando uma lib como `DOMPurify`
- Nunca usar `dangerouslySetInnerHTML` com conteúdo de APIs externas

---

### A03-02 — Repositórios: SQL Injection Não Identificado

**Resultado:** Sem vulnerabilidades encontradas.

Os repositórios JPA (`AgendamentoRepository`, `AlunoRepository`, `ProfessorRepository`) usam exclusivamente **queries com parâmetros nomeados** (`@Param`) ou **métodos derivados do Spring Data** — padrão seguro contra SQL Injection.

```java
// Padrão seguro — parâmetros nomeados, não concatenação de strings
@Query("SELECT ... WHERE a.professor.id = :professorId AND ...")
List<Agendamento> findByProfessorId(@Param("professorId") Long professorId, ...);
```

---

## A04 — Insecure Design

> Falhas de design que não consideram ameaças de segurança durante a fase de arquitetura.

---

### A04-01 — Ausência de `@Valid` em Endpoints PATCH

**Risco:** 🟡 MÉDIO  
**Arquivos:**
- `Backend/.../controller/AgendamentoController.java` (linha 78)
- `Backend/.../controller/AlunoController.java` (linha 42)
- `Backend/.../controller/ProfessorController.java` (linha 48)

**Descrição:**  
Enquanto os endpoints `POST` usam `@Valid` (ex.: `criarAluno(@Valid @RequestBody AlunoDTO dto)`), os endpoints `PATCH` correspondentes omitem a anotação, desabilitando o Bean Validation. DTOs com campos inválidos (strings vazias, datas impossíveis, IDs negativos) chegam ao service sem validação.

```java
// Endpoint POST — correto, usa @Valid
public ResponseEntity<AlunoResponseDTO> criarAluno(@Valid @RequestBody AlunoDTO dto) { ... }

// Endpoint PATCH — vulnerável, sem @Valid
public ResponseEntity<AlunoResponseDTO> atualizarAlunoParcial(@PathVariable Long id,
                                                               @RequestBody AlunoDTO dto) { ... }
```

**Correção necessária:**
- Adicionar `@Valid` a todos os `@RequestBody` nos endpoints PATCH
- Verificar se os DTOs têm as anotações de validação necessárias (`@NotBlank`, `@Size`, `@NotNull`)

---

### A04-02 — CORS Permissivo com Wildcard nos Controllers

**Risco:** 🟡 MÉDIO  
**Arquivos:**
- `Backend/.../controller/AgendamentoController.java` (linha 18)
- `Backend/.../controller/ProfessorController.java` (linha 18)

**Descrição:**  
Além da configuração global de CORS em `SecurityConfig`, alguns controllers têm `@CrossOrigin(origins = "*")` individualmente. Isso sobrepõe a política global e garante que qualquer origem possa chamar esses endpoints mesmo que a configuração global seja endurecida futuramente.

```java
@RequestMapping("/api/agendamentos")
@CrossOrigin(origins = "*") // sobrepõe configuração global — difícil de auditar centralmente
public class AgendamentoController { ... }
```

**Correção necessária:**
- Remover todas as anotações `@CrossOrigin` nos controllers
- Centralizar a política de CORS exclusivamente em `SecurityConfig.corsConfigurationSource()`

---

### A04-03 — Dados Pessoais (PII) Expostos no Console do Browser

**Risco:** 🟡 MÉDIO  
**Arquivo:** `src/pages/Secretary/RegisterStudent/index.jsx` (linhas 239–244)

**Descrição:**  
A função `finalizar()` imprime todos os dados do aluno (nome, endereço, informações de saúde, observações) via `console.log` antes de enviar para a API. Em ambiente de produção, qualquer extensão de browser, ferramenta de monitoramento ou pessoa com acesso físico à tela pode ver esses dados.

```jsx
const finalizar = () => {
  console.log('📋 Dados do aluno (pré-visualização):', {
    dadosPessoais,   // CPF, nome, data nascimento, telefone
    endereco,        // endereço completo
    informacoesAluno // condições de saúde, observações
  });
  // ...
};
```

**Impacto:** Violação de privacidade (LGPD/GDPR). Dados de saúde de alunos são dados sensíveis.

**Correção necessária:**
- Remover todos os `console.log` com dados de usuários/alunos em produção
- Configurar eslint-plugin para bloquear `console.log` em builds de produção:
```js
// .eslintrc ou eslint.config.js
"no-console": ["error", { allow: ["warn", "error"] }]
```

---

### A04-04 — Validação Incompleta no Formulário de Cadastro de Aluno

**Risco:** 🔵 BAIXO  
**Arquivo:** `src/pages/Secretary/RegisterStudent/index.jsx` (linhas 155–212)

**Descrição:**  
A função `validarEtapa()` valida apenas as etapas 1 e 2 do formulário. A etapa 3 não possui bloco de validação, permitindo que dados inválidos ou em branco sejam submetidos para essa etapa sem feedback ao usuário.

```jsx
const validarEtapa = () => {
  const novosErros = {};
  if (etapaAtual === 1) { /* validações */ }
  if (etapaAtual === 2) { /* validações */ }
  // etapa 3: sem validação — dados enviados sem verificação
  setErros(novosErros);
  return Object.keys(novosErros).length === 0; // sempre retorna true na etapa 3
};
```

**Correção necessária:**
- Adicionar bloco `if (etapaAtual === 3) { ... }` com validações pertinentes
- Garantir que `@Valid` no backend complemente a validação client-side

---

## A05 — Security Misconfiguration

> Configurações de segurança incorretas ou ausentes em qualquer nível da stack.

---

### A05-01 — Swagger/OpenAPI Publicamente Acessível

**Risco:** 🟠 ALTO  
**Arquivo:** `Backend/.../config/SecurityConfig.java` (linhas 81–82)

**Descrição:**  
A documentação completa da API (`/swagger-ui/**`, `/v3/api-docs/**`) está acessível sem autenticação. Isso expõe para qualquer pessoa: todos os endpoints disponíveis, os parâmetros esperados, os modelos de dados (DTOs), e permite executar chamadas diretamente pela interface "Try it out".

```java
.requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
```

**Impacto:** Reduz significativamente o esforço de reconhecimento para um atacante. Em produção, é uma superfície de ataque desnecessária.

**Correção necessária:**
- Desabilitar Swagger em produção via perfil Spring:
```properties
# application-prod.properties
springdoc.api-docs.enabled=false
springdoc.swagger-ui.enabled=false
```
- Ou proteger com autenticação:
```java
.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").hasAuthority("ADMINISTRADOR")
```

---

### A05-02 — `show-sql=true` e `ddl-auto=update` em Produção

**Risco:** 🟠 ALTO  
**Arquivo:** `Backend/.../resources/application.properties` (linhas 7–9)

**Descrição:**  
- `spring.jpa.show-sql=true`: Imprime todas as queries SQL (com valores de parâmetros em alguns casos) nos logs. Em produção, isso cria logs excessivos com informações estruturais do banco, acessíveis a qualquer pessoa com acesso aos logs.
- `spring.jpa.hibernate.ddl-auto=update`: Permite ao Hibernate modificar o schema do banco automaticamente. Em produção, isso pode causar alterações estruturais não intencionais e perda de dados.

```properties
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update
```

**Correção necessária:**
```properties
# application-prod.properties
spring.jpa.show-sql=false
spring.jpa.hibernate.ddl-auto=validate  # ou none — nunca update em produção
logging.level.org.hibernate.SQL=ERROR
```

---

### A05-03 — Mensagens de Erro Internas Expostas ao Cliente

**Risco:** 🟡 MÉDIO  
**Arquivo:** `Backend/.../handler/GlobalExceptionHandler.java` (linhas 52–61)

**Descrição:**  
O handler de `RuntimeException` e `AccessDeniedException` retorna a **mensagem bruta da exceção** para o cliente. Mensagens de runtime podem conter: nomes de classes internas, queries SQL, paths do servidor, nomes de colunas do banco e outras informações que auxiliam um atacante na fase de reconhecimento.

```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<String> handleRuntime(RuntimeException ex) {
    String msg = ex.getMessage() == null ? "Erro" : ex.getMessage();
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg); // mensagem interna exposta
}

@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<String> handleAccessDenied(AccessDeniedException ex) {
    String msg = ex.getMessage() == null ? "Access Denied" : ex.getMessage();
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(msg); // detalhe desnecessário
}
```

**Correção necessária:**
```java
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
    log.error("Erro interno não tratado: {}", ex.getMessage(), ex); // log server-side
    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
        .body(Map.of("erro", "Ocorreu um erro ao processar a requisição.")); // mensagem genérica
}
```

---

### A05-04 — CORS Wildcard na Configuração Global

**Risco:** 🟡 MÉDIO  
**Arquivo:** `Backend/.../config/SecurityConfig.java` (linhas 44–50)

**Descrição:**  
A configuração global permite **qualquer origem** (`*`) para todos os endpoints da API. Em produção, qualquer site pode fazer requisições autenticadas com o token do usuário (se as headers permitirem) ou ler respostas de endpoints públicos.

```java
configuration.setAllowedOriginPatterns(Arrays.asList("*")); // qualquer origem permitida
```

**Correção necessária:**
```java
// application.properties
cors.allowed-origins=https://app.onepilates.com.br,https://admin.onepilates.com.br

// SecurityConfig.java
configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
```

---

### A05-05 — Headers de Segurança HTTP Ausentes

**Risco:** 🔵 BAIXO  
**Arquivo:** `Backend/.../config/SecurityConfig.java` (linhas 74–91)

**Descrição:**  
O `SecurityFilterChain` não configura explicitamente os headers de segurança HTTP. O Spring Security ativa alguns por padrão, mas headers como `Content-Security-Policy` (CSP), `Permissions-Policy` e uma política HSTS robusta não são configurados.

**Correção necessária:**
```java
http.headers(headers -> headers
    .contentSecurityPolicy(csp ->
        csp.policyDirectives("default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"))
    .httpStrictTransportSecurity(hsts ->
        hsts.maxAgeInSeconds(31536000).includeSubDomains(true))
    .frameOptions(frame -> frame.deny())
    .contentTypeOptions(Customizer.withDefaults())
);
```

---

### A05-06 — CSRF Desabilitado

**Risco:** 🔵 BAIXO (neste contexto)  
**Arquivo:** `Backend/.../config/SecurityConfig.java` (linha 78)

**Descrição:**  
O CSRF está desabilitado, o que é aceitável para APIs REST stateless com JWT em header `Authorization`. O risco aumenta se cookies de sessão forem introduzidos no futuro ou se o padrão de autenticação mudar.

```java
.csrf(csrf -> csrf.disable())
```

**Correção necessária:**
- Manter documentado o motivo da decisão
- Se cookies forem adotados para auth no futuro, reabilitar CSRF imediatamente

---

## A06 — Vulnerable and Outdated Components

> Uso de componentes com vulnerabilidades conhecidas ou desatualizados.

---

### A06-01 — Dependências Backend Desatualizadas (Maven)

**Risco:** 🟡 MÉDIO  
**Arquivo:** `Backend/.../pom.xml`

**Descrição:**  
Algumas dependências estão em versões que podem conter CVEs conhecidas:

| Dependência | Versão Atual | Observação |
|-------------|-------------|------------|
| `spring-boot-starter-parent` | 3.2.5 | Verificar CVEs recentes — versão 3.4.x disponível |
| `springdoc-openapi-starter-webmvc-ui` | 2.0.2 | Versão antiga — verificar CVEs |
| `jjwt-api` / `jjwt-impl` / `jjwt-jackson` | 0.11.5 | Versão desatualizada — 0.12.x disponível |
| `spring-boot-devtools` | (via parent) | **Nunca incluir em artefatos de produção** |
| `h2` | (via parent) | Verificar se está ativo apenas em testes |

**Correção necessária:**
- Configurar dependabot ou renovate bot no repositório
- Executar regularmente `mvn versions:display-dependency-updates`
- Garantir que `devtools` e `h2` têm escopo `test` ou `optional`:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <scope>runtime</scope>
    <optional>true</optional> <!-- excluído do jar final -->
</dependency>
```

---

### A06-02 — Dependências Frontend Sem Auditoria Formal (npm)

**Risco:** 🟡 MÉDIO  
**Arquivo:** `Frontend/package.json`

**Descrição:**  
O projeto usa diversas dependências com versões fixadas por `^` (permite atualizações de minor/patch automáticas). Bibliotecas como `xlsx`, `jspdf`, `axios` e `highcharts` historicamente apresentaram CVEs. Não há evidência de `npm audit` automatizado ou política de atualização.

**Dependências de alto risco histórico a monitorar:**

| Dependência | Versão | Observação |
|-------------|--------|------------|
| `xlsx` | ^0.18.5 | Múltiplos CVEs históricos — avaliar alternativas |
| `axios` | ^1.13.5 | Verificar CVEs recentes |
| `highcharts-react-official` | ^3.2.3 | Verificar compatibilidade com Highcharts |
| `jspdf` | ^3.0.0 | Verificar CVEs |

**Correção necessária:**
- Executar `npm audit` regularmente e corrigir vulnerabilidades altas/críticas
- Configurar GitHub Dependabot para PRs automáticos de atualização
- Adicionar step de `npm audit --audit-level=high` no CI/CD que falha o build se houver vulnerabilidades altas

```bash
# Executar agora
npm audit
npm audit fix
```

---

## Resumo Executivo

### Distribuição de Riscos

| OWASP | Crítico | Alto | Médio | Baixo | Total |
|-------|---------|------|-------|-------|-------|
| A01 — Broken Access Control | — | 2 | 2 | — | 4 |
| A02 — Cryptographic Failures | 1 | 1 | 2 | — | 4 |
| A03 — Injection | — | — | — | 1 | 1 |
| A04 — Insecure Design | — | — | 2 | 2 | 4 |
| A05 — Security Misconfiguration | — | 2 | 2 | 2 | 6 |
| A06 — Outdated Components | — | — | 2 | — | 2 |
| **Total** | **1** | **5** | **10** | **5** | **21** |

---

### Prioridade de Correção

#### Imediato (antes de qualquer deploy em produção)

1. **[A02-01]** Rotacionar e externalizar todas as credenciais do `application.properties` para variáveis de ambiente
2. **[A01-02]** Usar o `role` do banco, não do JWT, para construir `authorities` no `JwtAuthFilter`
3. **[A05-01]** Desabilitar Swagger em produção
4. **[A05-02]** Mudar `ddl-auto` para `validate` e `show-sql` para `false` em produção

#### Curto Prazo (próximo sprint)

5. **[A01-03]** Proteger `/api/imagens/**` com autenticação
6. **[A02-02]** Avaliar migração do JWT de `localStorage` para `httpOnly cookie`
7. **[A04-03]** Remover `console.log` com dados pessoais (PII)
8. **[A05-03]** Tornar mensagens de erro do `GlobalExceptionHandler` genéricas
9. **[A04-01]** Adicionar `@Valid` em todos os endpoints PATCH
10. **[A05-04]** Restringir CORS para origens específicas em produção

#### Médio Prazo (próximas 2–4 semanas)

11. **[A01-04]** Implementar verificação de ownership nos services para rotas com `PROFESSOR`
12. **[A04-02]** Remover `@CrossOrigin` dos controllers individuais
13. **[A06-01/02]** Configurar auditoria automática de dependências (Dependabot + `npm audit` no CI)
14. **[A05-05]** Adicionar headers de segurança HTTP (CSP, HSTS)
15. **[A02-03]** Corrigir fallback do `JwtUtil.getBytes()` para usar `StandardCharsets.UTF_8`

---

### Observação sobre `.gitignore`

O `.gitignore` do backend exclui `application.properties` e o `.gitignore` do frontend exclui `.env` — isso é positivo e reduz o risco de vazamento de credenciais via git. Manter essa prática e verificar periodicamente que nenhum commit acidental incluiu esses arquivos:

```bash
git log --all --full-history -- "**/application.properties"
git log --all --full-history -- "**/.env"
```

---

*Documento gerado via análise estática. Recomenda-se complementar com testes de penetração (DAST) e análise de composição de software (SCA) antes de colocar em produção.*
