"""Smoke tests: the whole app graph imports and wires up without error.

`create_engine` is lazy (no connection is opened at import), so these run
without a live database.
"""


def test_app_imports_and_registers_routes():
    from app.main import app

    paths = {route.path for route in app.routes}  # type: ignore[attr-defined]
    # A representative endpoint from each router should be registered.
    for expected in [
        "/health",
        "/me",
        "/jobs",
        "/jobs/{slug}",
        "/companies",
        "/candidates",
        "/candidate/applications",
        "/employer/jobs",
        "/conversations",
        "/notifications",
        "/admin/jobs",
        "/uploads/presign",
        "/content/faqs",
        "/dashboard/stats",
    ]:
        assert expected in paths, f"missing route: {expected}"


def test_literal_routes_declared_before_param_routes():
    """`/jobs/latest` must be registered before `/jobs/{slug}` or it would
    never match. Guards against future route-ordering regressions."""
    from app.main import app

    ordered = [route.path for route in app.routes]  # type: ignore[attr-defined]
    assert ordered.index("/jobs/latest") < ordered.index("/jobs/{slug}")
    assert ordered.index("/companies/mine") < ordered.index("/companies/{slug}")
