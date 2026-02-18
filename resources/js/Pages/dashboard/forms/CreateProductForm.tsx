import DashboardLayout from '@/Layouts/DashboardLayout';
import { categoryType, storeType } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
  FaFileAlt,
  FaImage,
  FaBox,
  FaTag,
  FaDollarSign,
  FaHashtag,
  FaBookOpen,
  FaUpload,
  FaTimes,
  FaLink,
  FaStore,
  FaPercent,
  FaArrowLeft,
  FaEye,
  FaPlus,
  FaInfoCircle,
  FaCheckCircle,
  FaShoppingCart,
  FaArrowRight,
  FaChevronDown,
  FaWeightHanging,
  FaPalette,
  FaStar,
  FaHeading,
  FaParagraph,
  FaList,
  FaCode,
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaLink as FaLinkIcon,
  FaQuoteRight,
  FaListOl,
  FaListUl,
  FaUndo,
  FaRedo,
  FaEye as FaEyeIcon,
  FaPen,
} from 'react-icons/fa';
import {
  HiCheck,
  HiOutlineExclamationCircle,
} from 'react-icons/hi2';
import { toast } from 'sonner';

// Rich text editor toolbar button types
interface ToolbarButton {
  icon: React.ReactNode;
  command: string;
  title: string;
  value?: string;
}

interface productFormType {
    auth: {
        user: any;
    };
    store: storeType;
    categories: categoryType[];
}

// Product type matching your schema
export interface Product {
    id: string;
    user_id: string;
    store_id: string;
    name: string;
    images: string;
    slug: string;
    category: string;
    subcategory: string;
    quantity: number;
    regular_price: number;
    sale_price: number | null;
    description: string;
    color: string;
    product_type: 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular';
    inStock: boolean;
    rating: number;
    item_weight: number;
    review?: number;
    created_at: string;
    updated_at: string;
}

