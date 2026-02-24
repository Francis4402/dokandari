<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
        try {
            $validated = $request->validate([
                'categories' => 'required|string|max:255',
                'subcategory'   => 'required|array|min:1',
                'subcategory.*' => 'required|string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            $category = new Categories();
            $category->categories = $validated['categories'];
            $category->subcategory = json_encode($validated['subcategory'] ?? []);

            if ($request->hasFile('image')) {
                $image = $request->file('image');

                $manager = new ImageManager(new Driver());
                $img = $manager->read($image->getRealPath());
                $img->scaleDown(width: 800);

                $filename = 'category_' . time() . '_' . uniqid() . '.webp';
                $directory = 'category_images';
                $filePath = $directory . '/' . $filename;

                $encodedImage = (string) $img->toWebp(85);

                Storage::disk('public')->put($filePath, $encodedImage);

                $category->image = $filePath;
            }

            $category->save();

        } catch (\Exception) {
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create category. Please try again.']);
        }
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
    public function update(Request $request, $store)
    {
        $category = Categories::findOrFail($store);

        $validated = $request->validate([
            'categories' => 'required|string|max:255',
            'subcategory' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'remove_image' => 'nullable|boolean',
        ]);

        $category->categories = $validated['categories'];


        $category->subcategory = $validated['subcategory'] ?? json_encode([]);

        // Handle image removal
        if ($request->has('remove_image') && $request->remove_image) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
                $category->image = null;
            }
        }

        // Handle new image upload
        if ($request->hasFile('image')) {

            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }

            $image = $request->file('image');
            $manager = new ImageManager(new Driver());
            $img = $manager->read($image->getRealPath());
            $img->scaleDown(width: 800);

            $filename = 'category_' . time() . '_' . uniqid() . '.webp';
            $directory = 'category_images';
            $filePath = $directory . '/' . $filename;

            $encodedImage = (string) $img->toWebp(85);
            Storage::disk('public')->put($filePath, $encodedImage);

            $category->image = $filePath;
        }

        $category->save();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
         $category = Categories::findOrFail($id);


        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();
    }
}
