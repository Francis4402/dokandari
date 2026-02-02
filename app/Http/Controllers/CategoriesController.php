<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Http\Requests\UpdateCategoriesRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Categories::all();

        return Inertia::render('dashboard/categories/index', [
            'categories' => $categories
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|string|max:255',
            'subcategories' => 'nullable|array',
            'subcategories.*' => 'string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp',
        ]);

        $categories = new Categories();

        $categories->categories = $validated['categories'];
        $categories->subcategory = json_encode($validated['subcategories'] ?? []);

        if ($request->file('image')) {
            $image = $request->file('image');

            $filename = time() . '_' . $image->getClientOriginalName();
            $path = public_path('category_images/' . $filename);

            $manager = new ImageManager(new Driver());
            $img = $manager->read($image->getPathname());
            $img->scaleDown(width: 800);
            $img->save($path, quality: 85);

            $categories->image = $filename;
        }

        $categories->save();
    }

    /**
     * Display the specified resource.
     */
    public function show(Categories $categories)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Categories $categories)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        // Find the category or fail
        $category = Categories::findOrFail($id);

        // Validate the request
        $validated = $request->validate([
            'categories' => 'required|string|max:255',
            'subcategories' => 'nullable|array',
            'subcategories.*' => 'string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp',
        ]);

        $category->categories = $validated['categories'];
        $category->subcategory = json_encode($validated['subcategories'] ?? []);

        if ($request->hasFile('image')) {
            $image = $request->file('image');

            // Delete old image if exists
            if ($category->image) {
                $oldImagePath = public_path('category_images/' . $category->image);
                if (file_exists($oldImagePath)) {
                    @unlink($oldImagePath);
                }
            }

            $filename = time() . '_' . $image->getClientOriginalName();
            $path = public_path('category_images/' . $filename);

            $manager = new ImageManager(new Driver());
            $img = $manager->read($image->getPathname());
            $img->scaleDown(width: 800);
            $img->save($path, quality: 85);

            $category->image = $filename;
        }

        $category->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Categories::where('id', $id)->first();

        if($category->image) {
            @unlink(public_path('category_images/'.$category->image));
        }

        $category->delete();
    }
}
