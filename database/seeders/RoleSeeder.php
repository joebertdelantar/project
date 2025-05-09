<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles only if they don't exist
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $editor = Role::firstOrCreate(['name' => 'editor']);
        $viewer = Role::firstOrCreate(['name' => 'viewer']);

        // Assign permissions only if they exist
        $admin->givePermissionTo(Permission::pluck('name')->toArray()); // Assign all permissions

        $editorPermissions = [
            'categories.view',
            'categories.create',
            'categories.edit',
            'categories.delete',
            'funds.view',
            'funds.create',
            'funds.edit',
            'funds.delete',
            'offices.view',
            'offices.create',
            'offices.edit',
            'offices.delete',
            'items.view',
            'items.create',
            'items.edit',
            'items.delete',
            'acceptances.view',
            'acceptances.create',
            'acceptances.edit',
            'acceptances.delete',
        ];

        // Assign editor permissions only if they exist in database
        $editor->givePermissionTo(Permission::whereIn('name', $editorPermissions)->pluck('name')->toArray());

        $viewerPermissions = [
            'categories.view',
            'funds.view',
            'offices.view',
            'items.view',
            'acceptances.view',
            'reports.view',
            'users.view',
            'role.view',
        ];

        $viewer->givePermissionTo(Permission::whereIn('name', $viewerPermissions)->pluck('name')->toArray());
    }
}
