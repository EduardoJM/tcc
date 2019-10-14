import numpy as np
from math import e
from sympy import symbols
from sympy.matrices import zeros
from sympy.solvers import linsolve
import matplotlib.pyplot as plt
from matplotlib.collections import EventCollection

#E, I, q = symbols('E I q')

E = 200
I = 50
q = 100
L = 1

n = 5
#space = 1/(n + 1)
#intervals = [0]
#for i in range(0, n):
#    intervals.append(space * (i + 1))
#intervals.append(1)

#print(intervals)

#def fi(i, x):
#    return x ** i
    #if x <= intervals[i - 1]:
    #    return 0
    #elif x <= intervals[i]:
    #    return ((x - intervals[i - 1]) / (intervals[i] - intervals[i - 1]))
    #elif x <= intervals[i + 1]:
    #    return ((intervals[i + 1] - x) / (intervals[i + 1] - intervals[i]))
    #else:
    #    return 0

#def fi_diff(i, x):
#    if i == 0:
#        return 0
#    return x ** (i - 1)
    #if x <= intervals[i - 1]:
    #    return 0
    #elif x <= intervals[i]:
    #    return (1 / (intervals[i] - intervals[i - 1]))
    #elif x <= intervals[i + 1]:
    #    return (1 / (intervals[i] - intervals[i + 1]))
    #else:
    #    return 0

#def fi_diff2(i, x):
#    if i <= 1:
#        return 0
#    return x ** (i - 2)

def integrate(func, start, end, *args):
    steps = 10000
    h = ((end - start) / steps)
    half = h / 2
    value = 0
    for i in range(0, steps):
        dh = func(start + h * i + half, *args)
        if i == 0 or i == steps:
            value += dh
        else:
            value += (2 * dh)
    return (value * (h / 2))

#def p(x):
#    return e**x

#def q(x):
#    return e**x

#def f(x):
#    return (x+(2-x)*e**x)

def a_intern(x, i, j):
    #return (p(x) * fi_diff(i, x) * fi_diff(j, x) + q(x) * fi(i, x) * fi(j, x))
    row_part = i * (i - 1) * (x ** (i - 2))
    column_part = E * I * j * (j - 1) * (x ** (j - 2))
    return column_part * row_part

def a(i, j):
    return integrate(a_intern, 0, L, i, j)

def b_intern(x, i):
    return q * ((x ** i) - (L ** (i - 1)))

def b(i):
    return integrate(b_intern, 0, L, i)

def func_intern(x, i, j):
    return x ** (i + j - 4)

A = zeros(n - 2, n - 1)
for i in range(0, n - 2):
    num = i + 2
    num_row_part = num * (num - 1) * E * I
    for j in range(0, n - 1):
        print (str(i) + "-" + str(j))
        if j == n - 2:
            A[i, j] = b(i + 2)
        else:
            # row i
            # column j
            k = j + 2
            num_col_part = k * (k - 1) * integrate(func_intern, 0, L, i, j)
            A[i, j] = num_row_part * num_col_part
            #A[i, j] = a(i + 2, j + 2)
print(A)

coeficients = symbols('a_2:{}'.format(n))
print(coeficients)

solution, = linsolve(A, coeficients)
print(solution)

exit(0)


def function_origin(x):
    return ((x - 1) * (e**(-x) - 1))

def function(solution, x):
    value = 0
    i = 0
    for c in solution:
        value += c * fi(i + 1, x)
        i = i + 1
    return value

ydata1 = []
for i in intervals:
    ydata1.append(function(solution, i))
fig = plt.figure()
ax = fig.add_subplot(1, 1, 1)
ax.plot(intervals, ydata1, color='tab:blue')
t = np.arange(0.0, 1.0, 0.01)
s = function_origin(t)
ax.plot(t, s, color='tab:orange')
#ax.plot(intervals, ydata2, color='tab:orange')

ax.set_title('Rayleigh-Ritz Implementation With n=' + str(n))

# display the plot
plt.show()

#for i in intervals:
#    err = abs(function(solution, i) - function_origin(i))
#    print("E: " + str(err))