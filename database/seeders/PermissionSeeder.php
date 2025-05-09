<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Defining permissions
        $permissions = [
            "role.view",
            "role.create",
            "role.edit",
            "role.delete",
            "categories.view",
            "categories.create",
            "categories.edit",
            "categories.delete",
            "funds.view",
            "funds.create",
            "funds.edit",
            "funds.delete",
            "offices.view",
            "offices.create",
            "offices.edit",
            "offices.delete",
            "items.view",
            "items.create",
            "items.edit",
            "items.delete",
            "acceptances.view",
            "acceptances.create",
            "acceptances.edit",
            "acceptances.delete",
            "reports.view",
            "reports.create",
            "reports.edit",
            "reports.delete",
            "users.view",
            "users.create",
            "users.edit",
            "users.delete",
        ];

        // Loop through and ensure permissions exist before creating
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }
    }
}
