from app.services.uploads import validate_upload


class TestValidateUpload:
    def test_accepts_valid_pdf_cv(self):
        result = validate_upload("cv", "application/pdf", 1_000_000)
        assert result["ok"] is True

    def test_rejects_unknown_kind(self):
        result = validate_upload("banner", "image/png", 100)
        assert result["ok"] is False

    def test_rejects_disallowed_content_type(self):
        result = validate_upload("cv", "image/png", 100)
        assert result["ok"] is False

    def test_rejects_oversized_file(self):
        result = validate_upload("cv", "application/pdf", 9_000_000)
        assert result["ok"] is False

    def test_accepts_logo_svg(self):
        result = validate_upload("logo", "image/svg+xml", 500_000)
        assert result["ok"] is True

    def test_rejects_oversized_logo(self):
        result = validate_upload("logo", "image/png", 5_000_000)
        assert result["ok"] is False
