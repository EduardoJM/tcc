from sympy import symbols, integrate, diff, Matrix
from sympy.solvers import solve

l, E, I, x, q = symbols('l E I x q')
a2, a3, a4 = symbols("a2 a3 a4")

v = a2 * (x**2 - l*x) 
v = v + a3 * (x**3 - l**2 * x)
v = v + a4 * (x**4 - l**3 * x)

dv = diff(v, x)
dv2 = diff(dv, x)

f = (E*I*((dv2)**2)) / 2 - q * v

df_a2 = diff(f, a2)
df_a3 = diff(f, a3)
df_a4 = diff(f, a4)

eq1 = integrate(df_a2, (x, 0, l))
eq2 = integrate(df_a3, (x, 0, l))
eq3 = integrate(df_a4, (x, 0, l))

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