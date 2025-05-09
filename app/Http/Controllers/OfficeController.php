<?php

namespace App\Http\Controllers;

use App\Models\Office;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Http\Requests\OfficeFormRequest;

class OfficeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $office = Office::query();
        if($request->filled('search'))
        {
            $search = $request->search;
            $office->where(fn($query) =>
            $query->where('office_acronym', 'like', "%{$search}%")
                ->orWhere('office_name', 'like', "%{$search}%")
            );
        }


        $office = $office->latest()->paginate(7)->withQueryString();
        $office->getCollection()->transform(fn($office) => [
            'id' => $office->id,
            'office_acronym' => $office->office_acronym,
            'office_name' => $office->office_name,
        ]);
        return Inertia::render('office/office-index',[
            'offices' => $office,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('office/office-form');
    }

    /**
     * Store a newly created resource in storage.
     * @param OfficeFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(OfficeFormRequest $request)
    {
        try {
            $office = Office::create([
                'office_acronym' => $request->office_acronym,
                'office_name' => $request->office_name,
            ]);

            if ($office) {
                return redirect()->route('offices.index')->with('success', 'Office created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create office.');
            }
        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Office $office)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Office $office)
    {
        return Inertia::render('office/office-form', [
            'office' => $office,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Office $office)
    {
        if($office)
        {
            $office->office_acronym = $request->office_acronym;
            $office->office_name = $request->office_name;
            $office->save();
            return redirect()->route('offices.index')->with('success', 'Office updated successfully.');
        }

        return redirect()->back()->with('error', 'Failed to update office.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Office $office)
    {
        if($office)
        {
            $office->delete();
            return redirect()->route('offices.index')->with('success', 'Office deleted successfully.');
        }

        return redirect()->back()->with('error', 'Failed to delete office.');
    }

    public function getOfficeSuggestions(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        $suggestions = Office::where('office_name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'office_name']);

        return response()->json($suggestions);
    }
}
