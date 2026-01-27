<?php

namespace App\Http\Controllers;

use App\Models\Categories;
use App\Http\Requests\StoreCategoriesRequest;
use App\Http\Requests\UpdateCategoriesRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoriesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('dashboard/categories/index');
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
        ]);

        $categories = new Categories();
        $categories->categories = $validated['categories'];

        if ($request->file('image')) {
            $file = $request->file('image');
            @unlink(public_path('category_images' . $categories->image));
            $filename = date('YmdHi').$file->getClientOriginalName();
            $file->move(public_path('category_images'), $filename);
            $categories['image'] = $filename;
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
    public function update(UpdateCategoriesRequest $request, Categories $categories)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $category = Categories::find($id);

        if($category->image) {
            @unlink(public_path('category_images'.$category->image));
        }

        $category->delete();
    }
}
