<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OfficeFormRequest extends FormRequest
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
            'office_acronym' => 'required|string|max:255|unique:offices,office_acronym',
            'office_name' => 'required|string|max:255|unique:offices,office_name',
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
            'office_acronym.required' => 'The office acronym is required.',
            'office_acronym.string' => 'The office acronym must be a string.',
            'office_acronym.max' => 'The office acronym may not be greater than 255 characters.',
            'office_acronym.unique' => 'The office acronym has already been taken.',
            'office_name.required' => 'The office name is required.',
            'office_name.string' => 'The office name must be a string.',
            'office_name.max' => 'The office name may not be greater than 255 characters.',
            'office_name.unique' => 'The office name has already been taken.',
        ];
    }
}
