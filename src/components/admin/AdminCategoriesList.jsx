import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  deleteCategory,
  getEventCategories,
} from "../../services/eventService";
import Table from "../common/Table";
import LoadingSpinner from "../common/LoadingSpinner";
import Alert from "../common/Alert";
import i18n from "../../lang/i18n";
import { Link, useNavigate } from "react-router-dom";
import Button from "../common/Button";

const AdminCategoriesList = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data } = await getEventCategories();

        // Add localized displayName field
        const language = i18n.language || "en";
        const processed = data.map((cat) => ({
          name: cat.translations?.[language]?.name || cat.name,
          slug: cat.slug,
          isActive: cat.isActive,
          translations: cat.translations, // ✅ Keep this
          id: cat._id, // or cat.id
        }));
        setCategories(processed);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(t("admin.categories.fetch_error"));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [t]);

  const columns = [
    {
      header: t("admin.categories.name"),
      accessor: "name",
    },
    {
      header: `${t("admin.categories.translations")} (EN)`,
      accessor: "translations",
      format: (translations) => translations?.en?.name || "-",
    },
    {
      header: `${t("admin.categories.translations")} (AR)`,
      accessor: "translations",
      format: (translations) => translations?.ar?.name || "-",
    },
    {
      header: t("admin.categories.status"),
      accessor: "isActive",
      format: (value) =>
        value ? t("admin.users.active") : t("admin.users.inactive"),
    },
    {
      header: t("admin.categories.actions"),
      accessor: "id", // or "_id"
      format: (id) => (
        <Button
          onClick={() => handleDelete(id)}
          type="button"
          className="bg-red-500 text-white hover:bg-red-600"
        >
          {t("admin.categories.delete")}
        </Button>
      ),
    },
  ];

  if (loading) {
    return <LoadingSpinner />;
  }
  const handleDelete = async (id) => {
    if (window.confirm(t("admin.categories.delete_confirm"))) {
      try {
        setLoading(true);
        // Call your delete API here
        await deleteCategory(id);
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("Error deleting category:", error);
        setError(
          `${t("admin.categories.delete_error")} -- ${
            error.response?.data?.message
          }`
        );
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{t("admin.categories.title")}</h1>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}

      <Table
        data={categories}
        columns={columns}
        emptyMessage={t("admin.categories.no_categories")}
      />

      {/* Button to navigate to create category page */}
      <div className="mb-4">
        <Button
          type="button"
          className="mt-5"
          onClick={() => navigate("/admin/categories/create")}
        >
          {t("admin.categories.add_new_category")}
        </Button>
      </div>
    </div>
  );
};

export default AdminCategoriesList;
