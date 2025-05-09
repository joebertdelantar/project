<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AcceptanceFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'item_name' => 'nullable|string|max:255', // Make item_name optional
            'item_id' => 'nullable|exists:items,id',  // Make item_id optional
            'user_id' => 'nullable|exists:users,id',  // Make user_id optional
            'item_id' => 'required|exists:items,id',
            'item_code' => 'required|string|max:255',
            'item_description' => 'required|string|max:255',
            'unit_name' => 'required|string|max:255',
            'SSMI_date' => 'nullable|date_format:Y-m', // Validate year and month only
            'fund_id' => 'required|exists:funds,id',
            'category_id' => 'required|exists:categories,id',
            'office_id' => 'required|exists:offices,id',
            'office_name' => 'required|string|max:255',
            // 'RIS_number' => ['required', 'regex:/^[A-Za-z0-9#\- ]+$/i', 'max:255'],
            'RIS_number' => ['required', 'regex:/^[A-Za-z0-9#\-\s(),.]+$/i', 'max:255'],


            // allows # in RIS_number

            'acceptance_date' => 'required|date',
            'qty' => 'required|integer',
            'unit_price' => 'required|numeric',
            'total_price' => 'required|numeric',

            // for issuance section
            'issuance_date' => 'nullable|date',
            'issuance_qty' => 'nullable|integer',
            'issuance_unit_price' => 'nullable|numeric',
            'issuance_total_price' => 'nullable|numeric',
            'balance' => 'nullable|numeric',
            'status' => 'nullable|string|max:255',

        ];
    }

    /**
     * Get the validation error messages.
     *
     * @return array
     */

     public function messages(): array
     {
         return [
             'item_id.required' => 'The item id is required.',
             'item_id.exists' => 'The item id does not exist.',
             'item_code.required' => 'The item code is required.',
             'item_code.string' => 'The item code must be a string.',
             'item_code.max' => 'The item code may not be greater than 255 characters.',
            //  'item_name.required' => 'The item name is required.',
            //  'item_name.string' => 'The item name must be a string.',
            //  'item_name.max' => 'The item name may not be greater than 255 characters.',
             'item_description.required' => 'The item description is required.',
             'item_description.string' => 'The item description must be a string.',
             'item_description.max' => 'The item description may not be greater than 255 characters.',
             'unit_name.required' => 'The unit name is required.',
             'unit_name.string' => 'The unit name must be a string.',
             'unit_name.max' => 'The unit name may not be greater than 255 characters.',
             'SSMI_date.required' => 'The SSMI date is required.',
             'SSMI_date.date' => 'The SSMI date must be a date.',
             'fund_id.required' => 'The fund id is required.',
             'fund_id.exists' => 'The fund id does not exist.',
             'category_id.required' => 'The category id is required.',
             'category_id.exists' => 'The category id does not exist.',
             'office_id.required' => 'The office id is required.',
             'office_id.exists' => 'The office id does not exist.',
            //  'user_id.required' => 'The user id is required.',
            //  'user_id.exists' => 'The user id does not exist.',
             'RIS_number.required' => 'The RIS number is required.',
             'RIS_number.string' => 'The RIS number must be a string.',
             'RIS_number.max' => 'The RIS number may not be greater than 255 characters.',
             'RIS_number.unique' => 'The RIS number has already been taken.',
             'acceptance_date.required' => 'The acceptance date is required.',
             'acceptance_date.date' => 'The acceptance date must be a date.',
             'qty.required' => 'The quantity is required.',
             'qty.integer' => 'The quantity must be an integer.',
             'unit_price.required' => 'The unit price is required.',
             'unit_price.numeric' => 'The unit price must be a number.',
             'total_price.required' => 'The total price is required.',
             'total_price.numeric' => 'The total price must be a number.',
             
         ];
     }
}
