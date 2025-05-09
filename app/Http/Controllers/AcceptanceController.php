<?php

namespace App\Http\Controllers;

use App\Http\Requests\AcceptanceFormRequest;
use App\Models\Acceptance;
use App\Models\Category;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AcceptanceController extends Controller
{   


    public function index(Request $request)
    {
        // $user = User::find(1);
        // $user->assignRole('admin');
        // if ($user->hasRole('admin')) {
        //     dd('User is an admin');
        // } else {
        //     dd('User is NOT an admin');
        // }

        $acceptance = Acceptance::query();
        $search = $request->search;
        $status = $request->status;
        if($request->filled('search'))
        {
            $search = $request->search;
            $acceptance->where(fn($query) =>
            $query->where('RIS_number', 'like', "%{$search}%")
                ->orWhere('acceptance_date', 'like', "%{$search}%")
                ->orWhereHas('item', function ($query) use ($search) {
                    $query->where('item_code', 'like', "%{$search}%");
                })
            );
        }

        if($status){
            $acceptance->where('status', $status);
        }

        // $grandTotal = Acceptance::sum('total_price');
        // $RIS_number = $request->input('RIS_number');
        $grandTotal = Acceptance::where('RIS_number', 'like', "%{$search}%")->sum('total_price');
        $acceptance = $acceptance->latest()->paginate(7)->withQueryString();
        $acceptance->getCollection()->transform(fn($acceptance) => [
            'id' => $acceptance->id,
            'item_id' => $acceptance->item_id,
            'item_code' => $acceptance->item->item_code,
            'item_description' => $acceptance->item->item_description,
            'unit_name' => $acceptance->item->unit_name,
            'fund_id' => $acceptance->fund_id,
            'fund_name' => $acceptance->fund->fund_name,
            'category_id' => $acceptance->category_id,
            'office_id' => $acceptance->office_id,
            'office_name' => $acceptance->office->office_name,
            'RIS_number' => $acceptance->RIS_number,
            'SSMI_date' => $acceptance->SSMI_date,
            'acceptance_date' => $acceptance->acceptance_date,
            'qty' => $acceptance->qty,
            'unit_price' => $acceptance->unit_price,
            'total_price' => $acceptance->total_price,
            // for issuance section
            'issuance_date' => $acceptance->issuance_date,
            'issuance_qty' => $acceptance->issuance_qty,
            'issuance_unit_price' => $acceptance->issuance_unit_price,
            'issuance_total_price' => $acceptance->issuance_total_price,
            'balance' => $acceptance->balance,
            'status' => $acceptance->status,
            
            
        ]);
        return Inertia::render('acceptance/acceptance-index',[
            'acceptances' => $acceptance,
            'filters' => $request->only(['search']),
            'grandTotal' => $grandTotal,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // go to the create page
        $categories = Category::all();
        return inertia('acceptance/acceptance-form',[
            'categories' => $categories,
            'isEdit' => false,
        ]);


    }

    /**
     * Store a newly created resource in storage.
     * @param AcceptanceFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(AcceptanceFormRequest $request)
    {
        try {
            // Create a new acceptance record
            $acceptance = Acceptance::create([
                'item_id' => $request->item_id, // Item ID
                'fund_id' => $request->fund_id, // Fund ID
                'category_id' => $request->category_id, // Category ID
                'office_id' => $request->office_id, // Office ID
                'user_id' => \Illuminate\Support\Facades\Auth::id(), // Assuming the user is authenticated
                'RIS_number' => $request->RIS_number, // RIS Number
                'SSMI_date' => $request->SSMI_date ? Carbon::parse($request->SSMI_date)->format('Y-m') : null,
                'acceptance_date' => $request->acceptance_date, // Acceptance Date
                'qty' => $request->qty, // Quantity
                'unit_price' => $request->unit_price, // Unit Price
                'total_price' => $request->total_price, // Total Price

                // for issuance section
                'issuance_date' => $request->issuance_date,
                'issuance_qty' => $request->issuance_qty,
                'issuance_unit_price' => $request->issuance_unit_price,
                'issuance_total_price' => $request->issuance_total_price,
                'balance' => $request->balance,
                'status' => $request->status
            ]);
    
            // Redirect with success message
            if ($acceptance) {
                // return redirect()->route('acceptances.index')->with('success', 'Acceptance created successfully.');
                // return in the same page
                return redirect()->back()->with('success', 'Acceptance created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create acceptance.');
            }
        } catch (\Exception $e) {
            // Log the error for debugging
            Log::error('Error creating acceptance: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Acceptance $acceptance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Acceptance $acceptance)
    {
        // get category
        
        $acceptance = Acceptance::with('item', 'fund', 'category', 'office')->find($acceptance->id);
        // dd($acceptance);

        return Inertia::render('acceptance/acceptance-form', [
            'acceptance' => $acceptance,
            'isEdit' => true,
        ]);

        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Acceptance $acceptance)
    {
        // dd($request->all());
        if($acceptance)
        {
            $acceptance->item_id = $request->item_id;
            $acceptance->fund_id = $request->fund_id;
            $acceptance->category_id = $request->category_id;
            $acceptance->office_id = $request->office_id;
            $acceptance->user_id = \Illuminate\Support\Facades\Auth::id();
            $acceptance->RIS_number = $request->RIS_number;
            // Format the acceptance_date to only include year and month
            

            $acceptance->SSMI_date = Carbon::parse($request->SSMI_date)->format('Y-m');

            $acceptance->acceptance_date = $request->acceptance_date;
            $acceptance->qty = $request->qty;
            $acceptance->unit_price = $request->unit_price;
            $acceptance->total_price = $request->total_price;

            // for issuance section
            $acceptance->issuance_date = $request->issuance_date;
            $acceptance->issuance_qty = $request->issuance_qty;
            $acceptance->issuance_unit_price = $request->issuance_unit_price;
            $acceptance->issuance_total_price = $request->issuance_total_price;
            $acceptance->balance = $request->balance;
            $acceptance->status = $request->status;

            $acceptance->save();
            return redirect()->route('acceptances.index')->with('success', 'Acceptance updated successfully.');
        }

        return redirect()->back()->with('error', 'Failed to update acceptance.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Acceptance $acceptance)
    {
        if($acceptance)
        {
            $acceptance->delete();
            return redirect()->route('acceptances.index')->with('success', 'Acceptance deleted successfully.');
        }

        return redirect()->back()->with('error', 'Failed to delete acceptance.');
    }

    public function getRisSuggestions(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json([]);
        }

        $suggestions = Acceptance::where('RIS_number', 'like', "%{$query}%")
            ->limit(10)
            ->get(['id','RIS_number']); // Fetch matching RIS numbers

        return response()->json($suggestions);
    }

    public function getDataByRIS(Request $request)
    {
        $RIS_number = $request->input('RIS_number');
        $acceptances = Acceptance::with('item', 'fund', 'category', 'office')->where('RIS_number', $RIS_number)->get();
        return response()->json($acceptances);
    }

   
}
