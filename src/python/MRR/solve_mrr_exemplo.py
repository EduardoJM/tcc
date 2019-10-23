from sympy import symbols, integrate, Matrix
from sympy.solvers import solve

l, E, I, x, q = symbols('l E I x q')
a2, a3, a4 = symbols("a2 a3 a4")

eq1 = integrate(2*E*I*(2*a2 + 6*a3*x + 12*a4*x**2), (x, 0, l)) - integrate(q*x**2 - q*l*x, (x, 0, l))
eq2 = integrate(6*E*I*(2*a2*x + 6*a3*x**2 + 12*a4*x**3), (x, 0, l)) - integrate(q*x**3 - q*(l**2)*x, (x, 0, l))
eq3 = integrate(12*E*I*(2*a2*x**2 + 6*a3*x**3 + 12*a4*x**4), (x, 0, l)) - integrate(q*x**4 - q*(l**3)*x, (x, 0, l))

sol = solve([eq1, eq2, eq3], [a2, a3, a4])
print(sol)
a1 = -a2*l - a3*l**2 - a4 * l**3
a1 = a1.subs(a2, sol[a2])
a1 = a1.subs(a3, sol[a3])
a1 = a1.subs(a4, sol[a4])
print(a1)
v = a1*x + sol[a2]*x**2 + sol[a3]*x**3 + sol[a4]*x**4
print(v)
maxdef = v.subs(x, l/2)
print(maxdef)