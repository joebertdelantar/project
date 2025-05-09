<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ItemFormRequest extends FormRequest
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
            'item_code' => 'required|string|max:255|unique:items,item_code',
            'item_name' => 'required|string|max:255|unique:items,item_name',
            'item_description' => 'required|string|max:255',
            'unit_name' => 'required|string|max:255',
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
            'item_code.required' => 'The item code is required.',
            'item_code.string' => 'The item code must be a string.',
            'item_code.max' => 'The item code may not be greater than 255 characters.',
            'item_code.unique' => 'The item code has already been taken.',
            'item_name.required' => 'The item name is required.',
            'item_name.string' => 'The item name must be a string.',
            'item_name.max' => 'The item name may not be greater than 255 characters.',
            'item_name.unique' => 'The item name has already been taken.',
            'item_description.required' => 'The item description is required.',
            'item_description.string' => 'The item description must be a string.',
            'item_description.max' => 'The item description may not be greater than 255 characters.',
            'unit_name.required' => 'The item unit is required.',
            'unit_name.string' => 'The item unit must be a string.',
            'unit_name.max' => 'The item unit may not be greater than 255 characters.',
        ];
    }

}
