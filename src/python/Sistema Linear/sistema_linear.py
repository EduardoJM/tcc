from sympy import symbols, Matrix
from sympy.solvers import linsolve

l, C, D = symbols('l C D')

A = Matrix([
    [2, 3 * l ,  4 * l**2      ,  C  ],
    [1, 2 * l ,  3 * l**2      ,  C/2],
    [8, 18 * l,  144 / 5 * l**2,  D  ]
])

a2, a3, a4 = symbols("a2 a3 a4")
sol, = linsolve(A, [a2, a3, a4])

print(sol)