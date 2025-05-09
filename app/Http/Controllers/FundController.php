<?php

namespace App\Http\Controllers;

use App\Http\Requests\FundFormRequest;
use App\Models\Fund;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class FundController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $fund = Fund::query();
        if($request->filled('search'))
        {
            $search = $request->search;
            $fund->where(fn($query) =>
            $query->where('fund_code', 'like', "%{$search}%")
                ->orWhere('fund_name', 'like', "%{$search}%")
            );
        }


        $fund = $fund->latest()->paginate(7)->withQueryString();
        $fund->getCollection()->transform(fn($fund) => [
            'id' => $fund->id,
            'fund_code' => $fund->fund_code,
            'fund_name' => $fund->fund_name,
        ]);
        return Inertia::render('fund/fund-index',[
            'funds' => $fund,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('fund/fund-form');
    }

    /**
     * Store a newly created resource in storage.
     * @param FundFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(FundFormRequest $request)
    {
        try {
            $fund = Fund::create([
                'fund_code' => $request->fund_code,
                'fund_name' => $request->fund_name,
            ]);

            if ($fund) {
                return redirect()->route('funds.index')->with('success', 'Fund created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create fund.');
            }
        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Fund $fund)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Fund $fund)
    {
        return Inertia::render('fund/fund-form', [
            'fund' => $fund,
            'isEdit' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Fund $fund)
    {
        if($fund)
        {
            $fund->fund_code = $request->fund_code;
            $fund->fund_name = $request->fund_name;
            $fund->save();
            return redirect()->route('funds.index')->with('success', 'Fund updated successfully.');
        }

        return redirect()->back()->with('error', 'Failed to update fund.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Fund $fund)
    {
        if($fund)
        {
            $fund->delete();
            return redirect()->route('funds.index')->with('success', 'Fund deleted successfully.');
        }

        return redirect()->back()->with('error', 'Failed to delete fund.');
    }

    public function getFundSuggestions(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        $suggestions = Fund::where('fund_name', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id', 'fund_name']); // Include 'id'

        return response()->json($suggestions);
    }
}
