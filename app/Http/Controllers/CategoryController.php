<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryFormRequest;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $category = Category::latest()->get()->map(fn($category) => [
        // ->map(fn($category) => [
        //     'id' => $category->id,
        //     'category_code' => $category->category_code,
        //     'category_name' => $category->category_name,
        //     'created_at' => $category->created_at->format('d M Y'),
        //     'updated_at' => $category->updated_at->format('d M Y'),
            // 'created_at' => $category->created_at->format('Y-m-d H:i:s'),
            // 'updated_at' => $category->updated_at->format('Y-m-d H:i:s'),
        // ]);

        $category = Category::query();
        if($request->filled('search'))
        {
            $search = $request->search;
            $category->where(fn($query) =>
            $query->where('category_code', 'like', "%{$search}%")
                ->orWhere('category_name', 'like', "%{$search}%")
            );
        }


        $category = $category->latest()->paginate(7)->withQueryString();
        $category->getCollection()->transform(fn($category) => [
            'id' => $category->id,
            'category_code' => $category->category_code,
            'category_name' => $category->category_name,
        ]);
        return Inertia::render('category/category-index',[
            'categories' => $category,
            'filters' => $request->only(['search']),
        ]);

        
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('category/category-form');
    }

    /**
     * Store a newly created resource in storage.
     * @param CategoryFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CategoryFormRequest $request)
    {

        try {
            $category = Category::create([
                'category_code' => $request->category_code,
                'category_name' => $request->category_name,
            ]);

            if ($category) {
                return redirect()->route('categories.index')->with('success', 'Category created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create category.');
            }
        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        return Inertia::render('category/category-form', [
            'category' => $category,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        if($category)
        {
            $category->category_code = $request->category_code;
            $category->category_name = $request->category_name;
            $category->save();
            return redirect()->route('categories.index')->with('success', 'Category updated successfully.');
        }

        return redirect()->back()->with('error', 'Failed to update category.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if($category)
        {
            $category->delete();
            return redirect()->route('categories.index')->with('success', 'Category deleted successfully.');
        }

        return redirect()->back()->with('error', 'Failed to delete category.');
    }

    public function getCategorySuggestions(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        $suggestions = Category::where('category_name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'category_name']); // Return both id and category_name

        return response()->json($suggestions);
    }
}
