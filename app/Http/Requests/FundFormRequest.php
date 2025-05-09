<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FundFormRequest extends FormRequest
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
            'fund_code' => 'required|string|max:255|unique:funds,fund_code',
            'fund_name' => 'required|string|max:255|unique:funds,fund_name',
        ];
    }

    public function messages(): array
    {
        return [
            'fund_code.required' => 'The fund code is required.',
            'fund_code.string' => 'The fund code must be a string.',
            'fund_code.max' => 'The fund code may not be greater than 255 characters.',
            'fund_code.unique' => 'The fund code has already been taken.',
            'fund_name.required' => 'The fund name is required.',
            'fund_name.string' => 'The fund name must be a string.',
            'fund_name.max' => 'The fund name may not be greater than 255 characters.',
            'fund_name.unique' => 'The fund name has already been taken.',
        ];
    }
}