export default function CreateProductForm({auth, store, categories}: productFormType) {
  const imagesInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showSalePrice, setShowSalePrice] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [colorInputs, setColorInputs] = useState<string[]>(['']);

  // Rich text editor state
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Product type options matching your schema
  const productTypes = [
    { value: 'regular', label: 'Regular' },
    { value: 'featured', label: 'Featured' },
    { value: 'trending', label: 'Trending' },
    { value: 'top-selling', label: 'Top Selling' },
    { value: 'new-arrival', label: 'New Arrival' }
  ];

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    images: [],
    slug: '',
    category: '',
    subcategory: '',
    quantity: '1',
    regular_price: '',
    sale_price: '',
    description: '',
    color: [''],
    inStock: true,
    rating: '0',
    item_weight: '',
    store_id: store.id || '',
    product_type: 'regular' as 'top-selling' | 'trending' | 'featured' | 'new-arrival' | 'regular',
  });

  const discountPercentage = data.regular_price && data.sale_price
    ? Math.round((1 - parseFloat(data.sale_price) / parseFloat(data.regular_price)) * 100) : 0;

  // Parse subcategories from the selected category
  const parseSubcategories = (subcategoryString: string | null): string[] => {
    if (!subcategoryString) return [];
    try {
      return JSON.parse(subcategoryString);
    } catch (e) {
      return [];
    }
  };

  // Rich text editor toolbar buttons
  const toolbarButtons: ToolbarButton[] = [
    { icon: <FaBold />, command: 'bold', title: 'Bold' },
    { icon: <FaItalic />, command: 'italic', title: 'Italic' },
    { icon: <FaUnderline />, command: 'underline', title: 'Underline' },
    { icon: <FaListUl />, command: 'insertUnorderedList', title: 'Bullet List' },
    { icon: <FaListOl />, command: 'insertOrderedList', title: 'Numbered List' },
    { icon: <FaQuoteRight />, command: 'formatBlock', value: 'blockquote', title: 'Quote' },
    { icon: <FaCode />, command: 'formatBlock', value: 'pre', title: 'Code Block' },
    { icon: <FaLinkIcon />, command: 'createLink', title: 'Insert Link' },
    { icon: <FaAlignLeft />, command: 'justifyLeft', title: 'Align Left' },
    { icon: <FaAlignCenter />, command: 'justifyCenter', title: 'Align Center' },
    { icon: <FaAlignRight />, command: 'justifyRight', title: 'Align Right' },
    { icon: <FaHeading />, command: 'formatBlock', value: 'h2', title: 'Heading' },
    { icon: <FaParagraph />, command: 'formatBlock', value: 'p', title: 'Paragraph' },
  ];

  // Initialize editor content from form data
  useEffect(() => {
    if (editorRef.current && data.description && editorMode === 'write') {
      editorRef.current.innerHTML = data.description;
    }
  }, [data.description, editorMode]);

  // Apply rich text formatting
  const applyFormatting = (button: ToolbarButton) => {
    if (!editorRef.current) return;

    // Focus the editor
    editorRef.current.focus();

    if (button.command === 'createLink') {
      const url = window.prompt('Enter the URL:');
      if (url) {
        document.execCommand(button.command, false, url);
      }
    } else if (button.value) {
      document.execCommand(button.command, false, button.value);
    } else {
      document.execCommand(button.command, false, undefined);
    }

    // Update the form data with the new HTML content
    setData('description', editorRef.current.innerHTML);
  };

  // Handle editor content change
  const handleEditorChange = () => {
    if (editorRef.current) {
      setData('description', editorRef.current.innerHTML);
    }
  };

  // Insert emoji
  const insertEmoji = (emoji: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    document.execCommand('insertText', false, emoji);

    setData('description', editorRef.current.innerHTML);
    setShowEmojiPicker(false);
  };

  // Common emojis for product descriptions
  const commonEmojis = [
    '😊', '👍', '⭐', '🔥', '✅', '🎁', '💯', '🚀', '💪', '✨',
    '🎨', '📦', '🛒', '💰', '💎', '🔋', '⚡', '🌟', '💫', '🎯'
  ];

  useEffect(() => {
    const validColors = colorInputs.filter(color => color.trim() !== '');
    setData('color', validColors);
  }, [colorInputs]);

  useEffect(() => {
    if (data.category) {
      const selectedCat = categories.find(cat => cat.categories === data.category);
      if (selectedCat && selectedCat.subcategory) {
        const subcategories = parseSubcategories(selectedCat.subcategory);
        setAvailableSubcategories(subcategories);

        if (data.subcategory && !subcategories.includes(data.subcategory)) {
          setData('subcategory', '');
        }
      } else {
        setAvailableSubcategories([]);
        setData('subcategory', '');
      }
    } else {
      setAvailableSubcategories([]);
      setData('subcategory', '');
    }
  }, [data.category, categories]);

  useEffect(() => {
    if (data.name && !data.slug) {
      const slug = data.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      setData('slug', slug);
    }
  }, [data.name]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    };
  }, []);

  const addColorInput = () => {
    setColorInputs([...colorInputs, '']);
  }

  const updateColorInput = (index: number, value: string) => {
    const newInputs = [...colorInputs];
    newInputs[index] = value;
    setColorInputs(newInputs);
  }

  const removeColorInput = (index: number) => {
    const newInputs = colorInputs.filter((_, i) => i !== index);
    setColorInputs(newInputs);

    if (newInputs.length === 0) {
      setColorInputs(['']);
    }
  };

  const getValidColors = () => {
    return colorInputs.filter(color => color.trim() !== '');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      setData('images', files as any);
      const previews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(previews);
      toast.success(`${files.length} image(s) uploaded!`);
    }
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);

    setData('images', newImages);
    setImagePreviews(newPreviews);
    toast.info('Image removed!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('category', data.category);
    formData.append('subcategory', data.subcategory);
    formData.append('quantity', data.quantity);
    formData.append('regular_price', data.regular_price);
    formData.append('sale_price', data.sale_price || '');
    formData.append('description', data.description);
    formData.append('color', JSON.stringify(data.color));
    formData.append('inStock', data.inStock.toString());
    formData.append('rating', data.rating);
    formData.append('store_id', data.store_id);
    formData.append('item_weight', data.item_weight);
    formData.append('product_type', data.product_type);

    // Append images
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    post(route('products.store'), {
      data: formData,
      onSuccess: () => {
        toast.success('Product created successfully!');
        router.visit(route('dashboard.products'));
        // Reset form
        reset();
        setShowSalePrice(false);
        imagePreviews.forEach(p => URL.revokeObjectURL(p));
        setImagePreviews([]);
        setShowCategoryDropdown(false);
        setShowSubcategoryDropdown(false);
        setAvailableSubcategories([]);
        setColorInputs(['']);
        if (editorRef.current) {
          editorRef.current.innerHTML = '';
        }
      },
      onError: () => {
        toast.error('Failed to create product. Please check the form for errors.');
      }
    });
  };

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof data
  ) => {
    const value = e.target.value;

    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setData(field, value as any);
    }
  };

  return (
    <DashboardLayout user={auth.user}>
      <Head title='Create Product'>
        <meta name="description" content="Create a new product for your store" />
        <meta name="keywords" content="shop, products, create product, ecommerce" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="max-w-7xl mx-auto p-5">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <FaBox className="h-8 w-8 text-purple-600" />
                Create New Product
              </h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <FaStore className="h-4 w-4" />
                Add a new product to {store.name}
              </p>
            </div>
            <Link
              href={route('dashboard.products')}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Link>
          </div>
        </div>

        {/* Store Status */}
        <div className="mb-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-white/20">
                <FaStore className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Store Ready!</h3>
                <p className="opacity-90">
                  Products will be added to: <span className="font-semibold">{store.name}</span>
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/20">
              <FaCheckCircle className="h-3 w-3 mr-1" />
              Active Store
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Product Information Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <FaBox className="h-5 w-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-800">Product Information</h2>
                </div>

                <div className="space-y-6">
                  {/* Row 1: Name and Slug */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Product Name */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <FaTag className="h-4 w-4" />
                        Product Name <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          placeholder="Your Product Name"
                          className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      {errors.name && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Slug Field */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <FaLink className="h-4 w-4" />
                        Product Slug
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <FaFileAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <input
                            type="text"
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="premium-wireless-headphones"
                            className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const slug = data.name
                              .toLowerCase()
                              .replace(/[^\w\s-]/g, '')
                              .replace(/\s+/g, '-')
                              .replace(/--+/g, '-')
                              .trim();
                            setData('slug', slug);
                            toast.success('Slug generated!');
                          }}
                          disabled={!data.name}
                          className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FaArrowRight className="h-4 w-4" />
                          Generate
                        </button>
                      </div>
                      {errors.slug && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.slug}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Categories */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Main Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-left flex justify-between items-center hover:border-gray-400 transition-colors"
                        >
                          <span className={data.category ? 'text-gray-800' : 'text-gray-400'}>
                            {data.category || 'Select main category'}
                          </span>
                          <FaChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`}
                          />
                        </button>
                        {showCategoryDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                            {categories.map(cat => (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => {
                                  setData('category', cat.categories);
                                  setShowCategoryDropdown(false);
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center justify-between ${
                                  data.category === cat.categories ? 'bg-purple-50 text-purple-700' : ''
                                }`}
                              >
                                {cat.categories}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => data.category && setShowSubcategoryDropdown(!showSubcategoryDropdown)}
                          disabled={!data.category}
                          className={`w-full rounded-lg border px-4 py-3 text-left flex justify-between items-center transition-colors ${
                            !data.category
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <span className={data.subcategory ? 'text-gray-800' : 'text-gray-400'}>
                            {data.subcategory || (data.category ? 'Select subcategory' : 'Select main category first')}
                          </span>
                          {data.category && (
                            <FaChevronDown
                              className={`h-5 w-5 text-gray-400 transition-transform ${showSubcategoryDropdown ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>

                        {data.category && showSubcategoryDropdown && (
                          <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                            {availableSubcategories.length > 0 ? (
                              availableSubcategories.map((subcat, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    setData('subcategory', subcat);
                                    setShowSubcategoryDropdown(false);
                                  }}
                                  className={`w-full text-left px-4 py-3 hover:bg-purple-50 transition-colors flex items-center justify-between ${
                                    data.subcategory === subcat ? 'bg-purple-50 text-purple-700' : ''
                                  }`}
                                >
                                  {subcat}
                                  {data.subcategory === subcat && <HiCheck className="h-5 w-5 text-purple-600" />}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No subcategories available for this category
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {errors.subcategory && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.subcategory}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Quantity and Colors */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Quantity */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <FaHashtag className="h-4 w-4" />
                        Quantity
                      </label>
                      <div className="relative">
                        <FaHashtag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="number"
                          min="0"
                          value={data.quantity}
                          onChange={(e) => handleNumberInput(e, 'quantity')}
                          className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      {errors.quantity && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.quantity}
                        </p>
                      )}
                    </div>

                    {/* Colors */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Colors <span className="text-xs font-normal text-gray-500">(Add multiple)</span>
                      </label>

                      <div className="space-y-2">
                        {colorInputs.map((color, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="relative flex-1">
                              <FaPalette className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => updateColorInput(index, e.target.value)}
                                placeholder="Enter color name..."
                                className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>

                            {index === colorInputs.length - 1 ? (
                              <button
                                type="button"
                                onClick={addColorInput}
                                className="px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                              >
                                <FaPlus className="h-4 w-4" />
                                Add
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeColorInput(index)}
                                className="px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                              >
                                <FaTimes className="h-4 w-4" />
                                Remove
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Display added colors */}
                      {getValidColors().length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              Added Colors ({getValidColors().length})
                            </span>
                            <button
                              type="button"
                              onClick={() => setColorInputs([''])}
                              className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
                            >
                              <FaTimes className="h-3 w-3" />
                              Clear All
                            </button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {getValidColors().map((color, index) => (
                              <div
                                key={index}
                                className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-lg"
                              >
                                <span className="text-sm font-medium text-gray-800">
                                  {color}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {errors.color && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.color}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Item Weight */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <FaWeightHanging className="h-4 w-4" />
                      Item Weight (kg) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <FaWeightHanging className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={data.item_weight}
                        onChange={(e) => handleNumberInput(e, 'item_weight')}
                        placeholder="0.5"
                        className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    {errors.item_weight && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <HiOutlineExclamationCircle className="h-4 w-4" />
                        {errors.item_weight}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Used for shipping cost calculation (minimum 0.1 kg)
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <FaDollarSign className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">Pricing</h2>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Regular Price */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Regular Price <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={data.regular_price}
                          onChange={(e) => handleNumberInput(e, 'regular_price')}
                          placeholder="99.99"
                          className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      {errors.regular_price && (
                        <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                          <HiOutlineExclamationCircle className="h-4 w-4" />
                          {errors.regular_price}
                        </p>
                      )}
                    </div>

                    {/* Sale Price */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <FaPercent className="h-4 w-4" />
                          Sale Price
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="enable_sale"
                            checked={showSalePrice}
                            onChange={(e) => {
                              setShowSalePrice(e.target.checked);
                              if (!e.target.checked) setData('sale_price', '');
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <label htmlFor="enable_sale" className="text-sm text-gray-600">
                            Enable
                          </label>
                        </div>
                      </div>

                      {showSalePrice && (
                        <div>
                          <div className="relative">
                            <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max={parseFloat(data.regular_price) || undefined}
                              value={data.sale_price}
                              onChange={(e) => handleNumberInput(e, 'sale_price')}
                              placeholder="79.99"
                              className="w-full rounded-lg border border-gray-300 px-10 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                          </div>
                          {data.regular_price && data.sale_price && discountPercentage > 0 && (
                            <div className="flex items-center gap-3 mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <FaPercent className="h-3 w-3 mr-1" />
                                Save {discountPercentage}%
                              </span>
                              <span className="text-sm text-gray-600">
                                Save ${(parseFloat(data.regular_price) - parseFloat(data.sale_price)).toFixed(2)}
                              </span>
                            </div>
                          )}
                          {errors.sale_price && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                              <HiOutlineExclamationCircle className="h-4 w-4" />
                              {errors.sale_price}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rich Description Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-gray-800">Product Description</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditorMode('write')}
                      className={`px-3 py-1.5 rounded-l-lg text-sm font-medium transition-colors ${
                        editorMode === 'write'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaPen className="h-3 w-3 inline mr-1" />
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1.5 rounded-r-lg text-sm font-medium transition-colors ${
                        editorMode === 'preview'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <FaEyeIcon className="h-3 w-3 inline mr-1" />
                      Preview
                    </button>
                  </div>
                </div>

                {/* Rich Text Toolbar */}
                {editorMode === 'write' && (
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
                      {toolbarButtons.map((button, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => applyFormatting(button)}
                          title={button.title}
                          className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700"
                        >
                          {button.icon}
                        </button>
                      ))}
                      <div className="w-px h-6 bg-gray-300 mx-1" />
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700"
                        title="Insert Emoji"
                      >
                        😊
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          document.execCommand('undo', false, undefined);
                          if (editorRef.current) {
                            setData('description', editorRef.current.innerHTML);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700"
                        title="Undo"
                      >
                        <FaUndo />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          document.execCommand('redo', false, undefined);
                          if (editorRef.current) {
                            setData('description', editorRef.current.innerHTML);
                          }
                        }}
                        className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700"
                        title="Redo"
                      >
                        <FaRedo />
                      </button>
                    </div>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="mt-2 p-3 bg-white rounded-lg border border-gray-200 shadow-lg">
                        <div className="grid grid-cols-10 gap-1">
                          {commonEmojis.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="w-8 h-8 hover:bg-gray-100 rounded flex items-center justify-center text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Description Editor - Using contenteditable div */}
                {editorMode === 'write' ? (
                  <div>
                    <div
                      ref={editorRef}
                      contentEditable
                      onInput={handleEditorChange}
                      onBlur={handleEditorChange}
                      className="w-full min-h-[250px] rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent overflow-y-auto prose prose-sm max-w-none"
                      style={{
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                      }}
                      data-placeholder="Describe your product features, specifications, and benefits..."
                      suppressContentEditableWarning={true}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        <span className="font-medium">{data.description.replace(/<[^>]*>/g, '').length}</span> characters (plain text)
                      </p>
                      <p className="text-xs text-gray-500">
                        Use the toolbar above to format your text
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-[250px] p-4 border border-gray-200 rounded-lg bg-gray-50 prose prose-sm max-w-none">
                    {data.description ? (
                      <div dangerouslySetInnerHTML={{ __html: data.description }} />
                    ) : (
                      <p className="text-gray-400 text-center">No description provided</p>
                    )}
                  </div>
                )}

                {errors.description && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Images Upload Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <FaImage className="h-5 w-5 text-orange-600" />
                  <h2 className="text-xl font-bold text-gray-800">Product Images</h2>
                </div>

                <div>
                  <input
                    ref={imagesInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <div
                    onClick={() => imagesInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                      data.images.length === 0
                        ? 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {data.images.length === 0 ? (
                      <div className="space-y-4">
                        <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                          <FaUpload className="h-10 w-10 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">Click to upload images</p>
                          <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {imagePreviews.map((preview, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${i + 1}`}
                                className="w-full h-32 object-cover rounded-lg group-hover:opacity-75 transition-opacity"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeImage(i);
                                }}
                                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              >
                                <FaTimes className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">Click to add more images</p>
                      </div>
                    )}
                  </div>

                  {data.images.length > 0 && (
                    <p className="text-xs text-gray-500 mt-3 flex items-center gap-1">
                      <FaImage className="h-3 w-3" />
                      {data.images.length} image(s) selected
                    </p>
                  )}
                  {errors.images && (
                    <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                      <HiOutlineExclamationCircle className="h-4 w-4" />
                      {errors.images}
                    </p>
                  )}
                </div>
              </div>

              {/* Product Type Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <FaStar className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-800">Product Type</h2>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Product Type
                  </label>
                  <select
                    value={data.product_type}
                    onChange={(e) => setData('product_type', e.target.value as any)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    {productTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    Determines how the product appears in collections and promotions
                  </p>
                </div>
              </div>

              {/* Stock Status Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <FaShoppingCart className="h-5 w-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-800">Stock Status</h2>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={data.inStock}
                    onChange={(e) => setData('inStock', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="inStock" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaBox className="h-4 w-4" />
                    In Stock
                  </label>
                </div>
                {errors.inStock && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <HiOutlineExclamationCircle className="h-4 w-4" />
                    {errors.inStock}
                  </p>
                )}
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                  <FaEye className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">Product Preview</h2>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                    {imagePreviews[0] ? (
                      <div className="relative">
                        <img
                          src={imagePreviews[0]}
                          alt="Product preview"
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {discountPercentage > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                            -{discountPercentage}%
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-gray-200 group-hover:to-gray-300 transition-colors">
                        <FaBox className="h-16 w-16 text-gray-400 group-hover:text-gray-500 transition-colors" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 truncate">
                        {data.name || 'Product Name'}
                      </h3>

                      {/* Category and Color display */}
                      <div className="space-y-2 mt-2">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-1">
                          {data.category && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {data.category}
                            </span>
                          )}
                          {data.subcategory && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              {data.subcategory}
                            </span>
                          )}
                        </div>

                        {/* Colors */}
                        {getValidColors().length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {getValidColors().slice(0, 3).map((color, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                              >
                                {color}
                              </span>
                            ))}
                            {getValidColors().length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{getValidColors().length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Weight */}
                        {data.item_weight && (
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <FaWeightHanging className="h-3 w-3" />
                            Weight: {data.item_weight} kg
                          </div>
                        )}
                      </div>

                      {/* Price Display */}
                      <div className="mt-2">
                        {data.sale_price ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-green-600">
                              ${parseFloat(data.sale_price).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${parseFloat(data.regular_price).toFixed(2)}
                            </span>
                          </div>
                        ) : data.regular_price ? (
                          <span className="text-xl font-bold text-gray-800">
                            ${parseFloat(data.regular_price).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-xl font-bold text-gray-400">
                            $0.00
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          data.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {data.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        <span className="text-xs text-gray-500">
                          Qty: {data.quantity || 0}
                        </span>
                      </div>

                      {data.slug && (
                        <div className="mt-2 text-xs text-gray-500 truncate flex items-center gap-1">
                          <FaLink className="h-3 w-3" />
                          {data.slug}
                        </div>
                      )}

                      {/* Product Type Badge */}
                      {data.product_type !== 'regular' && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <FaStar className="h-3 w-3 mr-1" />
                            {data.product_type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <FaStore className="h-3 w-3" />
                          Store
                        </span>
                        <span className="font-medium text-gray-800">{store.name}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <FaBox className="h-3 w-3" />
                          Categories
                        </span>
                        <div className="text-right">
                          <div className="font-medium text-gray-800">{data.category || 'None'}</div>
                          {data.subcategory && (
                            <div className="text-xs text-gray-500">{data.subcategory}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <button
                  type="submit"
                  disabled={processing || !data.name || !data.category || !data.regular_price || !data.description || !data.item_weight}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
                >
                  {processing ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                      Creating Product...
                    </>
                  ) : (
                    <>
                      <FaPlus className="h-4 w-4" />
                      Create Product
                    </>
                  )}
                </button>

                <div className="mt-6 pt-6 border-t">
                  <div className="text-xs text-gray-500 space-y-2">
                    <p className="flex items-center gap-2">
                      <FaInfoCircle className="h-3 w-3" />
                      <span>Product will be added to: <span className="font-medium text-gray-700">{store.name}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <HiOutlineExclamationCircle className="h-3 w-3" />
                      <span>All required fields marked with * must be filled</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaWeightHanging className="h-3 w-3" />
                      <span>Item weight is required for shipping calculation</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaPercent className="h-3 w-3" />
                      <span>Sale price is optional but recommended for promotions</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaImage className="h-3 w-3" />
                      <span>High-quality images increase conversion by up to 30%</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaBookOpen className="h-3 w-3" />
                      <span>Rich text editor allows formatted product descriptions</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
