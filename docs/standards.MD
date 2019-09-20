# Padrões

## Nomes

São padrões para os nomes declarados nos comandos `\label` para diversos elementos, tais como Figuras, Equações, Tabelas, etc.

### Equações

- Prefixo: `eqn:`;
- Meio: `cap_{0}:`, onde `{0}` indica um ID para cada capítulo, ver os identificadores em [Padrões/Identificadores](#identificadores);
- Final: `{1}`, onde `{1}` indica algum ID para a equação específica.

**Exemplo:**
```tex
\label{eqn:cap_calc_var:euler_lagrange}
```

## Identificadores

### Capítulos

- Contexto Histórico: **contexto_hist**
- Cálculo Variacional: **calc_var**
- Método de Rayleigh-Ritz: **metodo_ray_ritz**

- Apêndice: Regra de Leibniz: **ap_leibniz**