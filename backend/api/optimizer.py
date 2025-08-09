from ortools.linear_solver import pywraplp
from .pricing import gc_nm

def optimize_assignment(aircraft, legs):
    solver = pywraplp.Solver.CreateSolver("SCIP")
    if not solver:
        raise RuntimeError("No solver available")

    A = len(aircraft)
    L = len(legs)

    # Decision vars: x[a,l] ∈ {0,1}
    x = {(a, l): solver.IntVar(0, 1, f"x_{a}_{l}") for a in range(A) for l in range(L)}

    # Each leg must be assigned exactly once
    for l in range(L):
        solver.Add(sum(x[a, l] for a in range(A)) == 1)

    # Reposition cost (first-leg approximation)
    def reposition_nm(a, l):
        start = legs[l]["start"]
        pos = aircraft[a]["position"]
        d = gc_nm(pos, start)
        return float(d) if d is not None else 5000.0  # big penalty

    cost_expr = solver.Sum(x[a, l] * reposition_nm(a, l) for a in range(A) for l in range(L))
    solver.Minimize(cost_expr)

    status = solver.Solve()
    if status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
        return {"error": "No feasible assignment"}

    assignment = {ac["tail"]: [] for ac in aircraft}
    for a in range(A):
        for l in range(L):
            if x[a, l].solution_value() > 0.5:
                assignment[aircraft[a]["tail"]].append(legs[l]["id"])

    # ✅ Read objective value from the solver, not the expression
    objective_nm = solver.Objective().Value()

    return {"assignment": assignment, "objective_nm": objective_nm}
