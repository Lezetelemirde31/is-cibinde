import string

from app.utils import nanoid, slugify


class TestSlugify:
    def test_transliterates_azerbaijani_characters(self):
        assert slugify("İnformasiya texnologiyaları") == "informasiya-texnologiyalari"

    def test_lowercases_and_hyphenates(self):
        assert slugify("Senior Frontend Developer") == "senior-frontend-developer"

    def test_collapses_and_trims_separators(self):
        assert slugify("  Marketinq  &  Reklam!!  ") == "marketinq-reklam"

    def test_strips_diacritics(self):
        assert slugify("Gəncə") == "gence"

    def test_truncates_to_200_chars(self):
        assert len(slugify("a" * 500)) == 200

    def test_empty_and_symbol_only_input(self):
        assert slugify("") == ""
        assert slugify("!!!") == ""


class TestNanoid:
    def test_default_length(self):
        assert len(nanoid()) == 6

    def test_custom_length(self):
        assert len(nanoid(16)) == 16

    def test_uses_url_safe_alphabet(self):
        allowed = set(string.ascii_lowercase + string.digits)
        assert set(nanoid(200)) <= allowed

    def test_is_reasonably_unique(self):
        assert len({nanoid(12) for _ in range(1000)}) == 1000
