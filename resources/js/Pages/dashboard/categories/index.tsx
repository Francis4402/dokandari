// Categories.tsx
import { useState } from 'react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import { Head, useForm, router } from '@inertiajs/react';
import {
  FaTrash,
  FaPlus,
  FaSearch,
  FaSortAmountDown,
  FaTag,
  FaFolder,
  FaChartBar,
  FaBoxes,
  FaTimes,
  FaExclamationCircle,
  FaUpload,
  FaMinus,
  FaEdit,
} from 'react-icons/fa';
import { categoryType, PageProps } from '@/types';
import { toast } from 'sonner';
import Eyebrow from '@/Pages/Components/Eyebrow';
import DeleteConfirmationDialog from '@/Pages/buttons/DeleteConfirmationDialog';


interface FormData {
  categories: string;
  subcategory: string[];
  image: File | null;
  remove_image?: boolean;
}

const Categories = ({ auth, categories: initialCategories }: PageProps<{ categories: categoryType[] }>) => {
    const categories = initialCategories || [];
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [selectedCategory, setSelectedCategory] = useState<categoryType | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState<categoryType | null>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<FormData>({
        categories: '',
        subcategory: [''],
        image: null,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [currentImagePath, setCurrentImagePath] = useState<string | null>(null);

    const addSubcategoryField = () => {
        setData('subcategory', [...data.subcategory, '']);
    };

    const removeSubcategoryField = (index: number) => {
        const newsubcategory = [...data.subcategory];
        newsubcategory.splice(index, 1);
        setData('subcategory', newsubcategory.length > 0 ? newsubcategory : ['']);
    };

    const updateSubcategory = (index: number, value: string) => {
        const newsubcategory = [...data.subcategory];
        newsubcategory[index] = value;
        setData('subcategory', newsubcategory);
    };

    const stats = {
        totalCategories: categories.length,
    };

    const parsesubcategory = (subcategoryString: string | null): string[] => {
        if (!subcategoryString) return [];
        try {
            return JSON.parse(subcategoryString);
        } catch (e) {
            return [];
        }
    };

    const filteredCategories = categories
        .filter(category =>
            category.categories.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        switch (sortBy) {
        case 'name-asc':
            return a.categories.localeCompare(b.categories);
        case 'name-desc':
            return b.categories.localeCompare(a.categories);
        case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        default:
            return a.categories.localeCompare(b.categories);
        }
    });

    const getCategoryColor = () => {
        return 'from-marigold to-marigold-dark';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setData('image', file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.categories.trim()) {
            toast.error('Category name is required');
            return;
        }

        const filteredsubcategory = data.subcategory.filter(subcat => subcat.trim() !== '');

        const formData = new FormData();
        formData.append('categories', data.categories.trim());

        if (filteredsubcategory.length > 0) {
            formData.append('subcategory', JSON.stringify(filteredsubcategory));
        } else {
            formData.append('subcategory', '[]');
        }

        if (data.image) {
            formData.append('image', data.image);
        }

        post(route('dashboard.storecategory'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                setShowAddModal(false);
                reset();
                setImagePreview(null);
                clearErrors();
                toast.success('Category added successfully!');
            },
            onError: (errors) => {
                console.error('Form errors:', errors);
                let errorMessage = 'Failed to add category. Please check the form.';

                if (errors.categories) {
                    errorMessage = errors.categories;
                } else if (errors.image) {
                    errorMessage = errors.image;
                } else if (errors.subcategory) {
                    errorMessage = errors.subcategory;
                }

                toast.error(errorMessage);
            },
            preserveScroll: true,
        });
    };

    const handleEdit = (category: categoryType) => {
        setCategoryToEdit(category);

        const parsed = parsesubcategory(category.subcategory);
        setData({
            categories: category.categories,
            subcategory: parsed.length > 0 ? parsed : [''],
            image: null,
        });

        if (category.image) {
            setCurrentImagePath(`/storage/${category.image}`);
        } else {
            setCurrentImagePath(null);
        }

        setImagePreview(null);
        setShowEditModal(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryToEdit) return;

        if (!data.categories.trim()) {
            toast.error('Category name is required');
            return;
        }

        const filteredsubcategory = data.subcategory
            .map(s => s.trim())
            .filter(s => s !== '');

        if (filteredsubcategory.length === 0) {
            toast.error('At least one subcategory is required');
            return;
        }

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('categories', data.categories.trim());
        formData.append('subcategory', JSON.stringify(filteredsubcategory));

        if (data.image) {
            formData.append('image', data.image);
        }

        router.post(route('dashboard.updatecategory', categoryToEdit.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Category updated successfully!');
                setShowEditModal(false);
                setCategoryToEdit(null);
                reset();
                setImagePreview(null);
                setCurrentImagePath(null);
                clearErrors();
            },
            onError: (errors) => {
                toast.error(errors.subcategory || 'Failed to update category.');
            },
        });
    };

    const handleDelete = (id: string) => {
        setCategoryToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (categoryToDelete) {
            router.delete(route('dashboard.deletecategory', categoryToDelete), {
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                    toast.success('Category deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete category.');
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                },
                preserveScroll: true,
            });
        }
    };

    const resetAddForm = () => {
        reset();
        setImagePreview(null);
        clearErrors();
        setShowAddModal(false);
    };

    const resetEditForm = () => {
        reset();
        setImagePreview(null);
        setCurrentImagePath(null);
        setCategoryToEdit(null);
        clearErrors();
        setShowEditModal(false);
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (categoryToEdit) {
            setCurrentImagePath(null);
        }
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Categories Management" />

            <div>
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <Eyebrow>Organize your products</Eyebrow>
                            <h1 className="text-[30px] sm:text-[36px] lg:text-[44px]">Categories</h1>
                            <p className="text-text-soft mt-1">Organize and manage your product categories</p>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                        >
                            <FaPlus className="h-4 w-4" />
                            Add New Category
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Total Categories</p>
                                    <p className="text-2xl font-bold text-ink mt-1">{stats.totalCategories}</p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-marigold/10 flex items-center justify-center">
                                    <FaFolder className="h-6 w-6 text-marigold" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Subcategories</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        {categories.reduce((total, cat) => total + parsesubcategory(cat.subcategory).length, 0)}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                                    <FaTag className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Recent Activity</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        {categories.length > 0 ? new Date(categories[0].created_at).getDate() : '0'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <FaChartBar className="h-6 w-6 text-purple-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-mono text-text-soft uppercase tracking-wide">Organized</p>
                                    <p className="text-2xl font-bold text-ink mt-1">
                                        {categories.length > 0 ? categories.length : '0'}
                                    </p>
                                </div>
                                <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                    <FaBoxes className="h-6 w-6 text-orange-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                />
                            </div>

                            <div className="relative">
                                <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-soft h-4 w-4" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full md:w-48 pl-10 pr-4 py-2 border border-line rounded-lg focus:ring-2 focus:ring-marigold focus:border-transparent appearance-none bg-white text-ink"
                                >
                                    <option value="name-asc">Name A-Z</option>
                                    <option value="name-desc">Name Z-A</option>
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-text-soft">
                                Showing <span className="font-semibold text-ink">{filteredCategories.length}</span> of <span className="font-semibold text-ink">{stats.totalCategories}</span> categories
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-sm text-marigold hover:text-marigold-dark font-medium flex items-center transition-colors"
                                >
                                    <FaTimes className="h-3 w-3 mr-1" />
                                    Clear Search
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Categories Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">All Categories</h2>
                                    <span className="text-sm text-text-soft font-mono">
                                        {filteredCategories.length} categories
                                    </span>
                                </div>

                                {filteredCategories.length === 0 ? (
                                    <div className="text-center py-12">
                                        <FaFolder className="h-16 w-16 text-text-soft mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-ink mb-2">No Categories Found</h3>
                                        <p className="text-text-soft mb-6">
                                            {searchTerm ? `No results for "${searchTerm}"` : 'No categories available'}
                                        </p>
                                        <button
                                            onClick={() => setShowAddModal(true)}
                                            className="inline-flex items-center px-6 py-3 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105"
                                        >
                                            <FaPlus className="h-4 w-4 mr-2" />
                                            Add Your First Category
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {filteredCategories.map(category => (
                                            <div key={category.id} className="border border-line rounded-xl p-4 hover:shadow-hard-sm transition-all duration-300 hover:-translate-y-0.5">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start space-x-3">
                                                        {category.image && (
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-line">
                                                                <img
                                                                    src={`/storage/${category.image}`}
                                                                    alt={category.categories}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <h3
                                                                className="text-lg font-semibold text-ink cursor-pointer hover:text-marigold transition-colors"
                                                                onClick={() => setSelectedCategory(category)}
                                                            >
                                                                {category.categories}
                                                            </h3>
                                                            {parsesubcategory(category.subcategory).length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {parsesubcategory(category.subcategory).slice(0, 2).map((subcat, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="px-2 py-0.5 bg-paper-dim text-text-soft text-xs rounded-full"
                                                                        >
                                                                            {subcat}
                                                                        </span>
                                                                    ))}
                                                                    {parsesubcategory(category.subcategory).length > 2 && (
                                                                        <span className="px-2 py-0.5 bg-paper-dim text-text-soft text-xs rounded-full">
                                                                            +{parsesubcategory(category.subcategory).length - 2} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-1">
                                                        <button
                                                            onClick={() => handleEdit(category)}
                                                            className="p-2 text-text-soft hover:text-marigold hover:bg-paper-dim rounded-lg transition-colors"
                                                            title="Edit category"
                                                        >
                                                            <FaEdit className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="p-2 text-text-soft hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete category"
                                                        >
                                                            <FaTrash className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-line">
                                                    <div className="flex items-center justify-between text-xs text-text-soft font-mono">
                                                        <span>Created: {new Date(category.created_at).toLocaleDateString()}</span>
                                                        <span>Updated: {new Date(category.updated_at).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {selectedCategory ? (
                                <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6 sticky top-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Category Details</h3>
                                        <button
                                            onClick={() => setSelectedCategory(null)}
                                            className="p-1 text-text-soft hover:text-ink transition-colors"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        {selectedCategory.image && (
                                            <div className="rounded-xl overflow-hidden mb-4 border border-line">
                                                <img
                                                    src={`/storage/${selectedCategory.image}`}
                                                    alt={selectedCategory.categories}
                                                    className="w-full h-48 object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200';
                                                    }}
                                                />
                                            </div>
                                        )}

                                        <div className={`text-center py-4 rounded-xl bg-gradient-to-r ${getCategoryColor()} text-white mb-4 shadow-hard-sm`}>
                                            <h4 className="font-bold text-lg">
                                                {selectedCategory.categories}
                                            </h4>
                                        </div>

                                        {parsesubcategory(selectedCategory.subcategory).length > 0 && (
                                            <div className="mb-6">
                                                <h5 className="text-xs font-mono text-text-soft uppercase tracking-wide mb-3">Subcategories</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {parsesubcategory(selectedCategory.subcategory).map((subcat, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-paper-dim text-ink text-sm rounded-full border border-line"
                                                        >
                                                            {subcat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2 bg-paper-dim rounded-xl p-4">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-soft">Created:</span>
                                                <span className="font-medium text-ink">{new Date(selectedCategory.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-soft">Last Updated:</span>
                                                <span className="font-medium text-ink">{new Date(selectedCategory.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-hard-sm border border-line p-6 text-white sticky top-6">
                                    <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] mb-4">Category Details</h3>
                                    <p className="text-sm text-gray-300 mb-6">
                                        Select a category from the list to view detailed information.
                                    </p>
                                    <div className="text-center">
                                        <FaFolder className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-sm text-gray-400">No category selected</p>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl shadow-hard-sm border border-line p-6">
                                <h3 className="text-lg font-display font-extrabold uppercase tracking-[-0.01em] text-ink mb-4">Recent Categories</h3>
                                <div className="space-y-4">
                                    {categories
                                        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                        .slice(0, 3)
                                        .map((category, index) => (
                                            <div key={category.id} className="flex items-center justify-between p-3 bg-paper-dim rounded-xl border border-line">
                                                <div className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-gradient-to-r ${getCategoryColor()} text-white font-bold text-sm`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-ink">{category.categories}</h4>
                                                        <p className="text-xs text-text-soft font-mono">
                                                            {new Date(category.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedCategory(category)}
                                                    className="text-marigold hover:text-marigold-dark text-sm font-medium transition-colors"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Category Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <form onSubmit={handleSubmit}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Add New Category</h3>
                                    <button
                                        type="button"
                                        onClick={resetAddForm}
                                        className="p-1 text-text-soft hover:text-ink rounded-lg hover:bg-paper-dim transition-colors"
                                    >
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.categories}
                                        onChange={(e) => setData('categories', e.target.value)}
                                        placeholder="Enter category name"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${
                                            errors.categories ? 'border-red-500' : 'border-line'
                                        }`}
                                        autoFocus
                                        required
                                    />
                                    {errors.categories && (
                                        <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-ink">
                                            Subcategories
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addSubcategoryField}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium"
                                        >
                                            <FaPlus className="h-3 w-3 mr-1" />
                                            Add Subcategory
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.subcategory.map((subcategory, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={subcategory}
                                                        onChange={(e) => updateSubcategory(index, e.target.value)}
                                                        placeholder={`Subcategory ${index + 1}`}
                                                        className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                                    />
                                                </div>
                                                {data.subcategory.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSubcategoryField(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Remove subcategory"
                                                    >
                                                        <FaMinus className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {errors.subcategory && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
                                    )}
                                    <p className="mt-2 text-sm text-text-soft">
                                        Add subcategories for better product organization
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        Category Image (Optional)
                                    </label>

                                    {imagePreview ? (
                                        <div className="mb-4 relative">
                                            <div className="w-full h-48 rounded-xl overflow-hidden border border-line">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-line rounded-xl p-6 text-center hover:border-marigold transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center mb-3">
                                                    <FaUpload className="h-6 w-6 text-text-soft" />
                                                </div>
                                                <p className="text-text-soft mb-2">Click to upload image</p>
                                                <p className="text-sm text-text-soft">PNG, JPG, WEBP up to 2MB</p>
                                                <label className="cursor-pointer mt-5">
                                                    <span className="px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 hover:shadow-lg">
                                                        Choose File
                                                    </span>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-line">
                                    <button type="button" onClick={resetAddForm} className="px-6 py-2 text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-6 py-2 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg ${
                                            processing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {processing ? 'Saving...' : 'Add Category'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Category Modal */}
            {showEditModal && categoryToEdit && (
                <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-hard-sm border border-line w-full max-w-lg overflow-y-auto max-h-[90vh]">
                        <form onSubmit={handleUpdate}>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-display font-extrabold uppercase tracking-[-0.01em] text-ink">Edit Category</h3>
                                    <button type="button" onClick={resetEditForm} className="p-1 text-text-soft hover:text-ink rounded-lg hover:bg-paper-dim transition-colors">
                                        <FaTimes className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.categories}
                                        onChange={(e) => setData('categories', e.target.value)}
                                        placeholder="Enter category name"
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft ${
                                            errors.categories ? 'border-red-500' : 'border-line'
                                        }`}
                                        autoFocus
                                        required
                                    />
                                    {errors.categories && (
                                        <p className="mt-1 text-sm text-red-600">{errors.categories}</p>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-ink">
                                            Subcategories
                                        </label>
                                        <button
                                            type="button"
                                            onClick={addSubcategoryField}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-marigold/10 text-marigold rounded-lg hover:bg-marigold/20 transition-colors font-medium"
                                        >
                                            <FaPlus className="h-3 w-3 mr-1" />
                                            Add Subcategory
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {data.subcategory.map((subcategory, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <div className="flex-1">
                                                    <input
                                                        type="text"
                                                        value={subcategory}
                                                        onChange={(e) => updateSubcategory(index, e.target.value)}
                                                        placeholder={`Subcategory ${index + 1}`}
                                                        className="w-full px-4 py-2 border border-line rounded-xl focus:ring-2 focus:ring-marigold focus:border-transparent bg-white text-ink placeholder:text-text-soft"
                                                    />
                                                </div>
                                                {data.subcategory.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSubcategoryField(index)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Remove subcategory"
                                                    >
                                                        <FaMinus className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {errors.subcategory && (
                                        <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
                                    )}
                                    <p className="mt-2 text-sm text-text-soft">
                                        Add subcategories for better product organization
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-ink mb-2">
                                        Category Image
                                    </label>

                                    {imagePreview ? (
                                        <div className="mb-4 relative">
                                            <div className="w-full h-48 rounded-xl overflow-hidden border border-line">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                            >
                                                <FaTimes className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : currentImagePath ? (
                                        <div className="mb-4 relative">
                                            <div className="w-full h-48 rounded-xl overflow-hidden border border-line">
                                                <img
                                                    src={currentImagePath}
                                                    alt="Current"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex justify-center items-center space-x-2 mt-3">
                                                <label className="cursor-pointer">
                                                    <span className="px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300 text-sm">
                                                        Change Image
                                                    </span>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 text-sm"
                                                >
                                                    Remove Image
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-line rounded-xl p-6 text-center hover:border-marigold transition-colors">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center mb-3">
                                                    <FaUpload className="h-6 w-6 text-text-soft" />
                                                </div>
                                                <p className="text-text-soft mb-2">Click to upload image</p>
                                                <p className="text-sm text-text-soft">PNG, JPG, WEBP up to 2MB</p>
                                                <label className="cursor-pointer mt-5">
                                                    <span className="px-4 py-2 bg-gray-900 hover:bg-marigold text-white rounded-xl transition-all duration-300">
                                                        Choose File
                                                    </span>
                                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {errors.image && (
                                        <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-line">
                                    <button type="button" onClick={resetEditForm} className="px-6 py-2 text-text-soft hover:text-ink font-medium rounded-xl hover:bg-paper-dim transition-colors">
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`px-6 py-2 bg-gray-900 hover:bg-marigold text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg ${
                                            processing ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {processing ? 'Updating...' : 'Update Category'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Category"
                message="Are you sure you want to delete this category? This action cannot be undone."
                isDeleting={false}
            />
        </DashboardLayout>
    );
};

export default Categories;
