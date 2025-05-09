<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Http\Requests\UserFormRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // get all users
        $users = User::all();
        return Inertia::render('user/user-index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('user/user-form');
    }
    /**
     * Store a newly created resource in storage.
     * @param UserFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(UserFormRequest $request)
    {
        
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            if ($user) {
                return redirect()->route('users.index')->with('success', 'User created successfully.');
            } else {
                return redirect()->back()->with('error', 'Failed to create user.');
            }
        } catch (\Exception $e) {
            Log::error('Error creating category: ' . $e->getMessage());
        }
    }

    public function edit(User $user)
    {
        return Inertia::render('user/user-form', [
            'user' => $user,
            'isEdit' => true,
        ]);
    }

    public function update(Request $request, User $user)
    {
        if($user)
        {
            $user->name = $request->name;
            $user->email = $request->email;
            $user->password = $request->password;
            $user->save();
            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        }
        else
        {
            return redirect()->back()->with('error', 'Failed to update user.');
        }
    }

    public function destroy(User $user)
    {
        if($user)
        {
            $user->delete();
            return redirect()->route('users.index')->with('success', 'User deleted successfully.');
        }
        else
        {
            return redirect()->back()->with('error', 'Failed to delete user.');
        }
    }

    public function __construct()
    {   
        $adminUser = User::find(1);
        if($adminUser)
        {
            $adminUser->assignRole('admin');
        }
        $this->middleware('auth');
        $this->middleware('verified');
        $this->middleware('role:admin');
    }
}
