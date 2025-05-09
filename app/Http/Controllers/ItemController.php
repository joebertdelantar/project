<?php

namespace App\Http\Controllers;

use App\Http\Requests\ItemFormRequest;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $item = Item::query();
        if($request->filled('search'))
        {
            $search = $request->search;
            $item->where(fn($query) =>
            $query->where('item_code', 'like', "%{$search}%")
                ->orWhere('item_name', 'like', "%{$search}%")
                ->orWhere('item_description', 'like', "%{$search}%")
                ->orWhere('unit_name', 'like', "%{$search}%")
            );
        }


        $item = $item->latest()->paginate(7)->withQueryString();
        $item->getCollection()->transform(fn($item) => [
            'id' => $item->id,
            'item_code' => $item->item_code,
            'item_name' => $item->item_name,
            'item_description' => $item->item_description,
            'unit_name' => $item->unit_name,
        ]);
        return Inertia::render('item/items-index',[
            'items' => $item,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('item/items-form');
    }

    /**
     * Store a newly created resource in storage.
     * @param ItemFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ItemFormRequest $request)
    {
        try {
            $item = Item::create([
                'item_code' => $request->item_code,
                'item_name' => $request->item_name,
                'item_description' => $request->item_description,
                'unit_name' => $request->unit_name,
            ]);

            if ($item) {
                return redirect()->route('items.index')->with('success', 'Item created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create item.');
            }
        } catch (\Exception $e) {
            Log::error('Error creating item: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        return Inertia::render('item/items-form', [
            'item' => $item,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Item $item)
    {
        if($item)
        {
            $item->item_code = $request->item_code;
            $item->item_name = $request->item_name;
            $item->item_description = $request->item_description;
            $item->unit_name = $request->unit_name;
            $item->save();
            return redirect()->route('items.index')->with('success', 'Item updated successfully.');
        }

        return redirect()->back()->with('error', 'Failed to update item.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        if($item)
        {
            $item->delete();
            return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
        }

        return redirect()->back()->with('error', 'Failed to delete item.');
    }

    public function getItemSuggestions(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        $items = Item::where('item_code', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id','item_code', 'item_description', 'unit_name']);

        return response()->json($items);
    }
}
