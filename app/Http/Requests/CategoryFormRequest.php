<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CategoryFormRequest extends FormRequest
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
            'category_code' => 'required|string|max:255|unique:categories,category_code',
            'category_name' => 'required|string|max:255|unique:categories,category_name',
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
            'category_code.required' => 'The category code is required.',
            'category_code.string' => 'The category code must be a string.',
            'category_code.max' => 'The category code may not be greater than 255 characters.',
            'category_code.unique' => 'The category code has already been taken.',
            'category_name.required' => 'The category name is required.',
            'category_name.string' => 'The category name must be a string.',
            'category_name.max' => 'The category name may not be greater than 255 characters.',
            'category_name.unique' => 'The category name has already been taken.',
        ];
    }
}
